from django.urls import path
from .views import ProductAPIView, HomeAPIView, CategoryNavAPIView, CategoryAPIView

urlpatterns = [
    path('api/menu/', ProductAPIView.as_view(), name='product-list'),
    path('api/product/<int:pk>/', ProductAPIView.as_view(), name='product'),
    path('api/product/<str:name>/', ProductAPIView.as_view(), name='product-list-by-category'),
    path('api/home/', HomeAPIView.as_view(), name='home'),
    path('api/category/', CategoryNavAPIView.as_view(), name='category'),
    path('api/category/<str:name>/', CategoryAPIView.as_view(), name='category-name')
]
