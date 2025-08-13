from rest_framework import serializers
from djoser.serializers import UserCreateSerializer, UserSerializer
from .models import User

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_admin']

class UserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'is_admin']