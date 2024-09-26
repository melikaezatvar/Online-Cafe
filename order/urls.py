from django.urls import path
from .views import OrderListAPIView


urlpatterns = [
    path('orders/', OrderListAPIView.as_view(), name='order-list'),
]
