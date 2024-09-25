from django.urls import path
from .views import ProductAPIView, HomeAPIView

urlpatterns = [
    path('api/product', ProductAPIView.as_view(), name='product-list'),
    path('api/product/<int:pk>', ProductAPIView.as_view(), name='product'),
    path('api/product/<str:name>', ProductAPIView.as_view(), name='product-list-by-category'),
    path('home/', HomeAPIView.as_view(), name='home'),
]
