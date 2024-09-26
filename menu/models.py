from django.db import models
from core.models import TimeStampMixin, AbstractDeleteModel


class Category(TimeStampMixin, AbstractDeleteModel):
    name = models.CharField(max_length=255, unique=True)
    _parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='childes')

    @property
    def parent(self):
        parents = []

        def check_parent(child: Category):
            if child._parent:
                parents.append(child._parent.name)
                return check_parent(child._parent)
        check_parent(self)
        return ' > '.join(parents)

    @property
    def get_childes(self):
        return [child.name for child in self.childes.filter(is_delete=False)]

    @property
    def get_products(self):
        return [product.name for product in self.products.filter(is_delete=False)]

    def __str__(self):
        return self.name


class Product(TimeStampMixin, AbstractDeleteModel):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField(null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class Image(TimeStampMixin, AbstractDeleteModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    src = models.ImageField(upload_to='product/images/', null=True, blank=True)
    alt = models.TextField(default=product.name)

    def __str__(self):
        return self.src.url
