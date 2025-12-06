from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer
from catalog.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        product_slug = request.data.get('product_slug')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        # Поддерживаем оба варианта: product_slug и product_id
        if product_slug:
            try:
                product = Product.objects.get(slug=product_slug)
            except Product.DoesNotExist:
                return Response({'error': 'Товар не найден'}, status=404)
        elif product_id:
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({'error': 'Товар не найден'}, status=404)
        else:
            return Response({'error': 'Необходимо указать product_slug или product_id'}, status=400)
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        item_id = request.data.get('item_id')
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        cart_item.delete()
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    def partial_update(self, request, *args, **kwargs):
        cart = self.get_object()
        items = request.data.get('items', [])
        for item_data in items:
            item = CartItem.objects.get(id=item_data['id'], cart=cart)
            item.quantity = item_data['quantity']
            if item.quantity <= 0:
                item.delete()
            else:
                item.save()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        cart = self.get_object()
        item_id = request.data.get('item_id')
        if item_id:
            CartItem.objects.filter(id=item_id, cart=cart).delete()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)