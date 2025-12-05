
from rest_framework import serializers
from django.utils.text import slugify
from .models import Category, Brand, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'category', 'brand', 'name', 'slug', 'description', 'price', 'stock', 'image']

    def validate_slug(self, value):
        """Автоматически преобразуем slug в правильный формат, если он содержит недопустимые символы"""
        if value:
            # Используем Django slugify для преобразования
            # Он автоматически транслитерирует кириллицу и убирает спецсимволы
            formatted_slug = slugify(value, allow_unicode=False)
            if formatted_slug:
                return formatted_slug
            # Если slugify вернул пустую строку, используем fallback
            return slugify(value.replace(' ', '-').replace('.', '-'), allow_unicode=False)
        return value

    def validate(self, data):
        if not data.get('brand'):
            raise serializers.ValidationError("Поле 'brand' обязательно.")
        if not data.get('category'):
            raise serializers.ValidationError("Поле 'category' обязательно.")
        
        # Если slug не указан или содержит недопустимые символы, создаем из названия
        if 'slug' in data and data['slug']:
            # slug уже будет преобразован в validate_slug
            pass
        elif 'name' in data and data['name']:
            # Автоматически создаем slug из названия, если slug не указан
            data['slug'] = slugify(data['name'], allow_unicode=False)
        
        return data
