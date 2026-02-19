import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from catalog.models import Product, Category, Brand
from cart.models import Cart, CartItem

User = get_user_model()

def test_cart_workflow():
    print("--- Starting Cart Workflow Test ---")
    
    # 1. Setup Data
    try:
        user = User.objects.create_user(username='testcartuser', password='password123')
        print("User created")
    except Exception:
        user = User.objects.get(username='testcartuser')
        print("User retrieved")

    try:
        category, _ = Category.objects.get_or_create(name='Cart Test Cat', slug='cart-test-cat')
        brand, _ = Brand.objects.get_or_create(name='Cart Test Brand', slug='cart-test-brand')
        product, _ = Product.objects.get_or_create(
            slug='cart-test-product',
            defaults={
                'name': 'Cart Test Product',
                'category': category,
                'brand': brand,
                'price': 100.00,
                'stock': 50
            }
        )
        print(f"Product created: {product.slug}")
    except Exception as e:
        print(f"Error creating product: {e}")
        return

    # 2. Setup Client
    client = APIClient()
    client.force_authenticate(user=user)

    # 3. Test Add Item
    url = '/api/cart/add_item/'
    data = {
        'product_slug': product.slug,
        'quantity': 2
    }
    
    print(f"Sending POST to {url} with data: {data}")
    response = client.post(url, data, format='json')
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.data}")

    if response.status_code == 200:
        print("SUCCESS: Item added to cart")
        # Verify DB
        cart = Cart.objects.get(user=user)
        item = CartItem.objects.get(cart=cart, product=product)
        print(f"Cart Item Quantity in DB: {item.quantity}")
        if item.quantity >= 2:
             print("DB Verification Passed")
    else:
        print("FAILURE: Could not add item")

    # Clean up
    # user.delete() 
    # product.delete()

if __name__ == '__main__':
    test_cart_workflow()
