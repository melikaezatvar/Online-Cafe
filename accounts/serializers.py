from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ('username', 'phone_number', 'password')

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        user = CustomerProfile.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        phone_number = data.get('phone_number')
        password = data.get('password')

        user = authenticate(phone_number=phone_number, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        return user


