
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
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
