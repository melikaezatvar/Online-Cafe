from django.urls import path
from .views import CommentManagementAPIView

urlpatterns = [
    path('api/comment/<int:product_id>/', CommentManagementAPIView.as_view(), name='manage_comments'),
]