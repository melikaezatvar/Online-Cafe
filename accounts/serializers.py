from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ('username', 'phone_number', 'password')

    def create(self, validated_data):
        user = CustomerProfile(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user



