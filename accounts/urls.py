from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileView, ResetPasswordView, FavoriteProductAPIView, FavoriteProductsListAPIView

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/profile/resetpass/', ResetPasswordView.as_view(), name='reset-password'),
    path('api/favorites/', FavoriteProductsListAPIView.as_view(), name='favorites'),
    path('api/favorites/<int:product_id>/', FavoriteProductAPIView.as_view(), name='favorites')
]
