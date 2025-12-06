from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart, CartItem

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        # Получаем адрес доставки из запроса
        address = request.data.get('address')
        
        # Получаем корзину пользователя
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Корзина не найдена'}, status=400)
        
        # Проверяем, что корзина не пуста
        if not cart.items.exists():
            return Response({'error': 'Корзина пуста'}, status=400)

        # Создаем заказ
        order = Order.objects.create(
            user=request.user, 
            address=address,
            status='pending'  # Устанавливаем начальный статус
        )
        
        # Переносим товары из корзины в заказ
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        
        # Рассчитываем общую сумму заказа
        order.calculate_total()
        
        # Очищаем корзину
        cart.items.all().delete()
        
        return Response(OrderSerializer(order).data)
