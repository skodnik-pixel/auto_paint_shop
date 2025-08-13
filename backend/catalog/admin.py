from django.contrib import admin
from .models import Product, Category, Brand

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price', 'stock', 'category', 'brand']
    list_filter = ['category', 'brand']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    fields = ['name', 'slug', 'description', 'price', 'stock', 'category', 'brand', 'image']


