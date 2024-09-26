from rest_framework import serializers
from .models import Order, OrderItem
from menu.serializer import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()


    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'get_total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'items', 'get_total_price', 'created', 'modified']
