from django.urls import path
# from .views import UserOrderListCreateView, OrderUpdateView, CancelOrderView, OrderItemUpdateDeleteView
from .views import AddToCartAPIView, UserOrderListView, RemoveOrderAPIView

urlpatterns = [
    path('api/order/add-to-cart/', AddToCartAPIView.as_view(), name='add_to_cart'),
    path('api/orders/', UserOrderListView.as_view(), name='user-order-list'),
    path('order/remove/<int:order_id>/', RemoveOrderAPIView.as_view(), name='remove-order'),

]
