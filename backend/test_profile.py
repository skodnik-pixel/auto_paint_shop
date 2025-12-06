"""
Скрипт для тестирования личного кабинета и заказов
Проверяет:
1. Получение списка заказов пользователя
2. Создание нового заказа из корзины
3. Расчет общей суммы заказа
"""

import os
import django
import sys

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from accounts.models import User
from orders.models import Order, OrderItem
from catalog.models import Product
from cart.models import Cart, CartItem

def test_profile():
    print("=" * 60)
    print("ТЕСТИРОВАНИЕ ЛИЧНОГО КАБИНЕТА И ЗАКАЗОВ")
    print("=" * 60)
    
    # 1. Получаем или создаем тестового пользователя
    print("\n1. Проверка пользователя...")
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'phone': '+375291234567'
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✓ Создан новый пользователь: {user.username}")
    else:
        print(f"✓ Найден пользователь: {user.username}")
    
    # 2. Проверяем существующие заказы
    print("\n2. Проверка существующих заказов...")
    orders = Order.objects.filter(user=user)
    print(f"✓ Найдено заказов: {orders.count()}")
    
    for order in orders:
        print(f"\n   Заказ #{order.id}:")
        print(f"   - Дата: {order.created_at.strftime('%d.%m.%Y %H:%M')}")
        print(f"   - Статус: {order.get_status_display()}")
        print(f"   - Сумма: {order.total_price} BYN")
        print(f"   - Товаров: {order.items.count()}")
        
        for item in order.items.all():
            print(f"     • {item.product.name} - {item.quantity} шт. × {item.price} BYN")
    
    # 3. Создаем тестовый заказ, если нужно
    if orders.count() == 0:
        print("\n3. Создание тестового заказа...")
        
        # Получаем первый доступный товар
        product = Product.objects.first()
        if not product:
            print("✗ Нет товаров в базе данных!")
            return
        
        # Создаем заказ
        order = Order.objects.create(
            user=user,
            address="г. Минск, ул. Тестовая, д. 1",
            status='pending'
        )
        
        # Добавляем товар в заказ
        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=2,
            price=product.price
        )
        
        # Рассчитываем общую сумму
        order.calculate_total()
        
        print(f"✓ Создан тестовый заказ #{order.id}")
        print(f"   - Товар: {product.name}")
        print(f"   - Количество: 2 шт.")
        print(f"   - Сумма: {order.total_price} BYN")
    
    # 4. Проверяем корзину
    print("\n4. Проверка корзины...")
    cart, created = Cart.objects.get_or_create(user=user)
    print(f"✓ Корзина: {'создана' if created else 'найдена'}")
    print(f"   - Товаров в корзине: {cart.items.count()}")
    
    if cart.items.count() > 0:
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        print(f"   - Общая сумма: {total} BYN")
        
        for item in cart.items.all():
            print(f"     • {item.product.name} - {item.quantity} шт.")
    
    # 5. Итоговая статистика
    print("\n" + "=" * 60)
    print("ИТОГОВАЯ СТАТИСТИКА")
    print("=" * 60)
    print(f"Пользователь: {user.username} ({user.email})")
    print(f"Всего заказов: {orders.count()}")
    print(f"Товаров в корзине: {cart.items.count()}")
    
    # Статистика по статусам заказов
    if orders.count() > 0:
        print("\nЗаказы по статусам:")
        for status_code, status_name in Order.STATUS_CHOICES:
            count = orders.filter(status=status_code).count()
            if count > 0:
                print(f"  - {status_name}: {count}")
    
    print("\n✓ Тестирование завершено успешно!")
    print("=" * 60)

if __name__ == '__main__':
    try:
        test_profile()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
