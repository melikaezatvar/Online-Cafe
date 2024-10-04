from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from menu.models import Product
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class AddToCartAPIView(GenericAPIView, ListModelMixin):
    serializer_class = OrderSerializer
    # print(10)
    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')  # دریافت آیدی محصول از درخواست
        quantity = int(request.data.get('quantity', 1)) # دریافت تعداد از درخواست یا پیش‌فرض به 1
        # print(20)
        try:
            product = Product.objects.get(id=product_id)  # دریافت محصول از دیتابیس
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        # print(30)
        # بررسی اینکه آیا سفارش فعالی برای کاربر وجود دارد یا خیر
        order, created = Order.objects.get_or_create(user=request.user, status='pending')

        # بررسی اینکه آیا این کالا قبلاً در سفارش وجود دارد یا خیر
        order_item, item_created = OrderItem.objects.get_or_create(order=order, product=product)

        if item_created:
            # اگر کالا تازه به سفارش اضافه شده، تعداد را تنظیم می‌کنیم
            order_item.quantity = quantity
        else:
            # اگر کالا قبلاً وجود داشته، تعداد را افزایش می‌دهیم
            order_item.quantity += quantity

        order_item.save()  # ذخیره آیتم سفارش

        # برگرداندن اطلاعات سفارش
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)




class UserOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # بازیابی لیست سفارشات کاربر وارد شده
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)



class RemoveOrderAPIView(APIView):
    def delete(self, request, order_id, *args, **kwargs):
        try:
            order = Order.objects.get(id=order_id, user=request.user, status='pending')
            order.delete()
            return Response({"message": "Order removed successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            return Response({"error": "Order not found or not in pending status"}, status=status.HTTP_404_NOT_FOUND)



# # لیست سفارشات و ایجاد سفارش جدید هنگام افزودن کالا به سبد خرید
# class UserOrderListCreateView(ListCreateAPIView):
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         print("123")
#         return Order.objects.filter(user=self.request.user)
#
#     def post(self, request, *args, **kwargs):
#         product_id = request.data.get('product_id')
#         product = Product.objects.get(id=product_id)
#
#
#         # ایجاد یا پیدا کردن سفارش با وضعیت pending
#         order, created = Order.objects.get_or_create(user=request.user, status='pending')
#
#         print(product,'2')
#
#         # ایجاد یا پیدا کردن آیتم سفارش
#         order_item, item_created = OrderItem.objects.get_or_create(order=order, product=product)
#         print(product, '22')
#         if not item_created:
#             order_item.quantity += 1
#             print(product, 3)
#         else:
#             order_item.quantity = 1
#             print(product, 4)
#         order_item.save()
#
#         print(product, 5)
#         serializer = self.get_serializer(order)
#         print(product, 6)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#
#
# # به‌روزرسانی وضعیت سفارش
# class OrderUpdateView(RetrieveUpdateAPIView):
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         # فقط سفارش‌های pending قابل ویرایش هستند - یا بهتره کل سفارش ها قابل ویرایش باشه
#         return Order.objects.filter(user=self.request.user, status='pending')
#
#     def update(self, request, *args, **kwargs):
#         order = self.get_object()
#         new_status = request.data.get('status')
#
#         # بررسی وضعیت جدید سفارش
#         if new_status not in ['shipped', 'delivered', 'cancelled']:
#             return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
#
#         # به‌روزرسانی وضعیت سفارش
#         order.status = new_status
#         order.save()
#
#         serializer = self.get_serializer(order)
#         return Response(serializer.data)
#
#
# # لغو سفارش
# class CancelOrderView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, order_id):
#         order = Order.objects.filter(id=order_id, user=request.user).first()
#
#         if not order:
#             return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
#
#         if order.status == 'pending':
#             order.status = 'cancelled'
#             order.save()
#             return Response({'message': 'Order cancelled successfully'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Cannot cancel this order'}, status=status.HTTP_400_BAD_REQUEST)
#
#
#
#
# # ویرایش و حذف آیتم سفارش
# class OrderItemUpdateDeleteView(RetrieveUpdateDestroyAPIView):
#     serializer_class = OrderItemUpdateSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         # فقط آیتم‌های مربوط به سفارشات کاربر
#         return OrderItem.objects.filter(order__user=self.request.user)
#
#     def update(self, request, *args, **kwargs):
#         order_item = self.get_object()
#         serializer = self.get_serializer(order_item, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#
#         # به‌روزرسانی تعداد
#         order_item.quantity = serializer.validated_data['quantity']
#         order_item.save()
#
#         return Response({'message': 'Order item updated successfully.'}, status=status.HTTP_200_OK)
#
#     def destroy(self, request, *args, **kwargs):
#         order_item = self.get_object()
#
#         # حذف آیتم از سفارش
#         order_item.delete()
#         return Response({'message': 'Order item deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
