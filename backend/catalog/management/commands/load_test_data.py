from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from catalog.models import Category, Brand, Product
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Загружает тестовые данные в базу данных'

    def handle(self, *args, **options):
        self.stdout.write('Начинаю загрузку тестовых данных...')

        # Создаем суперпользователя если его нет
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Создан суперпользователь: admin/admin123'))

        # Создаем категории
        categories_data = [
            {'name': 'Автокосметика', 'slug': 'autocosmetics'},
            {'name': 'Автохимия', 'slug': 'autochemistry'},
            {'name': 'Инструменты', 'slug': 'tools'},
            {'name': 'Аксессуары', 'slug': 'accessories'},
            {'name': 'Защитные покрытия', 'slug': 'protective-coatings'},
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name']}
            )
            if created:
                self.stdout.write(f'Создана категория: {category.name}')

        # Создаем бренды
        brands_data = [
            {'name': 'Koch Chemie', 'slug': 'koch-chemie'},
            {'name': 'Meguiar\'s', 'slug': 'meguiars'},
            {'name': 'Sonax', 'slug': 'sonax'},
            {'name': 'Autoglym', 'slug': 'autoglym'},
            {'name': 'CarPro', 'slug': 'carpro'},
            {'name': 'Gyeon', 'slug': 'gyeon'},
            {'name': 'Chemical Guys', 'slug': 'chemical-guys'},
            {'name': '3M', 'slug': '3m'},
        ]

        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults={'name': brand_data['name']}
            )
            if created:
                self.stdout.write(f'Создан бренд: {brand.name}')

        # Получаем объекты для создания товаров
        autocosmetics = Category.objects.get(slug='autocosmetics')
        autochemistry = Category.objects.get(slug='autochemistry')
        tools = Category.objects.get(slug='tools')
        accessories = Category.objects.get(slug='accessories')
        protective = Category.objects.get(slug='protective-coatings')

        koch = Brand.objects.get(slug='koch-chemie')
        meguiars = Brand.objects.get(slug='meguiars')
        sonax = Brand.objects.get(slug='sonax')
        autoglym = Brand.objects.get(slug='autoglym')
        carpro = Brand.objects.get(slug='carpro')
        gyeon = Brand.objects.get(slug='gyeon')
        chemical_guys = Brand.objects.get(slug='chemical-guys')
        three_m = Brand.objects.get(slug='3m')

        # Создаем товары
        products_data = [
            # Автокосметика
            {
                'name': 'Koch Chemie GSF - Активный пенообразователь',
                'slug': 'koch-chemie-gsf-active-foam',
                'description': 'Профессиональный активный пенообразователь для мойки автомобиля. Создает густую пену, эффективно удаляет загрязнения.',
                'price': Decimal('45.00'),
                'stock': 50,
                'category': autocosmetics,
                'brand': koch
            },
            {
                'name': 'Meguiar\'s Gold Class Car Wash',
                'slug': 'meguiars-gold-class-car-wash',
                'description': 'Щадящий шампунь для мойки автомобиля. Содержит воск для дополнительной защиты лакокрасочного покрытия.',
                'price': Decimal('35.00'),
                'stock': 30,
                'category': autocosmetics,
                'brand': meguiars
            },
            {
                'name': 'Sonax Premium Class Shampoo',
                'slug': 'sonax-premium-class-shampoo',
                'description': 'Премиальный шампунь для мойки автомобиля. Обеспечивает глубокую очистку без повреждения защитных покрытий.',
                'price': Decimal('40.00'),
                'stock': 25,
                'category': autocosmetics,
                'brand': sonax
            },
            # Автохимия
            {
                'name': 'Koch Chemie Green Star - Очиститель колес',
                'slug': 'koch-chemie-green-star-wheel-cleaner',
                'description': 'Специальный очиститель для колес и тормозной пыли. Безопасен для всех типов колесных дисков.',
                'price': Decimal('55.00'),
                'stock': 40,
                'category': autochemistry,
                'brand': koch
            },
            {
                'name': 'Autoglym Intensive Tar Remover',
                'slug': 'autoglym-intensive-tar-remover',
                'description': 'Специализированное средство для удаления битумных пятен и дорожной смолы с кузова автомобиля.',
                'price': Decimal('25.00'),
                'stock': 60,
                'category': autochemistry,
                'brand': autoglym
            },
            {
                'name': 'CarPro Iron X - Удалитель железных частиц',
                'slug': 'carpro-iron-x-iron-remover',
                'description': 'Специальное средство для удаления железных частиц с лакокрасочного покрытия. Изменяет цвет при контакте с железом.',
                'price': Decimal('70.00'),
                'stock': 20,
                'category': autochemistry,
                'brand': carpro
            },
            # Инструменты
            {
                'name': 'Chemical Guys Professional Wash Mitt',
                'slug': 'chemical-guys-professional-wash-mitt',
                'description': 'Профессиональная рукавица для мойки автомобиля. Мягкая микрофибра, безопасна для всех типов покрытий.',
                'price': Decimal('15.00'),
                'stock': 100,
                'category': tools,
                'brand': chemical_guys
            },
            {
                'name': 'Meguiar\'s Professional Detailing Brush Set',
                'slug': 'meguiars-professional-detailing-brush-set',
                'description': 'Набор профессиональных щеток для деталинга. Различные размеры для очистки труднодоступных мест.',
                'price': Decimal('30.00'),
                'stock': 50,
                'category': tools,
                'brand': meguiars
            },
            {
                'name': '3M Professional Clay Bar',
                'slug': '3m-professional-clay-bar',
                'description': 'Профессиональная глина для удаления загрязнений с лакокрасочного покрытия. Восстанавливает гладкость поверхности.',
                'price': Decimal('20.00'),
                'stock': 80,
                'category': tools,
                'brand': three_m
            },
            # Аксессуары
            {
                'name': 'Gyeon Q2M Prep - Обезжириватель',
                'slug': 'gyeon-q2m-prep-degreaser',
                'description': 'Профессиональный обезжириватель для подготовки поверхности перед нанесением защитных покрытий.',
                'price': Decimal('45.00'),
                'stock': 35,
                'category': accessories,
                'brand': gyeon
            },
            {
                'name': 'Sonax Microfiber Towel Set',
                'slug': 'sonax-microfiber-towel-set',
                'description': 'Набор микрофибровых полотенец для полировки и сушки. Высокое качество, не оставляет разводов.',
                'price': Decimal('25.00'),
                'stock': 70,
                'category': accessories,
                'brand': sonax
            },
            {
                'name': 'CarPro Cquartz - Керамическое покрытие',
                'slug': 'carpro-cquartz-ceramic-coating',
                'description': 'Профессиональное керамическое покрытие для долгосрочной защиты лакокрасочного покрытия.',
                'price': Decimal('120.00'),
                'stock': 15,
                'category': protective,
                'brand': carpro
            },
            {
                'name': 'Gyeon Q2 CanCoat - Легкое керамическое покрытие',
                'slug': 'gyeon-q2-cancoat-light-ceramic-coating',
                'description': 'Легкое керамическое покрытие для быстрой защиты. Простое в нанесении, долговечная защита.',
                'price': Decimal('85.00'),
                'stock': 25,
                'category': protective,
                'brand': gyeon
            },
            {
                'name': 'Autoglym LifeShine - Защитное покрытие',
                'slug': 'autoglym-lifeshine-protective-coating',
                'description': 'Защитное покрытие с эффектом "мокрого" блеска. Долговечная защита от загрязнений и УФ-лучей.',
                'price': Decimal('65.00'),
                'stock': 30,
                'category': protective,
                'brand': autoglym
            },
            {
                'name': 'Meguiar\'s Hybrid Ceramic Wax',
                'slug': 'meguiars-hybrid-ceramic-wax',
                'description': 'Гибридный воск с керамическими частицами. Легкое нанесение, долговечная защита и блеск.',
                'price': Decimal('50.00'),
                'stock': 45,
                'category': protective,
                'brand': meguiars
            }
        ]

        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    'name': product_data['name'],
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'stock': product_data['stock'],
                    'category': product_data['category'],
                    'brand': product_data['brand']
                }
            )
            if created:
                self.stdout.write(f'Создан товар: {product.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Тестовые данные успешно загружены!\n'
                f'Создано: {Category.objects.count()} категорий, '
                f'{Brand.objects.count()} брендов, '
                f'{Product.objects.count()} товаров'
            )
        )
