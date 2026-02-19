from django.db import models
from django.conf import settings
from catalog.models import Product

class Order(models.Model):
    # Статусы заказа
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменён'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    address = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    delivery_method = models.CharField(max_length=20, default='courier')
    payment_method = models.CharField(max_length=20, default='cash')
    comment = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Заказ {self.id} от {self.user.username}"
    
    # Метод для автоматического расчета общей суммы заказа
    def calculate_total(self):
        total = sum(item.quantity * item.price for item in self.items.all())
        self.total_price = total
        self.save()
        return total

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
