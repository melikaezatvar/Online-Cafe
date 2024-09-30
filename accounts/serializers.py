from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ('username', 'phone_number', 'password')
        extra_kwargs = {
            'phone_number': {'required': False}
        }

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        user = CustomerProfile.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid username or password")
        return {'user': user}


class UserProfileSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomerProfile
        fields = ['username', 'first_name', 'last_name', 'phone_number', 'password', 'birthday', 'email', 'old_password', 'new_password', 'confirm_password']
        extra_kwargs = {
            'username': {'read_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
            'password': {'required': False},
            'birthday': {'required': False},
            'email': {'required': False}
        }

    def validate(self, data):
        user = self.instance
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if old_password or new_password or confirm_password:
            try:
                if old_password and not check_password(old_password, user.password):
                    raise ValidationError({'old_password': 'Old password is incorrect.'})

                if new_password and confirm_password and new_password != confirm_password:
                    raise ValidationError({'confirm_password': 'New password and confirm password do not match.'})

            except ValidationError as e:
                raise serializers.ValidationError(e.messages)

        return data

