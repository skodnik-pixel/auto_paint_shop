from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone', 'is_admin', 'is_staff', 'is_active', 'date_joined', 'created_at')
    list_filter = ('is_staff', 'is_active', 'is_admin', 'date_joined')
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    readonly_fields = ('date_joined', 'last_login', 'created_at', 'updated_at')

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Контакты', {'fields': ('phone', 'address')}),
        ('Профиль магазина', {'fields': ('is_admin',)}),
        ('Даты', {'fields': ('created_at', 'updated_at')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Контакты', {'fields': ('phone', 'email')}),
        ('Профиль магазина', {'fields': ('is_admin',)}),
    )
