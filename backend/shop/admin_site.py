"""
Кастомная главная админки со статистикой, отчёты (продажи, топ товаров).
"""
from django.contrib import admin
from django.utils import timezone
from django.db.models import Sum, Count, F
from django.urls import path
from django.shortcuts import render


class CustomAdminSite(admin.AdminSite):
    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        today = timezone.now().date()
        week_ago = today - timezone.timedelta(days=7)
        try:
            from orders.models import Order
            extra_context['orders_today'] = Order.objects.filter(created_at__date=today).count()
            extra_context['orders_week'] = Order.objects.filter(created_at__date__gte=week_ago).count()
            rev_today = Order.objects.filter(created_at__date=today).aggregate(Sum('total_price'))['total_price__sum']
            rev_week = Order.objects.filter(created_at__date__gte=week_ago).aggregate(Sum('total_price'))['total_price__sum']
            extra_context['revenue_today'] = rev_today or 0
            extra_context['revenue_week'] = rev_week or 0
        except Exception:
            extra_context['orders_today'] = extra_context['orders_week'] = 0
            extra_context['revenue_today'] = extra_context['revenue_week'] = 0
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            extra_context['users_week'] = User.objects.filter(date_joined__date__gte=week_ago).count()
        except Exception:
            extra_context['users_week'] = 0
        try:
            from catalog.models import Product
            extra_context['zero_stock'] = Product.objects.filter(stock=0).count()
        except Exception:
            extra_context['zero_stock'] = 0
        return super().index(request, extra_context)

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path('reports/', self.admin_view(self.reports_view), name='reports'),
        ]
        return custom + urls

    def reports_view(self, request):
        from orders.models import Order
        from orders.models import OrderItem

        date_from = request.GET.get('date_from') or request.POST.get('date_from')
        date_to = request.GET.get('date_to') or request.POST.get('date_to')
        revenue = None
        orders_count = 0
        top_products = []

        if date_from and date_to:
            try:
                from datetime import datetime
                from django.utils.dateparse import parse_date
                d_from = parse_date(date_from)
                d_to = parse_date(date_to)
                if d_from and d_to:
                    qs = Order.objects.filter(
                        created_at__date__gte=d_from,
                        created_at__date__lte=d_to,
                    )
                    rev = qs.aggregate(Sum('total_price'))['total_price__sum']
                    revenue = rev or 0
                    orders_count = qs.count()
                    # Топ товаров по количеству проданных единиц за период
                    top_products = (
                        OrderItem.objects.filter(order__created_at__date__gte=d_from, order__created_at__date__lte=d_to)
                        .values('product__name', 'product_id')
                        .annotate(total_qty=Sum('quantity'), total_revenue=Sum(F('price') * F('quantity')))
                        .order_by('-total_qty')[:20]
                    )
            except Exception:
                pass

        context = {
            **self.each_context(request),
            'title': 'Отчёты',
            'date_from': date_from,
            'date_to': date_to,
            'revenue': revenue,
            'orders_count': orders_count,
            'top_products': top_products,
            'opts': None,
        }
        return render(request, 'admin/reports.html', context)


custom_admin_site = CustomAdminSite(name='admin')
