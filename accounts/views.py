from rest_framework.generics import CreateAPIView
from .models import CustomerProfile
from .serializers import UserSerializer


class RegisterView(CreateAPIView):
    queryset = CustomerProfile.objects.all()
    serializer_class = UserSerializer


