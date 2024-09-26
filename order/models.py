# orders/models.py
from django.conf import settings
from django.db import models
from core.models import TimeStampMixin
from django.contrib.auth.models import User
# from accounts.models import CustomerProfile
from menu.models import Product


class Order(TimeStampMixin):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Order #{self.id} by {self.user.name}"

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    # orders/models.py


class OrderItem(TimeStampMixin):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def get_total_price(self):
        return self.product.price * self.quantity
