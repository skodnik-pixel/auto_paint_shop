from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    address = models.TextField(blank=True, null=True, verbose_name='Адрес')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='Дата регистрации')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-created_at']

    def __str__(self):
        return self.username
