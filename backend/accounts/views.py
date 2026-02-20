from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .validators import normalize_phone_belarus
from .serializers import UserCreateSerializer
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Регистрация пользователя. Принимает username, email, password, re_password, phone.
    Гарантированно сохраняет телефон (в отличие от Djoser, который может не прокидывать кастомные поля).
    """
    serializer = UserCreateSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = serializer.save()
    except Exception as e:
        return Response(
            {'detail': str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return Response(
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone or '',
        },
        status=status.HTTP_201_CREATED,
    )


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

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    GET: получение профиля текущего пользователя.
    PATCH: обновление полей профиля (phone и др.) для существующих пользователей.
    """
    user = request.user
    if request.method == 'GET':
        phone = getattr(user, 'phone', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': (phone.strip() if isinstance(phone, str) and phone else '') or '',
            'is_admin': user.is_admin,
            'created_at': getattr(user, 'created_at', None),
        })
    # PATCH — редактирование профиля (телефон только в формате Беларусь)
    phone = request.data.get('phone')
    if phone is not None:
        phone_str = phone.strip() if isinstance(phone, str) else ''
        if phone_str:
            formatted, err = normalize_phone_belarus(phone_str)
            if err:
                return Response({'phone': [err]}, status=status.HTTP_400_BAD_REQUEST)
            user.phone = formatted
        else:
            user.phone = None
        user.save(update_fields=['phone'])
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'phone': user.phone or '',
        'is_admin': user.is_admin,
        'created_at': getattr(user, 'created_at', None),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Смена пароля. Требует текущий пароль и новый пароль.
    Новый пароль действует при следующих входах.
    """
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    re_new_password = request.data.get('re_new_password')

    if not current_password:
        return Response(
            {'error': 'Введите текущий пароль'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if not new_password:
        return Response(
            {'error': 'Введите новый пароль'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if new_password != re_new_password:
        return Response(
            {'error': 'Новый пароль и подтверждение не совпадают'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if len(new_password) < 8:
        return Response(
            {'error': 'Новый пароль должен быть не короче 8 символов'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = request.user
    if not user.check_password(current_password):
        return Response(
            {'error': 'Неверный текущий пароль'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()
    return Response({'message': 'Пароль успешно изменён. Используйте новый пароль при следующем входе.'})
