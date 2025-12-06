#!/usr/bin/env python
"""
Скрипт для тестирования функциональности корзины
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from django.contrib.auth import get_user_model
from catalog.models import Product
from cart.models import Cart, CartItem

User = get_user_model()

print("=" * 60)
print("ТЕСТИРОВАНИЕ КОРЗИНЫ")
print("=" * 60)

# Проверяем пользователей
users = User.objects.all()
print(f"\nПользователей в системе: {users.count()}")
if users.exists():
    for user in users[:3]:
        print(f"  - {user.email} (ID: {user.id})")

# Проверяем товары
products = Product.objects.all()
print(f"\nТоваров в системе: {products.count()}")
if products.exists():
    for product in products[:5]:
        print(f"  - {product.name} (Slug: {product.slug}, Stock: {product.stock})")

# Проверяем корзины
carts = Cart.objects.all()
print(f"\nКорзин в системе: {carts.count()}")
if carts.exists():
    for cart in carts:
        print(f"\n  Корзина пользователя: {cart.user.email}")
        items = cart.items.all()
        if items.exists():
            print(f"  Товаров в корзине: {items.count()}")
            for item in items:
                print(f"    - {item.product.name} x {item.quantity} = {item.get_total_price()} BYN")
            print(f"  Общая сумма: {cart.get_total_price()} BYN")
        else:
            print("  Корзина пуста")

# Тестируем добавление товара в корзину
print("\n" + "=" * 60)
print("ТЕСТ: Добавление товара в корзину")
print("=" * 60)

if users.exists() and products.exists():
    test_user = users.first()
    test_product = products.first()
    
    print(f"\nПользователь: {test_user.email}")
    print(f"Товар: {test_product.name} (Slug: {test_product.slug})")
    
    # Получаем или создаем корзину
    cart, created = Cart.objects.get_or_create(user=test_user)
    if created:
        print("✅ Создана новая корзина")
    else:
        print("✅ Используется существующая корзина")
    
    # Добавляем товар
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=test_product
    )
    
    if created:
        cart_item.quantity = 1
        cart_item.save()
        print(f"✅ Товар добавлен в корзину (количество: 1)")
    else:
        cart_item.quantity += 1
        cart_item.save()
        print(f"✅ Количество товара увеличено (новое количество: {cart_item.quantity})")
    
    print(f"\nИтого в корзине:")
    for item in cart.items.all():
        print(f"  - {item.product.name} x {item.quantity} = {item.get_total_price()} BYN")
    print(f"Общая сумма: {cart.get_total_price()} BYN")
else:
    print("❌ Недостаточно данных для теста")
    if not users.exists():
        print("  - Нет пользователей")
    if not products.exists():
        print("  - Нет товаров")

print("\n" + "=" * 60)
print("ТЕСТ ЗАВЕРШЕН")
print("=" * 60)
