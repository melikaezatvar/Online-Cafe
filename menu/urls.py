from django.urls import path
from .views import ProductAPIView, HomeAPIView, CategoryAPIView

urlpatterns = [
    path('api/product', ProductAPIView.as_view(), name='product-list'),
    path('api/product/<int:pk>', ProductAPIView.as_view(), name='product'),
    path('api/product/<str:name>', ProductAPIView.as_view(), name='product-list-by-category'),
    path('api/home/', HomeAPIView.as_view(), name='home'),
    path('api/category/', CategoryAPIView.as_view(), name='category')
]
