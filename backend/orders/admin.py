from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'delivery_method', 'payment_method', 'created_at')
    list_filter = ('status', 'delivery_method', 'payment_method', 'created_at')
    search_fields = ('user__username', 'user__email', 'phone', 'address', 'id')
    readonly_fields = ('created_at', 'total_price')
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]
    fieldsets = (
        (None, {
            'fields': ('user', 'status', 'total_price', 'created_at')
        }),
        ('Доставка и оплата', {
            'fields': ('address', 'phone', 'delivery_method', 'payment_method')
        }),
        ('Дополнительно', {
            'fields': ('comment',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'price')
    list_filter = ('order',)
    search_fields = ('product__name', 'order__id')
