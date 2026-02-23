from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import api_root
from .admin_site import custom_admin_site

# Подключаем кастомную главную админки (статистика); модели остаются на default site
custom_admin_site._registry = admin.site._registry

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', custom_admin_site.urls),

    # JWT аутентификация
    path('api/auth/jwt/create/', TokenObtainPairView.as_view(), name='jwt-create'),
    path('api/auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
    path('api/auth/jwt/verify/', TokenVerifyView.as_view(), name='jwt-verify'),

    # Djoser эндпоинты (регистрация, смена пароля и т.д.)
    path('api/auth/', include('djoser.urls')),
    
    path('api/catalog/', include('catalog.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
