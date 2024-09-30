from django.urls import path
from .views import UserOrderListCreateView, OrderUpdateView, CancelOrderView, OrderItemUpdateDeleteView

urlpatterns = [
    path('api/orders/', UserOrderListCreateView.as_view(), name='user_orders'),
    path('api/orders/<int:pk>/', OrderUpdateView.as_view(), name='order_update'),
    path('api/orders/<int:order_id>/cancel/', CancelOrderView.as_view(), name='order_cancel'),
    path('api/order-items/<int:pk>/', OrderItemUpdateDeleteView.as_view(), name='order_item_update_delete'),  # برای ویرایش و حذف آیتم
]
