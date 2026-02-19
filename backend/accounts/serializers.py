from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from djoser.serializers import UserSerializer as DjoserUserSerializer
from .models import User
from .validators import normalize_phone_belarus

class UserCreateSerializer(DjoserUserCreateSerializer):
    """Сериализатор для регистрации пользователя. Сохраняет phone при создании."""
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'password', 're_password', 'phone']

    def create(self, validated_data):
        phone = validated_data.pop('phone', None) or ''
        user = super().create(validated_data)
        user.phone = phone or None
        user.save(update_fields=['phone'])
        return user

    def validate_phone(self, value):
        """Валидация телефона: только белорусский формат +375 (25|29|33|44) XXXXXXX."""
        if not value or not value.strip():
            return ''
        formatted, err = normalize_phone_belarus(value)
        if err:
            raise serializers.ValidationError(err)
        return formatted or ''

    def validate_username(self, value):
        """Проверка имени пользователя"""
        if len(value) < 3:
            raise serializers.ValidationError("Имя пользователя должно содержать минимум 3 символа")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value
    
    def validate_email(self, value):
        """Проверка email"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

class UserSerializer(DjoserUserSerializer):
    """Сериализатор для отображения информации о пользователе"""
    class Meta(DjoserUserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']