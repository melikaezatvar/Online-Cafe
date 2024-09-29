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

    class Meta:
        model = CustomerProfile
        fields = ['username', 'first_name', 'last_name', 'phone_number', 'password', 'birthday', 'email']
        extra_kwargs = {
            'username': {'read_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
            'password': {'required': False},
            'birthday': {'required': False},
            'email': {'required': False}
        }

        # def update(self, instance, validated_data):
        #     print(validated_data)
        #     instance.set_password(validated_data.pop('password', instance.password))
        #     instance.objects.update_user(**validated_data)





