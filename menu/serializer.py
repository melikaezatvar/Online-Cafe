from rest_framework import serializers
from .models import Product, Image, Category, Rating
from accounts.models import CustomerProfile


class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = ['src',
                  'alt']


class CategorySerializer(serializers.ModelSerializer):
    parent = Category.objects.name

    class Meta:
        model = Category
        fields = ['name',
                  'parent',
                  'get_childes',
                  'get_products']


class ProductSerializer(serializers.ModelSerializer):

    images = ProductImageSerializer(many=True)
    category = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Category.objects.all()
    )

    class Meta:
        model = Product
        fields = ['id',
                  'name',
                  'price',
                  'category',
                  'description',
                  'quantity',
                  'images',
                  'average_rating',]

        extra_kwargs = {
            'description': {'required': False},
            'quantity': {'required': False},
            'images': {'required': False},
        }

    # def create(self, validated_data):
    #     images_data = self.context['request'].FILES.getlist('images', [])
    #     product = Product.objects.create(**validated_data)
    #     images = [Image(product=product, src=image_data) for image_data in images_data]
    #     Image.objects.bulk_create(images)
    #
    # def update(self, instance, validated_data):
    #     images_data = self.context['request'].FILES.getlist('images', [])
    #     validated_data.pop('images', None)
    #     instance.update(**validated_data)
    #     instance.images.delete()
    #     images = [Image(product=instance, src=image_data) for image_data in images_data]
    #     Image.objects.bulk_create(images)


class RatingSerializer(serializers.ModelSerializer):
    product = serializers.SlugRelatedField(
        slug_field='average_rating',
        queryset=Product.objects.all()
    )

    class Meta:
        model = Rating
        fields = ['id',
                  'product',
                  'user',
                  'rate',]
