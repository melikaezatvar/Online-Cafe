from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from menu.models import Product
from .models import CustomerProfile
from .serializers import UserSerializer, LoginSerializer, UserProfileSerializer, UserPasswordSerializer


class RegisterView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        return Response({'serializer': serializer}, template_name='account/register.html')

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        try:
            assert not CustomerProfile.objects.filter(username=request.data['username']).exists(), 'username already exists'
            assert request.data['password'] == request.data['confirm_password'], 'Passwords must match'
            if serializer.is_valid():
                user = serializer.save()
                login(request, user)
                return Response(status=status.HTTP_201_CREATED, template_name='home.html')
        except AssertionError:
            return Response(status=status.HTTP_400_BAD_REQUEST, template_name='account/register.html')


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
        return Response(template_name='account/register.html', status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):

    def post(self, request, *args, **kwargs):
        logout(request)
        return redirect('home')
        # return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(LoginRequiredMixin, APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response({'serializer': serializer.data}, template_name='account/profile.html')

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            # login(request, user)
            return Response({'message': 'Profile updated successfully!'}, template_name='account/profile.html')

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST, template_name='account/profile.html')


class ResetPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = UserPasswordSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            login(request, user)
            return Response({'message': 'Password updated successfully!'}, template_name='account/profile.html')

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST, template_name='account/profile.html')


class FavoriteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        favorite_products = user.favorite.all()
        return Response({"favorite_products": favorite_products},
                        status=status.HTTP_200_OK)

    def post(self, request, product_id):
        user = request.user

        try:
            product = Product.objects.get(id=product_id)
            if product in user.favorite.all():
                # Remove Product
                user.favorite.remove(product)
                return Response({"message": "Product removed from favorites."},
                                status=status.HTTP_200_OK)
            else:
                # Add Product
                user.favorite.add(product)
                return Response({"message": "Product added to favorites."}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."},
                            status=status.HTTP_404_NOT_FOUND)
