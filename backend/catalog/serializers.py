
from rest_framework import serializers
from django.utils.text import slugify
from .models import Category, Brand, Product
import re

def transliterate_russian(text):
    """Транслитерация русских символов в латиницу"""
    translit_dict = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
        'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }
    
    result = []
    for char in text:
        result.append(translit_dict.get(char, char))
    return ''.join(result)

def create_slug(text):
    """Создание slug из текста с поддержкой кириллицы"""
    # Транслитерируем русские символы
    text = transliterate_russian(text)
    # Заменяем точки и другие символы на дефисы
    text = re.sub(r'[^\w\s-]', '-', text)
    # Заменяем пробелы на дефисы
    text = re.sub(r'[\s_]+', '-', text)
    # Убираем множественные дефисы
    text = re.sub(r'-+', '-', text)
    # Убираем дефисы в начале и конце
    text = text.strip('-')
    # Приводим к нижнему регистру
    return text.lower()

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
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(), source='brand', write_only=True
    )
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_id', 'brand', 'brand_id',
            'name', 'slug', 'description', 'price', 'stock', 'image'
        ]

    def validate(self, data):
        # Если slug не указан или пустой, создаем из названия
        if not data.get('slug') and data.get('name'):
            data['slug'] = create_slug(data['name'])
        elif data.get('slug'):
            # Если slug указан, преобразуем его в правильный формат
            data['slug'] = create_slug(data['slug'])
        
        return data
