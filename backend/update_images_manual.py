"""
Скрипт для ручного обновления изображений товаров
Просто замените URL в словаре ниже на свои ссылки
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product

# ========================================
# ЗДЕСЬ ДОБАВЬТЕ СВОИ ССЫЛКИ НА ИЗОБРАЖЕНИЯ
# ========================================

# Формат: 'slug-товара': 'URL-изображения'
IMAGES = {
    # КРАСКИ
    'novol-baza-metallik-1l': 'https://example.com/novol-paint.jpg',
    'spectral-akril-2k-1l': 'https://example.com/spectral-paint.jpg',
    'duxone-baza-perlamutr-1l': 'https://example.com/duxone-paint.jpg',
    
    # ЛАКИ
    'novol-lak-2k-ms-1l': 'https://example.com/novol-lak.jpg',
    'lechler-lak-hs-2k-1l': 'https://example.com/lechler-lak.jpg',
    'body-lak-2k-1l': 'https://example.com/body-lak.jpg',
    
    # ГРУНТЫ
    'novol-grunt-2k-seryj': 'https://example.com/novol-grunt.jpg',
    'spectral-grunt-epoksidnyj': 'https://example.com/spectral-grunt.jpg',
    'body-grunt-1k-aerozol': 'https://example.com/body-grunt.jpg',
    
    # ШПАКЛЕВКИ
    'novol-shpaklevka-universal': 'https://example.com/novol-shpaklevka.jpg',
    'spectral-shpaklevka-steklo': 'https://example.com/spectral-shpaklevka.jpg',
    'body-shpaklevka-finish': 'https://example.com/body-shpaklevka.jpg',
    
    # РАСТВОРИТЕЛИ
    'novol-rastvoritel-akril': 'https://example.com/novol-rastvoritel.jpg',
    'spectral-razbavitel-5l': 'https://example.com/spectral-razbavitel.jpg',
    
    # ПОЛИРОЛИ
    '3m-perfect-it-pasta': 'https://example.com/3m-polish.jpg',
    'jeta-pro-polir-abraziv': 'https://example.com/jeta-polish.jpg',
    
    # ПНЕВМОИНСТРУМЕНТ
    'sata-kraskopult-hvlp': 'https://example.com/sata-gun.jpg',
    'devilbiss-kraskopult-lvlp': 'https://example.com/devilbiss-gun.jpg',
    'jeta-pro-pnevmoshlif-150': 'https://example.com/jeta-sander.jpg',
    
    # ЭЛЕКТРОИНСТРУМЕНТ
    'mirka-deos-150': 'https://example.com/mirka-sander.jpg',
    '3m-polir-mashina-elektro': 'https://example.com/3m-polisher.jpg',
    
    # АБРАЗИВЫ
    'mirka-abranet-p320': 'https://example.com/mirka-discs.jpg',
    '3m-bumaga-p800': 'https://example.com/3m-paper.jpg',
    
    # МАЛЯРНЫЕ МАТЕРИАЛЫ
    'novol-plenka-4x150': 'https://example.com/novol-film.jpg',
    '3m-lenta-50mm': 'https://example.com/3m-tape.jpg',
    'body-salfetki-100': 'https://example.com/body-wipes.jpg',
}

def update_images():
    print("=" * 70)
    print("ОБНОВЛЕНИЕ ИЗОБРАЖЕНИЙ ТОВАРОВ")
    print("=" * 70)
    
    updated = 0
    not_found = 0
    
    for slug, image_url in IMAGES.items():
        try:
            product = Product.objects.get(slug=slug)
            product.image = image_url
            product.save()
            print(f"✓ {product.name[:50]}")
            print(f"  URL: {image_url}\n")
            updated += 1
        except Product.DoesNotExist:
            print(f"✗ Товар не найден: {slug}\n")
            not_found += 1
    
    print("=" * 70)
    print(f"✓ Обновлено: {updated}")
    print(f"✗ Не найдено: {not_found}")
    print("=" * 70)

if __name__ == '__main__':
    update_images()
