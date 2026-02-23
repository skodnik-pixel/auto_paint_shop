from django.contrib import admin
from .models import SiteSettings, Page, EmailTemplate, PromoCode, Campaign, ContactRequest, MediaItem


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'currency', 'contact_phone', 'contact_email', 'updated_at')
    fieldsets = (
        (None, {'fields': ('site_name', 'currency', 'low_stock_threshold')}),
        ('Контакты', {'fields': ('contact_phone', 'contact_email', 'contact_address')}),
        ('Способы доставки и оплаты', {
            'fields': ('delivery_methods', 'payment_methods'),
            'description': 'Списки в формате JSON. id — значение для заказа (courier, pickup, cash, card и т.д.).',
        }),
        ('Информация для покупателей', {'fields': ('delivery_info', 'payment_info')}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_active', 'updated_at')
    list_filter = ('is_active', 'slug')
    search_fields = ('title', 'content')
    prepopulated_fields = {}
    readonly_fields = ('updated_at',)
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'content', 'is_active')}),
        ('SEO', {'fields': ('meta_title', 'meta_description')}),
        ('Даты', {'fields': ('updated_at',)}),
    )


@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'image', 'alt', 'uploaded_at')
    search_fields = ('name', 'alt')
    readonly_fields = ('uploaded_at',)


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'subject', 'is_active', 'updated_at')
    list_filter = ('is_active', 'slug')
    search_fields = ('name', 'subject', 'body')
    readonly_fields = ('updated_at',)


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'min_order_amount', 'valid_from', 'valid_until', 'used_count', 'max_uses', 'is_active')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code',)
    readonly_fields = ('used_count', 'created_at', 'updated_at')
    filter_horizontal = ('categories', 'products')
    fieldsets = (
        (None, {'fields': ('code', 'discount_type', 'value', 'is_active')}),
        ('Условия', {'fields': ('min_order_amount', 'valid_from', 'valid_until', 'max_uses', 'used_count')}),
        ('Применимость', {'fields': ('categories', 'products'), 'description': 'Пусто = скидка на весь заказ.'}),
        ('Даты', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'discount_type', 'value', 'start_date', 'end_date', 'is_active')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('categories', 'products')
    fieldsets = (
        (None, {'fields': ('name', 'discount_type', 'value', 'is_active')}),
        ('Период', {'fields': ('start_date', 'end_date')}),
        ('Применимость', {'fields': ('categories', 'products'), 'description': 'Пусто = на весь каталог.'}),
        ('Даты', {'fields': ('created_at', 'updated_at')}),
    )


# Аудит: кто что изменил в админке (Django LogEntry)
from django.contrib.admin.models import LogEntry


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('action_time', 'user', 'content_type', 'object_repr', 'action_flag', 'change_message')
    list_filter = ('action_flag', 'content_type')
    search_fields = ('object_repr', 'change_message', 'user__username')
    date_hierarchy = 'action_time'
    readonly_fields = ('action_time', 'user', 'content_type', 'object_id', 'object_repr', 'action_flag', 'change_message')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('status',)
    fieldsets = (
        (None, {'fields': ('name', 'email', 'phone', 'subject', 'message', 'status')}),
        ('Ответ', {'fields': ('admin_response',)}),
        ('Даты', {'fields': ('created_at', 'updated_at')}),
    )
