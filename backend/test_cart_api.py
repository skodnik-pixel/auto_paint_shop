"""
Скрипт для тестирования API корзины
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from accounts.models import User
from catalog.models import Product
from cart.models import Cart, CartItem
from rest_framework.authtoken.models import Token

def test_cart():
    print("=" * 70)
    print("ТЕСТИРОВАНИЕ КОРЗИНЫ")
    print("=" * 70)
    
    # 1. Проверяем пользователя
    print("\n1. Проверка пользователя...")
    try:
        user = User.objects.first()
        if not user:
            print("   ✗ Нет пользователей в базе!")
            print("   Создайте пользователя: python manage.py createsuperuser")
            return
        print(f"   ✓ Пользователь: {user.username}")
        
        # Проверяем токен
        token, created = Token.objects.get_or_create(user=user)
        print(f"   ✓ Токен: {token.key[:20]}...")
        
    except Exception as e:
        print(f"   ✗ Ошибка: {e}")
        return
    
    # 2. Проверяем товары
    print("\n2. Проверка товаров...")
    products = Product.objects.all()[:3]
    if not products:
        print("   ✗ Нет товаров в базе!")
        return
    
    print(f"   ✓ Найдено товаров: {Product.objects.count()}")
    for product in products:
        print(f"     - {product.name} (slug: {product.slug})")
    
    # 3. Проверяем корзину
    print("\n3. Проверка корзины...")
    cart, created = Cart.objects.get_or_create(user=user)
    print(f"   ✓ Корзина: {'создана' if created else 'найдена'}")
    print(f"   ✓ Товаров в корзине: {cart.items.count()}")
    
    # 4. Тестируем добавление товара
    print("\n4. Тест добавления товара...")
    test_product = products[0]
    
    try:
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=test_product,
            defaults={'quantity': 1}
        )
        
        if not created:
            cart_item.quantity += 1
            cart_item.save()
        
        print(f"   ✓ Товар добавлен: {test_product.name}")
        print(f"   ✓ Количество: {cart_item.quantity}")
        
    except Exception as e:
        print(f"   ✗ Ошибка при добавлении: {e}")
        import traceback
        traceback.print_exc()
    
    # 5. Показываем содержимое корзины
    print("\n5. Содержимое корзины:")
    cart_items = cart.items.all()
    if cart_items:
        for item in cart_items:
            print(f"   - {item.product.name}: {item.quantity} шт. × {item.product.price} BYN")
        total = sum(item.product.price * item.quantity for item in cart_items)
        print(f"\n   Итого: {total} BYN")
    else:
        print("   Корзина пуста")
    
    # 6. Проверяем URL эндпоинта
    print("\n6. Информация для тестирования через браузер:")
    print(f"   URL: http://127.0.0.1:8000/api/cart/")
    print(f"   Token: {token.key}")
    print(f"   Заголовок: Authorization: Token {token.key}")
    print(f"\n   Для добавления товара:")
    print(f"   POST http://127.0.0.1:8000/api/cart/add_item/")
    print(f"   Body: {{'product_slug': '{test_product.slug}', 'quantity': 1}}")
    
    print("\n" + "=" * 70)
    print("✓ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО")
    print("=" * 70)

if __name__ == '__main__':
    try:
        test_cart()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
