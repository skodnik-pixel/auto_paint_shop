"""
Скрипт для исправления изображений товаров
Использует placeholder.com для создания красивых заглушек
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product

def fix_images():
    print("=" * 70)
    print("ИСПРАВЛЕНИЕ ИЗОБРАЖЕНИЙ ТОВАРОВ")
    print("=" * 70)
    
    products = Product.objects.all()
    
    # Цвета для разных категорий товаров
    category_colors = {
        'Краски автомобильные': 'E31E24',  # Красный
        'Лаки автомобильные': '2196F3',    # Синий
        'Грунты': '9E9E9E',                # Серый
        'Шпаклевки': 'FFC107',             # Желтый
        'Растворители и разбавители': '00BCD4',  # Голубой
        'Полироли и пасты': '4CAF50',      # Зеленый
        'Пневмоинструмент': 'FF5722',      # Оранжевый
        'Электроинструмент': '9C27B0',     # Фиолетовый
        'Абразивные материалы': '795548',  # Коричневый
        'Малярные материалы': '607D8B',    # Серо-синий
    }
    
    print("\nОбновление изображений...\n")
    
    for product in products:
        # Получаем цвет для категории
        color = category_colors.get(product.category.name, 'E31E24')
        
        # Создаем красивый placeholder с названием товара
        # Формат: https://via.placeholder.com/400x300/цвет/ffffff?text=Название
        text = product.brand.name.replace(' ', '+')
        image_url = f'https://via.placeholder.com/400x300/{color}/ffffff?text={text}'
        
        product.image = image_url
        product.save()
        
        print(f"✓ {product.name[:50]}")
        print(f"  Категория: {product.category.name}")
        print(f"  Изображение: {image_url}\n")
    
    print("=" * 70)
    print(f"✓ Обновлено товаров: {products.count()}")
    print("\nТеперь у каждого товара есть placeholder с:")
    print("  - Названием бренда")
    print("  - Цветом категории")
    print("  - Размером 400x300px")
    print("\nВы можете заменить их на реальные фото позже!")
    print("=" * 70)

if __name__ == '__main__':
    try:
        fix_images()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
