import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from catalog.models import Product, Category, Brand
from cart.models import Cart, CartItem
from orders.models import Order

User = get_user_model()

def test_order_creation():
    print("=== Testing Order Creation ===")
    
    # 1. Setup User and Product
    user_data = {'username': 'testuser_order', 'password': 'password123', 'email': 'test@example.com'}
    try:
        user = User.objects.get(username=user_data['username'])
        user.delete()
        print("Existing user deleted")
    except User.DoesNotExist:
        pass
        
    user = User.objects.create_user(**user_data)
    print(f"User created: {user.username}")

    category, _ = Category.objects.get_or_create(name="Test Category", slug="test-cat")
    brand, _ = Brand.objects.get_or_create(name="Test Brand", slug="test-brand")
    product, _ = Product.objects.get_or_create(
        slug="test-product-order",
        defaults={
            'name': 'Test Product Order',
            'price': 100.00,
            'category': category,
            'brand': brand,
            'image': 'test.jpg',
            'stock': 10
        }
    )
    print(f"Product ready: {product.name}")

    # 2. Add to Cart
    cart, _ = Cart.objects.get_or_create(user=user)
    CartItem.objects.create(cart=cart, product=product, quantity=2)
    print("Cart populated with 2 items")

    # 3. Create Order via API
    client = APIClient()
    client.force_authenticate(user=user)
    
    order_data = {
        'address': 'Minsk, Test St, 1',
        'phone': '+375291234567',
        'delivery_method': 'courier',
        'payment_method': 'card',
        'comment': 'Test order comment'
    }
    
    response = client.post('/api/orders/orders/create_order/', order_data, format='json')
    
    if response.status_code == 200:
        print("✓ Order created successfully via API")
        order_response = response.data
        print(f"Order ID: {order_response.get('id')}")
        
        # Verify DB
        order = Order.objects.get(id=order_response.get('id'))
        print(f"DB Verification - Phone: {order.phone}, Method: {order.delivery_method}")
        assert order.phone == order_data['phone']
        assert order.total_price == 200.00
        print("✓ DB verification passed")

        # 4. Test GET Orders List
        response = client.get('/api/orders/orders/')
        if response.status_code == 200:
            print("✓ GET Orders List successful")
            results = response.data.get('results', [])
            if results:
                first_order = results[0]
                print("First Order Items Structure:")
                if first_order['items']:
                    print(first_order['items'][0])
                else:
                    print("No items in order")
        else:
             print(f"✗ GET Orders List failed: {response.status_code}")
    else:
        print(f"✗ Order creation failed: {response.status_code}")
        print(response.data)

if __name__ == '__main__':
    test_order_creation()
