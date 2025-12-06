"""
Скрипт для добавления демонстрационных товаров
Добавляет реалистичные товары автокосметики для тестирования сайта
"""

import os
import django
import random

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product, Category, Brand

def add_demo_products():
    print("=" * 70)
    print("ДОБАВЛЕНИЕ ДЕМОНСТРАЦИОННЫХ ТОВАРОВ")
    print("=" * 70)
    
    # Создаем/получаем категории
    categories_data = [
        {'name': 'Полироли', 'slug': 'poliroli'},
        {'name': 'Шампуни', 'slug': 'shampuni'},
        {'name': 'Воски', 'slug': 'voski'},
        {'name': 'Очистители', 'slug': 'ochistiteli'},
        {'name': 'Защитные покрытия', 'slug': 'zashchitnye-pokrytiya'},
        {'name': 'Средства для стекол', 'slug': 'sredstva-dlya-stekol'},
        {'name': 'Средства для салона', 'slug': 'sredstva-dlya-salona'},
        {'name': 'Средства для шин', 'slug': 'sredstva-dlya-shin'},
    ]
    
    print("\n1. Создание категорий...")
    categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name']}
        )
        categories[cat_data['slug']] = category
        status = "✓ Создана" if created else "✓ Найдена"
        print(f"   {status}: {category.name}")
    
    # Создаем/получаем бренды
    brands_data = [
        {'name': '3M', 'slug': '3m'},
        {'name': 'Koch Chemie', 'slug': 'koch-chemie'},
        {'name': 'Meguiars', 'slug': 'meguiars'},
        {'name': 'Chemical Guys', 'slug': 'chemical-guys'},
        {'name': 'Sonax', 'slug': 'sonax'},
        {'name': 'Turtle Wax', 'slug': 'turtle-wax'},
        {'name': 'Mothers', 'slug': 'mothers'},
        {'name': 'Autoglym', 'slug': 'autoglym'},
    ]
    
    print("\n2. Создание брендов...")
    brands = {}
    for brand_data in brands_data:
        brand, created = Brand.objects.get_or_create(
            slug=brand_data['slug'],
            defaults={'name': brand_data['name']}
        )
        brands[brand_data['slug']] = brand
        status = "✓ Создан" if created else "✓ Найден"
        print(f"   {status}: {brand.name}")
    
    # Демонстрационные товары
    products_data = [
        # Полироли
        {
            'name': '3M Perfect-It III Полировальная паста',
            'slug': '3m-perfect-it-iii',
            'category': 'poliroli',
            'brand': '3m',
            'description': 'Высокоэффективная полировальная паста для удаления царапин и придания блеска. Идеально подходит для финишной полировки. Не оставляет голограмм и разводов.',
            'price': 45.90,
            'stock': 15,
            'rating': 4.8,
            'reviews_count': 124,
            'image': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400'
        },
        {
            'name': 'Meguiars Ultimate Compound',
            'slug': 'meguiars-ultimate-compound',
            'category': 'poliroli',
            'brand': 'meguiars',
            'description': 'Профессиональная абразивная полироль для удаления глубоких царапин, окисления и дефектов лакокрасочного покрытия. Быстро восстанавливает блеск.',
            'price': 38.50,
            'stock': 22,
            'rating': 4.7,
            'reviews_count': 98,
            'image': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400'
        },
        {
            'name': 'Koch Chemie Heavy Cut H8.02',
            'slug': 'koch-chemie-heavy-cut',
            'category': 'poliroli',
            'brand': 'koch-chemie',
            'description': 'Абразивная полировальная паста для удаления сильных дефектов ЛКП. Высокая режущая способность при минимальном пылении.',
            'price': 52.00,
            'stock': 8,
            'rating': 4.9,
            'reviews_count': 156,
            'image': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400'
        },
        
        # Шампуни
        {
            'name': 'Chemical Guys Mr. Pink Super Suds',
            'slug': 'chemical-guys-mr-pink',
            'category': 'shampuni',
            'brand': 'chemical-guys',
            'description': 'Концентрированный автошампунь с pH-нейтральной формулой. Создает густую пену, безопасен для воска и керамики. Приятный аромат.',
            'price': 28.90,
            'stock': 35,
            'rating': 4.6,
            'reviews_count': 203,
            'image': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400'
        },
        {
            'name': 'Koch Chemie Green Star',
            'slug': 'koch-chemie-green-star',
            'category': 'shampuni',
            'brand': 'koch-chemie',
            'description': 'Универсальный очиститель для бесконтактной мойки. Эффективно удаляет дорожную грязь, масла и насекомых. Биоразлагаемый состав.',
            'price': 32.50,
            'stock': 18,
            'rating': 4.8,
            'reviews_count': 167,
            'image': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400'
        },
        {
            'name': 'Meguiars Gold Class Car Wash',
            'slug': 'meguiars-gold-class-wash',
            'category': 'shampuni',
            'brand': 'meguiars',
            'description': 'Премиальный автошампунь с кондиционерами. Бережно очищает, придает блеск и защищает ЛКП. Густая пена с приятным запахом.',
            'price': 24.90,
            'stock': 42,
            'rating': 4.5,
            'reviews_count': 189,
            'image': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400'
        },
        
        # Воски
        {
            'name': 'Turtle Wax Ice Spray Wax',
            'slug': 'turtle-wax-ice-spray',
            'category': 'voski',
            'brand': 'turtle-wax',
            'description': 'Быстрый воск-спрей для защиты и блеска. Наносится за минуты, создает водоотталкивающий слой. Подходит для всех цветов.',
            'price': 18.90,
            'stock': 28,
            'rating': 4.4,
            'reviews_count': 145,
            'image': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'
        },
        {
            'name': 'Mothers California Gold Carnauba Wax',
            'slug': 'mothers-carnauba-wax',
            'category': 'voski',
            'brand': 'mothers',
            'description': 'Натуральный карнаубский воск премиум-класса. Создает глубокий мокрый блеск и долговременную защиту до 3 месяцев.',
            'price': 42.00,
            'stock': 12,
            'rating': 4.9,
            'reviews_count': 178,
            'image': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'
        },
        
        # Очистители
        {
            'name': 'Sonax Xtreme Wheel Cleaner',
            'slug': 'sonax-wheel-cleaner',
            'category': 'ochistiteli',
            'brand': 'sonax',
            'description': 'Кислотный очиститель дисков с индикатором загрязнения. Меняет цвет при реакции с тормозной пылью. Безопасен для всех типов дисков.',
            'price': 26.50,
            'stock': 31,
            'rating': 4.7,
            'reviews_count': 134,
            'image': 'https://images.unsplash.com/photo-1449130015084-2dc954a6d51f?w=400'
        },
        {
            'name': 'Chemical Guys All Clean+ APC',
            'slug': 'chemical-guys-all-clean',
            'category': 'ochistiteli',
            'brand': 'chemical-guys',
            'description': 'Универсальный очиститель для салона и кузова. Удаляет пятна, грязь и жир. Концентрат - разбавляется до 1:20.',
            'price': 22.90,
            'stock': 25,
            'rating': 4.6,
            'reviews_count': 112,
            'image': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400'
        },
        
        # Защитные покрытия
        {
            'name': 'Koch Chemie 1K Nano',
            'slug': 'koch-chemie-1k-nano',
            'category': 'zashchitnye-pokrytiya',
            'brand': 'koch-chemie',
            'description': 'Нанокерамическое покрытие для долговременной защиты ЛКП. Создает гидрофобный эффект на 12 месяцев. Легко наносится.',
            'price': 89.00,
            'stock': 6,
            'rating': 4.9,
            'reviews_count': 87,
            'image': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'
        },
        {
            'name': 'Meguiars Hybrid Ceramic Wax',
            'slug': 'meguiars-hybrid-ceramic',
            'category': 'zashchitnye-pokrytiya',
            'brand': 'meguiars',
            'description': 'Гибридное керамическое покрытие в виде спрея. Защита до 6 месяцев, усиленный блеск и водоотталкивание. Наносится на мокрую поверхность.',
            'price': 34.90,
            'stock': 19,
            'rating': 4.7,
            'reviews_count': 201,
            'image': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400'
        },
        
        # Средства для стекол
        {
            'name': 'Autoglym Fast Glass',
            'slug': 'autoglym-fast-glass',
            'category': 'sredstva-dlya-stekol',
            'brand': 'autoglym',
            'description': 'Профессиональный очиститель стекол. Не оставляет разводов, удаляет жир и никотин. Антистатический эффект.',
            'price': 16.50,
            'stock': 38,
            'rating': 4.5,
            'reviews_count': 156,
            'image': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400'
        },
        {
            'name': '3M Glass Cleaner',
            'slug': '3m-glass-cleaner',
            'category': 'sredstva-dlya-stekol',
            'brand': '3m',
            'description': 'Очиститель стекол с антизапотевающим эффектом. Идеально для лобовых стекол. Безопасен для тонировки.',
            'price': 14.90,
            'stock': 44,
            'rating': 4.4,
            'reviews_count': 98,
            'image': 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400'
        },
        
        # Средства для салона
        {
            'name': 'Chemical Guys Leather Conditioner',
            'slug': 'chemical-guys-leather',
            'category': 'sredstva-dlya-salona',
            'brand': 'chemical-guys',
            'description': 'Кондиционер для кожи с UV-защитой. Питает, восстанавливает эластичность и предотвращает растрескивание. Приятный запах.',
            'price': 27.50,
            'stock': 21,
            'rating': 4.8,
            'reviews_count': 143,
            'image': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
        },
        {
            'name': 'Sonax Xtreme Interior Cleaner',
            'slug': 'sonax-interior-cleaner',
            'category': 'sredstva-dlya-salona',
            'brand': 'sonax',
            'description': 'Универсальный очиститель салона. Подходит для пластика, кожи, ткани. Антистатический эффект, приятный аромат.',
            'price': 19.90,
            'stock': 33,
            'rating': 4.6,
            'reviews_count': 167,
            'image': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
        },
        
        # Средства для шин
        {
            'name': 'Meguiars Endurance Tire Gel',
            'slug': 'meguiars-endurance-tire',
            'category': 'sredstva-dlya-shin',
            'brand': 'meguiars',
            'description': 'Гель для шин с долговременным эффектом. Создает глубокий черный цвет, защищает от UV и растрескивания. Не разбрызгивается.',
            'price': 21.90,
            'stock': 27,
            'rating': 4.7,
            'reviews_count': 189,
            'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
        },
        {
            'name': 'Turtle Wax Wet N Black',
            'slug': 'turtle-wax-wet-black',
            'category': 'sredstva-dlya-shin',
            'brand': 'turtle-wax',
            'description': 'Чернитель шин с мокрым эффектом. Быстро наносится, создает насыщенный черный цвет. Защита до 2 недель.',
            'price': 15.50,
            'stock': 36,
            'rating': 4.5,
            'reviews_count': 134,
            'image': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'
        },
    ]
    
    print("\n3. Добавление товаров...")
    added_count = 0
    updated_count = 0
    
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
        
        if created:
            added_count += 1
            print(f"   ✓ Добавлен: {product.name[:50]}")
        else:
            updated_count += 1
            print(f"   ✓ Обновлен: {product.name[:50]}")
        
        print(f"     Категория: {category.name} | Бренд: {brand.name}")
        print(f"     Цена: {product.price} BYN | Рейтинг: {product.rating}⭐ ({product.reviews_count})")
    
    print("\n" + "=" * 70)
    print("СТАТИСТИКА")
    print("=" * 70)
    print(f"Категорий: {Category.objects.count()}")
    print(f"Брендов: {Brand.objects.count()}")
    print(f"Товаров добавлено: {added_count}")
    print(f"Товаров обновлено: {updated_count}")
    print(f"Всего товаров в базе: {Product.objects.count()}")
    print("=" * 70)
    print("\n✓ Демонстрационные товары успешно добавлены!")
    print("  Теперь можно тестировать:")
    print("  - Поиск товаров")
    print("  - Фильтры (категория, бренд, цена, рейтинг)")
    print("  - Добавление в корзину")
    print("  - Оформление заказа")
    print("  - Личный кабинет")
    print("=" * 70)

if __name__ == '__main__':
    try:
        add_demo_products()
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()
