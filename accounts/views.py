from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from menu.models import Product
from .serializers import UserSerializer, LoginSerializer, UserProfileSerializer


class RegisterView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        return Response({'serializer': serializer}, template_name='account/register.html')

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)

            return Response(serializer.data, status=status.HTTP_201_CREATED, template_name='home.html')
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST, template_name='account/register.html')


class LoginView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        serializer = LoginSerializer()
        return Response({'serializer': serializer}, template_name='account/register.html')

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return redirect('home')
        return Response({'serializer': serializer}, template_name='account/register.html', status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):

    def get(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(LoginRequiredMixin, APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response({'serializer': serializer}, template_name='account/profile.html')

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            user.set_password(serializer.validated_data.pop('password', user.password))
            user.save()
            login(request, user)
            return Response({'serializer': serializer, 'message': 'Profile updated successfully!'}, template_name='account/profile.html')
        return Response({'serializer': serializer}, status=status.HTTP_400_BAD_REQUEST, template_name='account/profile.html')
