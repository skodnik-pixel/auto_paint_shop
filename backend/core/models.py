from django.db import models
from ckeditor.fields import RichTextField


def default_delivery_methods():
    return [
        {'id': 'courier', 'name': 'Курьер', 'description': ''},
        {'id': 'pickup', 'name': 'Самовывоз', 'description': ''},
    ]


def default_payment_methods():
    return [
        {'id': 'cash', 'name': 'Наличными', 'description': ''},
        {'id': 'card', 'name': 'Картой при получении', 'description': ''},
    ]


class SiteSettings(models.Model):
    """Единственная запись с настройками сайта (редактируется в админке)."""
    site_name = models.CharField('Название сайта', max_length=200, default='Автокраска')
    contact_phone = models.CharField('Телефон', max_length=50, blank=True)
    contact_email = models.EmailField('Email', blank=True)
    contact_address = models.TextField('Адрес', blank=True)
    # Валюта магазина (отображается в корзине, заказах)
    currency = models.CharField('Валюта', max_length=10, default='BYN', help_text='Например: BYN, USD, EUR')
    # Способы доставки: список {"id": "courier", "name": "Курьер", "description": "..."}
    delivery_methods = models.JSONField(
        'Способы доставки',
        default=default_delivery_methods,
        blank=True,
        help_text='Список объектов: [{"id": "courier", "name": "Курьер", "description": "по городу"}]',
    )
    # Способы оплаты: список {"id": "cash", "name": "Наличными", "description": "..."}
    payment_methods = models.JSONField(
        'Способы оплаты',
        default=default_payment_methods,
        blank=True,
        help_text='Список объектов: [{"id": "cash", "name": "Наличными", "description": ""}]',
    )
    delivery_info = models.TextField('Информация о доставке', blank=True)
    payment_info = models.TextField('Информация об оплате', blank=True)
    # Порог остатка для алерта «мало на складе» (если у товара не задан свой)
    low_stock_threshold = models.PositiveIntegerField(
        'Порог «мало на складе»',
        default=5,
        help_text='Товары с остатком ниже этого значения подсвечиваются в админке. Для товара можно задать свой порог.',
    )
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Настройки сайта'
        verbose_name_plural = 'Настройки сайта'

    def __str__(self):
        return self.site_name


