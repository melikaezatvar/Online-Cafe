from django.db import models
from core.models import TimeStampMixin


class Category(TimeStampMixin):
    name = models.CharField(max_length=255)
    sub_category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name


class Product(TimeStampMixin):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField(null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class Image(TimeStampMixin):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    src = models.ImageField(upload_to='product/images/', null=True, blank=True)
    alt = models.TextField(default=product.name)

    def __str__(self):
        return self.src.url
