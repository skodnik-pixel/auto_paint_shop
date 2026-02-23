from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)  # "Автокосметика и автохимия"
    slug = models.SlugField(unique=True)
    meta_title = models.CharField('SEO заголовок', max_length=200, blank=True)
    meta_description = models.CharField('SEO описание', max_length=320, blank=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=100)  # "Koch Chemie"
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField('Остаток на складе')
    # Свой порог для алерта «мало на складе» (пусто = использовать общий из настроек сайта)
    low_stock_threshold = models.PositiveIntegerField(
        'Порог «мало на складе»',
        null=True,
        blank=True,
        help_text='Пусто = использовать общий порог из настроек сайта.',
    )
    # Поле для хранения URL изображения (может быть внешняя ссылка или путь к загруженному файлу)
    image = models.CharField(max_length=500, null=True, blank=True)
    is_published = models.BooleanField('Опубликован', default=True, help_text='Снятые с публикации не показываются в каталоге.')
    # Рейтинг товара от 0 до 5 звезд (можно пересчитывать по одобренным отзывам)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    # Количество отзывов
    reviews_count = models.PositiveIntegerField(default=0)
    meta_title = models.CharField('SEO заголовок', max_length=200, blank=True)
    meta_description = models.CharField('SEO описание', max_length=320, blank=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """Дополнительные изображения товара (галерея)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField('Изображение', upload_to='products/%Y/%m/', blank=True)
    caption = models.CharField('Подпись', max_length=200, blank=True)
    order = models.PositiveSmallIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Галерея товара'
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.product.name} — {self.order}'


class Review(models.Model):
    """Отзыв на товар. После одобрения в админке учитывается в рейтинге товара."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True,
        verbose_name='Пользователь',
    )
    rating = models.PositiveSmallIntegerField('Оценка (1–5)')
    text = models.TextField('Текст отзыва', blank=True)
    is_approved = models.BooleanField('Одобрен', default=False)
    created_at = models.DateTimeField('Дата', auto_now_add=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.product.name} — {self.rating}★'


class StockMovement(models.Model):
    """История приходов и списаний по складу."""
    MOVEMENT_TYPE = [
        ('receipt', 'Приход'),
        ('write_off', 'Списание'),
        ('adjustment', 'Корректировка'),
        ('order', 'Заказ'),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    quantity = models.IntegerField(
        'Количество',
        help_text='Положительное — приход, отрицательное — списание.',
    )
    movement_type = models.CharField('Тип', max_length=20, choices=MOVEMENT_TYPE, default='adjustment')
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_movements',
        verbose_name='Заказ (если списание по заказу)',
    )
    comment = models.CharField('Комментарий', max_length=255, blank=True)
    created_at = models.DateTimeField('Дата', auto_now_add=True)

    class Meta:
        verbose_name = 'Движение по складу'
        verbose_name_plural = 'Движения по складу'
        ordering = ['-created_at']

    def __str__(self):
        sign = '+' if self.quantity >= 0 else ''
        return f'{self.product.name}: {sign}{self.quantity} ({self.get_movement_type_display()})'

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and self.quantity != 0:
            self.product.stock = max(0, self.product.stock + self.quantity)
            self.product.save(update_fields=['stock'])
