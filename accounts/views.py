from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomerProfile
from .serializers import UserSerializer, LoginSerializer


class RegisterView(ListCreateAPIView):
    renderer_classes = [TemplateHTMLRenderer]
    queryset = CustomerProfile.objects.all()
    serializer_class = UserSerializer
    template_name = 'account/register.html'


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

# window location for js handeling to redirect home url