from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView , RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemUpdateSerializer
from menu.models import Product


# لیست سفارشات و ایجاد سفارش جدید هنگام افزودن کالا به سبد خرید
class UserOrderListCreateView(ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        product = Product.objects.get(id=product_id)

        # ایجاد یا پیدا کردن سفارش با وضعیت pending
        order, created = Order.objects.get_or_create(user=request.user, status='pending')

        # ایجاد یا پیدا کردن آیتم سفارش
        order_item, item_created = OrderItem.objects.get_or_create(order=order, product=product)
        if not item_created:
            order_item.quantity += 1
        else:
            order_item.quantity = 1
        order_item.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# به‌روزرسانی وضعیت سفارش
class OrderUpdateView(RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # فقط سفارش‌های pending قابل ویرایش هستند - یا بهتره کل سفارش ها قابل ویرایش باشه
        return Order.objects.filter(user=self.request.user, status='pending')

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        # بررسی وضعیت جدید سفارش
        if new_status not in ['shipped', 'delivered', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        # به‌روزرسانی وضعیت سفارش
        order.status = new_status
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)


# لغو سفارش
class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = Order.objects.filter(id=order_id, user=request.user).first()

        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.status == 'pending':
            order.status = 'cancelled'
            order.save()
            return Response({'message': 'Order cancelled successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Cannot cancel this order'}, status=status.HTTP_400_BAD_REQUEST)




# ویرایش و حذف آیتم سفارش
class OrderItemUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    serializer_class = OrderItemUpdateSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        # فقط آیتم‌های مربوط به سفارشات کاربر
        return OrderItem.objects.filter(order__user=self.request.user)

    def update(self, request, *args, **kwargs):
        order_item = self.get_object()
        serializer = self.get_serializer(order_item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # به‌روزرسانی تعداد
        order_item.quantity = serializer.validated_data['quantity']
        order_item.save()

        return Response({'message': 'Order item updated successfully.'}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        order_item = self.get_object()

        # حذف آیتم از سفارش
        order_item.delete()
        return Response({'message': 'Order item deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
