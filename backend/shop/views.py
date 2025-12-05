from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    """
    Корневой эндпоинт API
    """
    return Response({
        'message': 'Добро пожаловать в API магазина автокосметики',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'catalog': {
                'products': '/api/catalog/products/',
                'categories': '/api/catalog/categories/',
                'brands': '/api/catalog/brands/',
            },
            'accounts': {
                'register': '/api/accounts/auth/users/',
                'login': '/api/accounts/login/',
                'profile': '/api/accounts/profile/',
            },
            'cart': '/api/cart/',
            'orders': '/api/orders/',
        }
    })

