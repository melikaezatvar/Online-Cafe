from django_filters import rest_framework as filters
from rest_framework import generics
from .models import Order
from .serializers import OrderSerializer


class OrderFilter(filters.FilterSet):
    from_date = filters.DateFilter(field_name="created", lookup_expr='gte')
    to_date = filters.DateFilter(field_name="created", lookup_expr='lte')
    product_category = filters.CharFilter(field_name="items__product__category__name", lookup_expr='icontains')

    class Meta:
        model = Order
        fields = ['status', 'from_date', 'to_date', 'product_category']


class OrderListAPIView(generics.ListAPIView):
    queryset = Order.objects.prefetch_related('items__product').all()
    serializer_class = OrderSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = OrderFilter
