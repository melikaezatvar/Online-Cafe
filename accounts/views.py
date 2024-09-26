from django.contrib.auth import login, logout
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomerProfile
from .serializers import UserSerializer, LoginSerializer


class RegisterView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    queryset = CustomerProfile.objects.all()
    serializer_class = UserSerializer
    template_name = 'account/register.html'

    # def get(self, request, *args, **kwargs):
    #     serializer = self.serializer_class(data=request.data)
    #     return Response({'serializer': serializer}, template_name=self.template_name)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return redirect('login')  # Redirect to log in after successful registration
        return Response({'serializer': serializer}, template_name=self.template_name)


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