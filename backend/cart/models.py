from django.db import models
from django.conf import settings
from catalog.models import Product

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Корзина {self.user.username}"
    
    def get_total_price(self):
        """Возвращает общую стоимость всех товаров в корзине"""
        return sum(item.get_total_price() for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    def get_total_price(self):
        """Возвращает общую стоимость этого товара (цена * количество)"""
        return self.product.price * self.quantity
