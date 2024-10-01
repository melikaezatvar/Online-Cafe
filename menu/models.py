from django.db import models
from core.models import TimeStampMixin, AbstractDeleteModel


class Category(TimeStampMixin, AbstractDeleteModel):
    name = models.CharField(max_length=255)
    _parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='childes')

    @property
    def parent(self):
        parents = []

        def check_parent(child: Category):
            if child._parent:
                parents.append(child._parent.name)
                return check_parent(child._parent)

        check_parent(self)
        parents.reverse()
        return parents

    @property
    def get_childes(self):
        return [child.name for child in self.childes.filter(is_delete=False)]

    @property
    def get_products(self):
        products = []

        def check_products(child: Category):
            if child.products.exists():
                for pr in child.products.all():
                    products.append({
                        'id': pr.id,
                        'name': pr.name,
                        'price': pr.price,
                        'images': [{'src': image.src.url, 'alt': image.alt} for image in pr.images.all()]})
            else:
                for ch in child.childes.all():
                    check_products(ch)

        check_products(self)
        return products

    class Meta:
        unique_together = ('name', '_parent')

    def __str__(self):
        return self.name


class Product(TimeStampMixin, AbstractDeleteModel):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    quantity = models.PositiveIntegerField(null=True, blank=True)

    @property
    def description(self):
        return self.details.values_list('attribute_name', 'attribute_value')

    def __str__(self):
        return self.name


class Image(TimeStampMixin, AbstractDeleteModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    src = models.ImageField(upload_to='product/images/', null=True, blank=True)
    alt = models.TextField(default=product.name, null=True, blank=True)

    def __str__(self):
        return self.src.url


class ProductDetail(models.Model):
    product = models.ForeignKey(Product, related_name='details', on_delete=models.CASCADE)
    attribute_name = models.CharField(max_length=100)
    attribute_value = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.attribute_name}: {self.attribute_value}'
