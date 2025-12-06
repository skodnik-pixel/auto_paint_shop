#!/usr/bin/env python
"""
Скрипт для тестирования добавления товара в корзину
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from django.contrib.auth import get_user_model
from catalog.models import Product
from cart.models import Cart, CartItem
from rest_framework.authtoken.models import Token

User = get_user_model()

print("=" * 60)
print("ТЕСТ: Добавление товара в корзину")
print("=" * 60)

# Проверяем пользователей
users = User.objects.all()
print(f"\nПользователей в системе: {users.count()}")

if not users.exists():
    print("❌ Нет пользователей! Создайте пользователя через регистрацию.")
    exit(1)

# Берем первого пользователя
user = users.first()
print(f"Тестовый пользователь: {user.username} (ID: {user.id})")

# Проверяем токен
token, created = Token.objects.get_or_create(user=user)
print(f"Токен пользователя: {token.key}")
if created:
    print("✅ Создан новый токен")
else:
    print("✅ Используется существующий токен")

# Проверяем товары
products = Product.objects.all()
print(f"\nТоваров в системе: {products.count()}")

if not products.exists():
    print("❌ Нет товаров!")
    exit(1)

# Берем первый товар
product = products.first()
print(f"Тестовый товар: {product.name}")
print(f"  Slug: {product.slug}")
print(f"  Цена: {product.price} BYN")
print(f"  В наличии: {product.stock}")

# Получаем или создаем корзину
cart, created = Cart.objects.get_or_create(user=user)
if created:
    print("\n✅ Создана новая корзина")
else:
    print(f"\n✅ Используется существующая корзина (ID: {cart.id})")

# Добавляем товар в корзину
print(f"\nДобавляем товар '{product.name}' в корзину...")
cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

if created:
    cart_item.quantity = 1
    cart_item.save()
    print(f"✅ Товар добавлен в корзину (количество: 1)")
else:
    cart_item.quantity += 1
    cart_item.save()
    print(f"✅ Количество товара увеличено (новое количество: {cart_item.quantity})")

# Показываем содержимое корзины
print(f"\n{'=' * 60}")
print("СОДЕРЖИМОЕ КОРЗИНЫ:")
print(f"{'=' * 60}")

items = cart.items.all()
if items.exists():
    for item in items:
        print(f"  - {item.product.name}")
        print(f"    Количество: {item.quantity}")
        print(f"    Цена за единицу: {item.product.price} BYN")
        print(f"    Итого: {item.get_total_price()} BYN")
        print()
    print(f"Общая сумма корзины: {cart.get_total_price()} BYN")
else:
    print("  Корзина пуста")

print(f"\n{'=' * 60}")
print("ИНСТРУКЦИЯ ДЛЯ ТЕСТИРОВАНИЯ В БРАУЗЕРЕ:")
print(f"{'=' * 60}")
print(f"\n1. Войдите в систему с пользователем: {user.username}")
print(f"2. Токен для API: {token.key}")
print(f"3. Попробуйте добавить товар со slug: {product.slug}")
print(f"\nКоманда curl для тестирования:")
print(f"""
curl -X POST http://127.0.0.1:8000/api/cart/cart/add_item/ \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Token {token.key}" \\
  -d '{{"product_slug": "{product.slug}", "quantity": 1}}'
""")

print(f"\n{'=' * 60}")
print("ТЕСТ ЗАВЕРШЕН")
print(f"{'=' * 60}")
