"""
Скрипт для тестирования API
Проверяет все эндпоинты и выводит результаты
"""

import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def test_api():
    print("=" * 70)
    print("ТЕСТИРОВАНИЕ API")
    print("=" * 70)
    
    # 1. Тест категорий
    print("\n1. Тест категорий...")
    response = requests.get(f'{BASE_URL}/catalog/categories/?page_size=100')
    if response.status_code == 200:
        data = response.json()
        categories = data.get('results', data)
        print(f"   ✓ Загружено категорий: {len(categories)}")
        for cat in categories:
            print(f"     - {cat['name']} ({cat['slug']})")
    else:
        print(f"   ✗ Ошибка: {response.status_code}")
    
    # 2. Тест брендов
    print("\n2. Тест брендов...")
    response = requests.get(f'{BASE_URL}/catalog/brands/?page_size=100')
    if response.status_code == 200:
        data = response.json()
        brands = data.get('results', data)
        print(f"   ✓ Загружено брендов: {len(brands)}")
        for brand in brands:
            print(f"     - {brand['name']} ({brand['slug']})")
    else:
        print(f"   ✗ Ошибка: {response.status_code}")
    
    # 3. Тест товаров
    print("\n3. Тест товаров...")
    response = requests.get(f'{BASE_URL}/catalog/products/?page_size=100')
    if response.status_code == 200:
        data = response.json()
        products = data.get('results', data)
        print(f"   ✓ Загружено товаров: {len(products)}")
        
        # Группируем по категориям
        by_category = {}
        for product in products:
            cat_name = product['category']['name']
            if cat_name not in by_category:
                by_category[cat_name] = []
            by_category[cat_name].append(product['name'])
        
        print("\n   Товары по категориям:")
        for cat_name, prods in by_category.items():
            print(f"     {cat_name}: {len(prods)} товаров")
            for prod in prods[:2]:  # Показываем первые 2
                print(f"       - {prod}")
    else:
        print(f"   ✗ Ошибка: {response.status_code}")
    
    print("\n" + "=" * 70)
    print("ТЕСТИРОВАНИЕ ЗАВЕРШЕНО")
    print("=" * 70)

if __name__ == '__main__':
    try:
        test_api()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
