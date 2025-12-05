
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Brand, Product
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        brand = self.request.query_params.get('brand')
        search = self.request.query_params.get('search')
        if category:
            queryset = queryset.filter(category__slug=category)
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Получаем category_id и brand_id из запроса
        category_id = data.get('category_id') or data.get('category')
        brand_id = data.get('brand_id') or data.get('brand')
        
        if not category_id:
            return Response(
                {"error": "Поле 'category_id' обязательно."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not brand_id:
            return Response(
                {"error": "Поле 'brand_id' обязательно."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            category = Category.objects.get(id=category_id)
            brand = Brand.objects.get(id=brand_id)
        except Category.DoesNotExist:
            return Response(
                {"error": "Категория не найдена."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Brand.DoesNotExist:
            return Response(
                {"error": "Бренд не найден."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Создаем продукт напрямую
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # Сохраняем с правильными связями
        product = serializer.save(category=category, brand=brand)
        
        # Возвращаем полный объект с вложенными данными
        output_serializer = ProductSerializer(product)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # Обрабатываем category_id и brand_id при обновлении
        category_id = data.get('category_id') or data.get('category')
        brand_id = data.get('brand_id') or data.get('brand')
        
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                instance.category = category
            except Category.DoesNotExist:
                return Response(
                    {"error": "Категория не найдена."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        if brand_id:
            try:
                brand = Brand.objects.get(id=brand_id)
                instance.brand = brand
            except Brand.DoesNotExist:
                return Response(
                    {"error": "Бренд не найден."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        output_serializer = ProductSerializer(instance)
        return Response(output_serializer.data)
