from django.urls import path
from .views import ProductAPIView, HomeAPIView, CategoryProductsAPIView, CategoryAPIView

urlpatterns = [
    path('api/menu/', ProductAPIView.as_view(), name='product-list'),
    path('api/product/<int:pk>/', ProductAPIView.as_view(), name='product'),
    path('api/home/', HomeAPIView.as_view(), name='home'),
    path('', HomeAPIView.as_view(), name='home'),
    path('api/category/', CategoryProductsAPIView.as_view(), name='category'),
    path('api/category/<str:name>/', CategoryAPIView.as_view(), name='category-name')
]
