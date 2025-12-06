"""
Скрипт для добавления рейтингов к товарам
Добавляет случайные рейтинги от 3.0 до 5.0 и количество отзывов
"""

import os
import django
import random

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product

def add_ratings():
    print("=" * 60)
    print("ДОБАВЛЕНИЕ РЕЙТИНГОВ К ТОВАРАМ")
    print("=" * 60)
    
    # Получаем все товары
    products = Product.objects.all()
    
    if not products.exists():
        print("✗ В базе данных нет товаров!")
        return
    
    print(f"\nНайдено товаров: {products.count()}")
    print("\nДобавление рейтингов...\n")
    
    updated_count = 0
    
    for product in products:
        # Генерируем случайный рейтинг от 3.0 до 5.0
        rating = round(random.uniform(3.0, 5.0), 2)
        
        # Генерируем случайное количество отзывов от 5 до 150
        reviews_count = random.randint(5, 150)
        
        # Обновляем товар
        product.rating = rating
        product.reviews_count = reviews_count
        product.save()
        
        updated_count += 1
        
        print(f"✓ {product.name[:50]}")
        print(f"  Рейтинг: {rating} ⭐ ({reviews_count} отзывов)")
    
    print("\n" + "=" * 60)
    print(f"✓ Обновлено товаров: {updated_count}")
    print("=" * 60)

if __name__ == '__main__':
    try:
        add_ratings()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
