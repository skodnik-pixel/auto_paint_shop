from django.contrib import admin
from django.db.models import F, Q
from django.utils.html import format_html
from .models import Product, Category, Brand, StockMovement, Review, ProductImage


def get_low_stock_threshold(product):
    """Порог для товара: свой или общий из настроек."""
    if product.low_stock_threshold is not None:
        return product.low_stock_threshold
    from core.utils import get_site_settings
    settings = get_site_settings()
    return (settings.low_stock_threshold or 5) if settings else 5


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    fields = ['name', 'slug', 'meta_title', 'meta_description']


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


class LowStockFilter(admin.SimpleListFilter):
    title = 'остаток'
    parameter_name = 'low_stock'

    def lookups(self, request, model_admin):
        return [
            ('low', 'Мало на складе'),
            ('ok', 'Норма'),
        ]

    def queryset(self, request, queryset):
        from core.utils import get_site_settings
        settings = get_site_settings()
        default_threshold = (settings.low_stock_threshold or 5) if settings else 5
        low_q = (Q(low_stock_threshold__isnull=True) & Q(stock__lt=default_threshold)) | (
            Q(low_stock_threshold__isnull=False) & Q(stock__lt=F('low_stock_threshold'))
        )
        if self.value() == 'low':
            return queryset.filter(low_q)
        if self.value() == 'ok':
            return queryset.exclude(low_q)
        return queryset


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ('image', 'caption', 'order')


class StockMovementInline(admin.TabularInline):
    model = StockMovement
    extra = 1
    can_delete = True
    max_num = 15
    show_change_link = True
    fields = ('quantity', 'movement_type', 'order', 'comment', 'created_at')

    def get_readonly_fields(self, request, obj=None):
        if obj is not None:
            return ('quantity', 'movement_type', 'order', 'comment', 'created_at')
        return ('created_at',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'name', 'slug', 'price', 'stock_display', 'category', 'brand', 'is_published']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    fields = ['name', 'slug', 'description', 'price', 'stock', 'low_stock_threshold', 'category', 'brand', 'image', 'is_published', 'meta_title', 'meta_description']
    inlines = [ProductImageInline, StockMovementInline]
    list_filter = ['category', 'brand', 'is_published', LowStockFilter]
    actions = ['make_published', 'make_unpublished', 'set_category_action']

    @admin.display(description='Превью')
    def image_preview(self, obj):
        if not obj.image:
            return '—'
        return format_html(
            '<img src="{}" style="max-width: 50px; max-height: 50px; object-fit: contain;" />',
            obj.image,
        )

    @admin.display(description='Остаток')
    def stock_display(self, obj):
        threshold = get_low_stock_threshold(obj)
        if obj.stock < threshold:
            return format_html(
                '<span style="color: #c00; font-weight: bold;">{} ⚠ мало</span>',
                obj.stock,
            )
        return obj.stock

    @admin.action(description='Опубликовать выбранные')
    def make_published(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'Опубликовано товаров: {updated}.')

    @admin.action(description='Снять с публикации выбранные')
    def make_unpublished(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'Снято с публикации товаров: {updated}.')

    @admin.action(description='Изменить категорию (по фильтру слева)')
    def set_category_action(self, request, queryset):
        from .models import Category
        category_id = request.GET.get('category__id__exact')
        if category_id:
            try:
                cat = Category.objects.get(pk=category_id)
                updated = queryset.update(category=cat)
                self.message_user(request, f'Категория изменена у товаров: {updated}.')
            except Category.DoesNotExist:
                self.message_user(request, 'Категория не найдена.', level=40)
        else:
            self.message_user(request, 'Сначала выберите категорию в фильтре слева и снова примените действие.', level=40)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'rating')
    search_fields = ('product__name', 'text', 'user__username')
    list_editable = ('is_approved',)
    readonly_fields = ('created_at',)
    raw_id_fields = ('product', 'user')
    date_hierarchy = 'created_at'
    actions = ['approve_reviews', 'reject_reviews']

    @admin.action(description='Одобрить выбранные')
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'Одобрено отзывов: {updated}.')

    @admin.action(description='Снять одобрение')
    def reject_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'Снято одобрение у отзывов: {updated}.')


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'movement_type', 'order', 'comment', 'created_at')
    list_filter = ('movement_type', 'created_at')
    search_fields = ('product__name', 'comment')
    readonly_fields = ('created_at',)
    raw_id_fields = ('product', 'order')
    date_hierarchy = 'created_at'


