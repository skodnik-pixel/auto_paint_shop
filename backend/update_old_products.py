"""
Скрипт для обновления старых товаров
Добавляет изображения к товарам, у которых их нет
"""

import os
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product

def update_old_products():
    print("=" * 60)
    print("ОБНОВЛЕНИЕ СТАРЫХ ТОВАРОВ")
    print("=" * 60)
    
    # Получаем товары без изображений или с placeholder
    products = Product.objects.filter(image='')
    
    if not products.exists():
        print("\n✓ Все товары уже имеют изображения!")
        return
    
    print(f"\nНайдено товаров без изображений: {products.count()}")
    print("\nДобавление изображений...\n")
    
    # Список изображений автокосметики из Unsplash
    images = [
        'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
        'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400',
        'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400',
        'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400',
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400',
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
        'https://images.unsplash.com/photo-1449130015084-2dc954a6d51f?w=400',
        'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400',
    ]
    
    updated_count = 0
    
    for i, product in enumerate(products):
        # Выбираем изображение по кругу
        image_url = images[i % len(images)]
        
        product.image = image_url
        product.save()
        
        updated_count += 1
        print(f"✓ {product.name[:50]}")
        print(f"  Изображение: {image_url}")
    
    print("\n" + "=" * 60)
    print(f"✓ Обновлено товаров: {updated_count}")
    print("=" * 60)

if __name__ == '__main__':
    try:
        update_old_products()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