class Page(models.Model):
    """Страницы контента (О нас, Доставка, Контакты и т.д.) — редактируются в админке."""
    SLUG_CHOICES = [
        ('about', 'О нас'),
        ('delivery', 'Доставка'),
        ('contacts', 'Контакты'),
        ('faq', 'Вопросы и ответы'),
        ('warranty', 'Гарантия'),
        ('how_to_order', 'Как заказать'),
        ('wholesale', 'Оптовикам'),
        ('pickup', 'Самовывоз'),
        ('support', 'Техподдержка'),
        ('other', 'Другое'),
    ]
    title = models.CharField('Заголовок', max_length=200)
    slug = models.SlugField('Код страницы', unique=True, choices=SLUG_CHOICES, max_length=50)
    content = RichTextField('Содержимое')
    is_active = models.BooleanField('Показывать на сайте', default=True)
    meta_title = models.CharField('SEO заголовок', max_length=200, blank=True)
    meta_description = models.CharField('SEO описание', max_length=320, blank=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Страница'
        verbose_name_plural = 'Страницы'

    def __str__(self):
        return self.title


class MediaItem(models.Model):
    """Медиафайлы для переиспользования (картинки в контенте, галереи)."""
    name = models.CharField('Название', max_length=200)
    image = models.ImageField('Файл', upload_to='media/%Y/%m/')
    alt = models.CharField('Alt-текст (SEO)', max_length=200, blank=True)
    uploaded_at = models.DateTimeField('Загружен', auto_now_add=True)

    class Meta:
        verbose_name = 'Медиафайл'
        verbose_name_plural = 'Медиа'

    def __str__(self):
        return self.name


class EmailTemplate(models.Model):
    """Шаблоны писем (подтверждение заказа, сброс пароля и т.д.). В теле можно использовать {{ переменные }}."""
    SLUG_CHOICES = [
        ('order_confirmation', 'Подтверждение заказа'),
        ('order_status', 'Изменение статуса заказа'),
        ('password_reset', 'Сброс пароля'),
        ('welcome', 'Приветственное письмо'),
        ('other', 'Другое'),
    ]
    name = models.CharField('Название', max_length=100)
    slug = models.SlugField('Код', max_length=50, unique=True, choices=SLUG_CHOICES)
    subject = models.CharField('Тема письма', max_length=200)
    body = models.TextField('Текст письма (HTML или текст)', help_text='Переменные: {{ order_id }}, {{ user_name }}, {{ site_name }} и т.д.')
    is_active = models.BooleanField('Использовать этот шаблон', default=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Шаблон письма'
        verbose_name_plural = 'Шаблоны писем'

    def __str__(self):
        return self.name


# --- Акции и скидки ---

class PromoCode(models.Model):
    """Промокод: скидка по коду, ограничения по сумме, датам и количеству использований."""
    DISCOUNT_TYPE = [
        ('percent', 'Процент'),
        ('fixed', 'Фиксированная сумма'),
    ]
    code = models.CharField('Код', max_length=50, unique=True)
    discount_type = models.CharField('Тип скидки', max_length=10, choices=DISCOUNT_TYPE, default='percent')
    value = models.DecimalField('Значение', max_digits=10, decimal_places=2, help_text='Процент (0-100) или сумма в валюте')
    min_order_amount = models.DecimalField(
        'Минимальная сумма заказа',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Пусто = без ограничения',
    )
    valid_from = models.DateTimeField('Действителен с', null=True, blank=True)
    valid_until = models.DateTimeField('Действителен до', null=True, blank=True)
    max_uses = models.PositiveIntegerField(
        'Макс. использований',
        null=True,
        blank=True,
        help_text='Пусто = неограниченно',
    )
    used_count = models.PositiveIntegerField('Использовано раз', default=0)
    is_active = models.BooleanField('Активен', default=True)
    # Ограничение по товарам: пусто = на весь заказ; иначе только на выбранные категории/товары
    categories = models.ManyToManyField(
        'catalog.Category',
        blank=True,
        verbose_name='Категории',
        help_text='Пусто = на все товары. Иначе скидка только на товары из этих категорий.',
    )
    products = models.ManyToManyField(
        'catalog.Product',
        blank=True,
        verbose_name='Товары',
        help_text='Пусто = по категориям или весь заказ. Иначе скидка только на эти товары.',
    )
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    class Meta:
        verbose_name = 'Промокод'
        verbose_name_plural = 'Промокоды'

    def __str__(self):
        return self.code


class Campaign(models.Model):
    """Кампания: скидка по периодам (даты), на категории или конкретные товары."""
    DISCOUNT_TYPE = [
        ('percent', 'Процент'),
        ('fixed', 'Фиксированная сумма'),
    ]
    name = models.CharField('Название', max_length=200)
    start_date = models.DateTimeField('Начало')
    end_date = models.DateTimeField('Окончание')
    discount_type = models.CharField('Тип скидки', max_length=10, choices=DISCOUNT_TYPE, default='percent')
    value = models.DecimalField('Значение', max_digits=10, decimal_places=2, help_text='Процент (0-100) или сумма')
    is_active = models.BooleanField('Активна', default=True)
    categories = models.ManyToManyField(
        'catalog.Category',
        blank=True,
        verbose_name='Категории',
        help_text='Пусто и товары пусто = на весь каталог. Иначе только выбранные категории/товары.',
    )
    products = models.ManyToManyField(
        'catalog.Product',
        blank=True,
        verbose_name='Товары',
    )
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    class Meta:
        verbose_name = 'Кампания (акция по датам)'
        verbose_name_plural = 'Кампании'

    def __str__(self):
        return self.name


class ContactRequest(models.Model):
    """Обращения с формы «Связаться с нами» / «Поддержка»."""
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('in_progress', 'В работе'),
        ('closed', 'Закрыт'),
    ]
    name = models.CharField('Имя', max_length=200)
    email = models.EmailField('Email')
    phone = models.CharField('Телефон', max_length=50, blank=True)
    subject = models.CharField('Тема', max_length=200)
    message = models.TextField('Сообщение')
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    admin_response = models.TextField('Ответ администратора', blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Обращение'
        verbose_name_plural = 'Обращения'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.subject} — {self.email}'
