from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)  # "Автокосметика и автохимия"
    slug = models.SlugField(unique=True)

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
    stock = models.PositiveIntegerField()
    # Поле для хранения URL изображения (может быть внешняя ссылка или путь к загруженному файлу)
    image = models.CharField(max_length=500, null=True, blank=True)
    # Рейтинг товара от 0 до 5 звезд
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    # Количество отзывов
    reviews_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
