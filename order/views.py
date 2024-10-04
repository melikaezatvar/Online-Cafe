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




class OrderDetailAPIView(APIView):
    def get(self, request, order_id, *args, **kwargs):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
