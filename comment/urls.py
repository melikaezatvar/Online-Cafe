from django.urls import path
from .views import CommentManagementAPIView

urlpatterns = [
    path('api/comment/<int:product_id>/', CommentManagementAPIView.as_view(), name='manage_comments'),
    path('api/user-comments/', CommentManagementAPIView.as_view(), name='user_comments'),
    path('api/comment/delete/<int:comment_id>/', CommentManagementAPIView.as_view(), name='comment-delete'),
]
