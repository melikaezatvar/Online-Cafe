from django.urls import path
from .views import ProductAPIView, HomeAPIView, CategoryProductsAPIView, CategoryAPIView, RatingAPIView

urlpatterns = [
    path('api/menu/', ProductAPIView.as_view(), name='product-list'),
    path('api/product/<int:pk>/', ProductAPIView.as_view(), name='product'),
    path('api/home/', HomeAPIView.as_view(), name='home'),
    path('', HomeAPIView.as_view(), name='home'),
    path('api/category/', CategoryProductsAPIView.as_view(), name='category'),
    path('api/category/<str:name>/', CategoryAPIView.as_view(), name='category-name'),
    path('api/product/rate/<int:product_id>/', RatingAPIView.as_view(), name='get-rating'),
    path('api/product/rate/<int:product_id>/<int:rate>/', RatingAPIView.as_view(), name='rating'),

]
