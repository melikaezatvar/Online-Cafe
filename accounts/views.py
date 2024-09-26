from django.contrib.auth import login, logout
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer


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

            # Redirect to log in after successful registration
            return Response(serializer.data, status=status.HTTP_201_CREATED, template_name='index.html')
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST, template_name='account/register.html')


class LoginView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'account/login.html'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return redirect('home')
        return Response({'serializer': serializer}, template_name=self.template_name)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

# window location for js handeling to redirect home url