"""
Скрипт для добавления товаров для кузовного ремонта
Краски, лаки, грунты, шпаклевки, инструменты и т.д.
"""

import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product, Category, Brand

def clear_old_data():
    """Очистка старых демо-данных"""
    print("\n1. Очистка старых данных...")
    Product.objects.all().delete()
    Category.objects.all().delete()
    Brand.objects.all().delete()
    print("   ✓ База данных очищена")

def add_body_repair_products():
    print("=" * 70)
    print("ДОБАВЛЕНИЕ ТОВАРОВ ДЛЯ КУЗОВНОГО РЕМОНТА")
    print("=" * 70)
    
    clear_old_data()
    
    # Категории для кузовного ремонта
    categories_data = [
        {'name': 'Краски автомобильные', 'slug': 'kraski'},
        {'name': 'Лаки автомобильные', 'slug': 'laki'},
        {'name': 'Грунты', 'slug': 'grunty'},
        {'name': 'Шпаклевки', 'slug': 'shpaklevki'},
        {'name': 'Растворители и разбавители', 'slug': 'rastvoriteli'},
        {'name': 'Полироли и пасты', 'slug': 'poliroli'},
        {'name': 'Пневмоинструмент', 'slug': 'pnevmoinstrument'},
        {'name': 'Электроинструмент', 'slug': 'elektroinstrument'},
        {'name': 'Абразивные материалы', 'slug': 'abraziv'},
        {'name': 'Малярные материалы', 'slug': 'malyarnye'},
    ]

    
    print("\n2. Создание категорий...")
    categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name']}
        )
        categories[cat_data['slug']] = category
        print(f"   ✓ {category.name}")
    
    # Бренды для кузовного ремонта
    brands_data = [
        {'name': 'NOVOL', 'slug': 'novol'},
        {'name': 'BODY', 'slug': 'body'},
        {'name': 'SPECTRAL', 'slug': 'spectral'},
        {'name': 'JETA PRO', 'slug': 'jeta-pro'},
        {'name': 'DUXONE', 'slug': 'duxone'},
        {'name': 'LECHLER', 'slug': 'lechler'},
        {'name': 'SATA', 'slug': 'sata'},
        {'name': 'DeVilbiss', 'slug': 'devilbiss'},
        {'name': '3M', 'slug': '3m'},
        {'name': 'Mirka', 'slug': 'mirka'},
    ]
    
    print("\n3. Создание брендов...")
    brands = {}
    for brand_data in brands_data:
        brand, created = Brand.objects.get_or_create(
            slug=brand_data['slug'],
            defaults={'name': brand_data['name']}
        )
        brands[brand_data['slug']] = brand
        print(f"   ✓ {brand.name}")

    
    # Товары для кузовного ремонта
    products_data = [
        # КРАСКИ
        {
            'name': 'NOVOL Базовая краска металлик 1л',
            'slug': 'novol-baza-metallik-1l',
            'category': 'kraski',
            'brand': 'novol',
            'description': 'Базовая автомобильная краска металлик. Отличная укрывистость, легко наносится. Требует покрытия лаком. Подходит для всех типов ремонта.',
            'price': 45.90,
            'stock': 25,
            'rating': 4.7,
            'reviews_count': 89,
            'image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'
        },
        {
            'name': 'SPECTRAL Акриловая эмаль 2К 1л',
            'slug': 'spectral-akril-2k-1l',
            'category': 'kraski',
            'brand': 'spectral',
            'description': 'Двухкомпонентная акриловая эмаль. Высокий глянец, отличная адгезия. Быстрое высыхание. Не требует лакирования.',
            'price': 52.00,
            'stock': 18,
            'rating': 4.8,
            'reviews_count': 124,
            'image': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'
        },
        {
            'name': 'DUXONE Базовая краска перламутр 1л',
            'slug': 'duxone-baza-perlamutr-1l',
            'category': 'kraski',
            'brand': 'duxone',
            'description': 'Профессиональная базовая краска с эффектом перламутр. Превосходная укрывистость и цветопередача. Для профессионального применения.',
            'price': 68.50,
            'stock': 12,
            'rating': 4.9,
            'reviews_count': 156,
            'image': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400'
        },

        
        # ЛАКИ
        {
            'name': 'NOVOL Лак акриловый 2К MS 1л',
            'slug': 'novol-lak-2k-ms-1l',
            'category': 'laki',
            'brand': 'novol',
            'description': 'Двухкомпонентный акриловый лак средней вязкости. Отличный блеск, высокая твердость. Быстрое высыхание 4-6 часов при 20°C.',
            'price': 38.90,
            'stock': 32,
            'rating': 4.6,
            'reviews_count': 178,
            'image': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'
        },
        {
            'name': 'LECHLER Лак HS 2К 1л',
            'slug': 'lechler-lak-hs-2k-1l',
            'category': 'laki',
            'brand': 'lechler',
            'description': 'Профессиональный высокосухой лак. Превосходный блеск и твердость. Устойчив к царапинам и химическим воздействиям.',
            'price': 75.00,
            'stock': 15,
            'rating': 4.9,
            'reviews_count': 203,
            'image': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400'
        },
        {
            'name': 'BODY Лак акриловый 2К 1л',
            'slug': 'body-lak-2k-1l',
            'category': 'laki',
            'brand': 'body',
            'description': 'Универсальный двухкомпонентный лак. Хорошая растекаемость, высокий глянец. Оптимальное соотношение цена-качество.',
            'price': 42.50,
            'stock': 28,
            'rating': 4.5,
            'reviews_count': 145,
            'image': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
        },

        
        # ГРУНТЫ
        {
            'name': 'NOVOL Грунт акриловый 2К 1л серый',
            'slug': 'novol-grunt-2k-seryj',
            'category': 'grunty',
            'brand': 'novol',
            'description': 'Двухкомпонентный акриловый грунт-наполнитель. Отличная адгезия к металлу и старым покрытиям. Легко шлифуется.',
            'price': 28.90,
            'stock': 35,
            'rating': 4.7,
            'reviews_count': 167,
            'image': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
        },
        {
            'name': 'SPECTRAL Грунт эпоксидный 2К 1л',
            'slug': 'spectral-grunt-epoksidnyj',
            'category': 'grunty',
            'brand': 'spectral',
            'description': 'Эпоксидный антикоррозийный грунт. Превосходная защита от коррозии. Наносится на голый металл.',
            'price': 48.00,
            'stock': 22,
            'rating': 4.8,
            'reviews_count': 134,
            'image': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'
        },
        {
            'name': 'BODY Грунт 1К аэрозоль 400мл',
            'slug': 'body-grunt-1k-aerozol',
            'category': 'grunty',
            'brand': 'body',
            'description': 'Однокомпонентный грунт в аэрозольной упаковке. Удобен для мелкого ремонта. Быстрое высыхание.',
            'price': 12.50,
            'stock': 48,
            'rating': 4.4,
            'reviews_count': 98,
            'image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'
        },

        
        # ШПАКЛЕВКИ
        {
            'name': 'NOVOL Шпаклевка универсальная 1кг',
            'slug': 'novol-shpaklevka-universal',
            'category': 'shpaklevki',
            'brand': 'novol',
            'description': 'Универсальная полиэфирная шпаклевка. Легко наносится и шлифуется. Подходит для всех видов ремонта.',
            'price': 18.90,
            'stock': 42,
            'rating': 4.6,
            'reviews_count': 189,
            'image': 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8d6?w=400'
        },
        {
            'name': 'SPECTRAL Шпаклевка со стекловолокном 1кг',
            'slug': 'spectral-shpaklevka-steklo',
            'category': 'shpaklevki',
            'brand': 'spectral',
            'description': 'Армированная шпаклевка со стекловолокном. Для ремонта сквозных повреждений. Высокая прочность.',
            'price': 24.50,
            'stock': 28,
            'rating': 4.7,
            'reviews_count': 156,
            'image': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
        },
        {
            'name': 'BODY Шпаклевка финишная 1кг',
            'slug': 'body-shpaklevka-finish',
            'category': 'shpaklevki',
            'brand': 'body',
            'description': 'Мелкозернистая финишная шпаклевка. Идеально гладкая поверхность. Минимальная усадка.',
            'price': 22.00,
            'stock': 35,
            'rating': 4.8,
            'reviews_count': 201,
            'image': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'
        },

        
        # РАСТВОРИТЕЛИ
        {
            'name': 'NOVOL Растворитель акриловый 1л',
            'slug': 'novol-rastvoritel-akril',
            'category': 'rastvoriteli',
            'brand': 'novol',
            'description': 'Универсальный растворитель для акриловых материалов. Для разбавления красок, лаков, грунтов.',
            'price': 8.90,
            'stock': 55,
            'rating': 4.5,
            'reviews_count': 143,
            'image': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
        },
        {
            'name': 'SPECTRAL Разбавитель стандартный 5л',
            'slug': 'spectral-razbavitel-5l',
            'category': 'rastvoriteli',
            'brand': 'spectral',
            'description': 'Стандартный разбавитель для базовых красок. Экономичная упаковка 5л. Оптимальная скорость испарения.',
            'price': 32.00,
            'stock': 18,
            'rating': 4.6,
            'reviews_count': 112,
            'image': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400'
        },

        
        # ПОЛИРОЛИ
        {
            'name': '3M Perfect-It III Полировальная паста',
            'slug': '3m-perfect-it-pasta',
            'category': 'poliroli',
            'brand': '3m',
            'description': 'Профессиональная полировальная паста. Удаляет риски P1500-P2000. Не оставляет голограмм.',
            'price': 45.00,
            'stock': 24,
            'rating': 4.9,
            'reviews_count': 234,
            'image': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400'
        },
        {
            'name': 'JETA PRO Полироль абразивная 1л',
            'slug': 'jeta-pro-polir-abraziv',
            'category': 'poliroli',
            'brand': 'jeta-pro',
            'description': 'Абразивная полироль для удаления царапин. Подходит для машинной и ручной полировки.',
            'price': 28.50,
            'stock': 31,
            'rating': 4.6,
            'reviews_count': 167,
            'image': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400'
        },

        
        # ПНЕВМОИНСТРУМЕНТ
        {
            'name': 'SATA Краскопульт HVLP 1.3мм',
            'slug': 'sata-kraskopult-hvlp',
            'category': 'pnevmoinstrument',
            'brand': 'sata',
            'description': 'Профессиональный краскопульт HVLP. Дюза 1.3мм для базовых красок. Отличное распыление, низкий расход воздуха.',
            'price': 285.00,
            'stock': 8,
            'rating': 4.9,
            'reviews_count': 89,
            'image': 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8d6?w=400'
        },
        {
            'name': 'DeVilbiss Краскопульт LVLP 1.4мм',
            'slug': 'devilbiss-kraskopult-lvlp',
            'category': 'pnevmoinstrument',
            'brand': 'devilbiss',
            'description': 'Краскопульт LVLP для лаков и грунтов. Дюза 1.4мм. Экономичный расход материала.',
            'price': 245.00,
            'stock': 12,
            'rating': 4.8,
            'reviews_count': 124,
            'image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'
        },
        {
            'name': 'JETA PRO Пневмошлифмашина орбитальная 150мм',
            'slug': 'jeta-pro-pnevmoshlif-150',
            'category': 'pnevmoinstrument',
            'brand': 'jeta-pro',
            'description': 'Орбитальная пневмошлифмашина. Диаметр 150мм, ход 5мм. Для финишной шлифовки перед покраской.',
            'price': 125.00,
            'stock': 15,
            'rating': 4.7,
            'reviews_count': 156,
            'image': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'
        },

        
        # ЭЛЕКТРОИНСТРУМЕНТ
        {
            'name': 'Mirka Эксцентриковая шлифмашина DEOS 150мм',
            'slug': 'mirka-deos-150',
            'category': 'elektroinstrument',
            'brand': 'mirka',
            'description': 'Профессиональная электрошлифмашина с пылеотводом. Бесщеточный мотор, низкая вибрация.',
            'price': 485.00,
            'stock': 6,
            'rating': 4.9,
            'reviews_count': 78,
            'image': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
        },
        {
            'name': '3M Полировальная машина электрическая',
            'slug': '3m-polir-mashina-elektro',
            'category': 'elektroinstrument',
            'brand': '3m',
            'description': 'Роторная полировальная машина. Регулировка оборотов 600-3000 об/мин. Для профессиональной полировки.',
            'price': 320.00,
            'stock': 10,
            'rating': 4.8,
            'reviews_count': 145,
            'image': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'
        },

        
        # АБРАЗИВНЫЕ МАТЕРИАЛЫ
        {
            'name': 'Mirka Шлифовальные круги Abranet P320 150мм',
            'slug': 'mirka-abranet-p320',
            'category': 'abraziv',
            'brand': 'mirka',
            'description': 'Сетчатые шлифовальные круги. Отличный пылеотвод, долгий срок службы. Упаковка 50шт.',
            'price': 42.00,
            'stock': 28,
            'rating': 4.8,
            'reviews_count': 167,
            'image': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400'
        },
        {
            'name': '3M Шлифовальная бумага P800 на липучке',
            'slug': '3m-bumaga-p800',
            'category': 'abraziv',
            'brand': '3m',
            'description': 'Шлифовальная бумага на липучке. Зерно P800 для финишной шлифовки. Упаковка 100шт.',
            'price': 28.50,
            'stock': 35,
            'rating': 4.6,
            'reviews_count': 134,
            'image': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
        },

        
        # МАЛЯРНЫЕ МАТЕРИАЛЫ
        {
            'name': 'NOVOL Маскировочная пленка 4м x 150м',
            'slug': 'novol-plenka-4x150',
            'category': 'malyarnye',
            'brand': 'novol',
            'description': 'Защитная маскировочная пленка. Размер 4м x 150м. Антистатическая, не оставляет следов клея.',
            'price': 18.90,
            'stock': 22,
            'rating': 4.5,
            'reviews_count': 98,
            'image': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400'
        },
        {
            'name': '3M Малярная лента 50мм x 50м',
            'slug': '3m-lenta-50mm',
            'category': 'malyarnye',
            'brand': '3m',
            'description': 'Профессиональная малярная лента. Термостойкая до 80°C. Не оставляет следов.',
            'price': 8.50,
            'stock': 65,
            'rating': 4.7,
            'reviews_count': 189,
            'image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'
        },
        {
            'name': 'BODY Салфетки обезжиривающие 100шт',
            'slug': 'body-salfetki-100',
            'category': 'malyarnye',
            'brand': 'body',
            'description': 'Безворсовые салфетки для обезжиривания. Не оставляют ворса. Упаковка 100шт.',
            'price': 12.00,
            'stock': 45,
            'rating': 4.6,
            'reviews_count': 156,
            'image': 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8d6?w=400'
        },
    ]

    
    print("\n4. Добавление товаров...")
    added_count = 0
    
    for product_data in products_data:
        category = categories[product_data['category']]
        brand = brands[product_data['brand']]
        
        product, created = Product.objects.update_or_create(
            slug=product_data['slug'],
            defaults={
                'name': product_data['name'],
                'category': category,
                'brand': brand,
                'description': product_data['description'],
                'price': product_data['price'],
                'stock': product_data['stock'],
                'rating': product_data['rating'],
                'reviews_count': product_data['reviews_count'],
                'image': product_data.get('image', '')
            }
        )
        
        added_count += 1
        print(f"   ✓ {product.name[:55]}")
        print(f"     {category.name} | {brand.name} | {product.price} BYN")
    
    print("\n" + "=" * 70)
    print("ИТОГОВАЯ СТАТИСТИКА")
    print("=" * 70)
    print(f"Категорий: {Category.objects.count()}")
    print(f"Брендов: {Brand.objects.count()}")
    print(f"Товаров: {Product.objects.count()}")
    print("=" * 70)
    print("\n✓ Товары для кузовного ремонта успешно добавлены!")
    print("\nТеперь в каталоге:")
    for cat in Category.objects.all():
        count = Product.objects.filter(category=cat).count()
        print(f"  • {cat.name}: {count} товаров")
    print("=" * 70)

if __name__ == '__main__':
    try:
        add_body_repair_products()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
