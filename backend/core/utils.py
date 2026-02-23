"""
Хелперы для использования настроек сайта и шаблонов писем в коде.
Позволяют менять поведение магазина без деплоя (через админку).
"""
from django.utils import timezone
from .models import SiteSettings, EmailTemplate, PromoCode, Campaign


def get_site_settings():
    """Возвращает единственную запись настроек или None, если не создана."""
    return SiteSettings.objects.first()


def get_currency():
    """Валюта магазина (BYN, USD и т.д.)."""
    settings = get_site_settings()
    return (settings.currency or 'BYN').strip() if settings else 'BYN'


def get_delivery_methods():
    """Список способов доставки из настроек: [{"id": "...", "name": "...", "description": "..."}]."""
    settings = get_site_settings()
    if not settings or not settings.delivery_methods:
        return [{'id': 'courier', 'name': 'Курьер', 'description': ''}, {'id': 'pickup', 'name': 'Самовывоз', 'description': ''}]
    return settings.delivery_methods


def get_payment_methods():
    """Список способов оплаты из настроек: [{"id": "...", "name": "...", "description": "..."}]."""
    settings = get_site_settings()
    if not settings or not settings.payment_methods:
        return [{'id': 'cash', 'name': 'Наличными', 'description': ''}, {'id': 'card', 'name': 'Картой при получении', 'description': ''}]
    return settings.payment_methods


def get_email_template(slug):
    """
    Возвращает активный шаблон письма по slug или None.
    Для подстановки переменных в subject/body используйте str.format или шаблонизатор.
    """
    return EmailTemplate.objects.filter(slug=slug, is_active=True).first()


def render_email_body(template, context):
    """
    Подставляет переменные из context в body (и при необходимости в subject).
    context — словарь, например {'order_id': 123, 'user_name': 'Иван'}.
    """
    if not template:
        return '', ''
    subject = template.subject
    body = template.body
    for key, value in context.items():
        subject = subject.replace('{{ ' + key + ' }}', str(value))
        body = body.replace('{{ ' + key + ' }}', str(value))
    return subject, body


def get_valid_promo_code(code):
    """
    Возвращает активный промокод по коду, если он действителен (по датам и лимиту использований), иначе None.
    """
    if not code or not code.strip():
        return None
    promo = PromoCode.objects.filter(code__iexact=code.strip(), is_active=True).first()
    if not promo:
        return None
    now = timezone.now()
    if promo.valid_from and now < promo.valid_from:
        return None
    if promo.valid_until and now > promo.valid_until:
        return None
    if promo.max_uses is not None and promo.used_count >= promo.max_uses:
        return None
    return promo


def get_active_campaigns():
    """Возвращает активные кампании, у которых текущая дата в интервале [start_date, end_date]."""
    now = timezone.now()
    return Campaign.objects.filter(
        is_active=True,
        start_date__lte=now,
        end_date__gte=now,
    )
