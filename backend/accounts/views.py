from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login_view(request):
    """
    Авторизация пользователя
    Принимает: username, password
    Возвращает: auth_token (Token для API), user_id, username, email, is_admin
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Необходимо указать имя пользователя и пароль'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Аутентификация пользователя
    user = authenticate(username=username, password=password)
    
    if user:
        # Создаем или получаем Token для пользователя
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'auth_token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'is_admin': user.is_admin
        })
    else:
        return Response(
            {'error': 'Неверное имя пользователя или пароль'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Выход пользователя из системы
    Удаляет токен пользователя
    """
    try:
        # Удаляем токен пользователя
        request.user.auth_token.delete()
        return Response({'message': 'Вы успешно вышли из системы'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Получение профиля текущего пользователя
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'phone': user.phone,
        'is_admin': user.is_admin,
        'created_at': user.created_at
    })
