from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from menu.models import Product
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomerProfile
from datetime import date


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomerProfile
        fields = ('username', 'phone_number', 'password', 'confirm_password')
        extra_kwargs = {
            'phone_number': {'required': False},
            'confirm_password': {'required': False},
        }

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        if 'phone_number' in validated_data and not validated_data['phone_number']:
            validated_data['phone_number'] = None
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
    class Meta:
        model = CustomerProfile
        fields = ['username', 'first_name', 'last_name', 'phone_number', 'birthday', 'email']
        extra_kwargs = {
            'username': {'read_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
            'birthday': {'required': False},
            'email': {'required': False}
        }

    def validate_birthday(self, value):
        if value is None:
            return value
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 12:
            raise serializers.ValidationError("You must be at least 12 years old!")
        return value


class UserPasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta(object):
        model = CustomerProfile
        fields = ['old_password', 'new_password', 'confirm_password']

    def validate(self, data):
        user = self.instance
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if old_password and new_password and confirm_password:
            try:
                if old_password and not check_password(old_password, user.password):
                    raise ValidationError({'old_password': 'Old password is incorrect.'})

                if new_password and confirm_password and new_password != confirm_password:
                    raise ValidationError({'confirm_password': 'New password and confirm password do not match.'})
                user.set_password(new_password)
                return data

            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        else:
            raise ValidationError('all fields are required!')


class FavoriteProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'images']

    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        if obj.images.exists():
            return obj.images.first().src
        return None
