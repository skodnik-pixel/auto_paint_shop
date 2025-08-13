
from rest_framework import serializers
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

    def validate(self, data):
        if not data.get('brand'):
            raise serializers.ValidationError("Поле 'brand' обязательно.")
        if not data.get('category'):
            raise serializers.ValidationError("Поле 'category' обязательно.")
        return data
