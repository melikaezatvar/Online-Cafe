from django.urls import path
# from .views import UserOrderListCreateView, OrderUpdateView, CancelOrderView, OrderItemUpdateDeleteView
from .views import AddToCartAPIView

urlpatterns = [
    path('api/add-to-cart/', AddToCartAPIView.as_view(), name='add_to_cart'),
#     path('api/orders/<int:pk>/', OrderUpdateView.as_view(), name='order_update'),
#     path('api/orders/<int:order_id>/cancel/', CancelOrderView.as_view(), name='order_cancel'),
#     path('api/order-items/<int:pk>/', OrderItemUpdateDeleteView.as_view(), name='order_item_update_delete'),  # برای ویرایش و حذف آیتم
]
