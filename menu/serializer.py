from rest_framework.serializers import ModelSerializer
from .models import Product, Image


class ProductImageSerializer(ModelSerializer):

    class Meta:
        model = Image
        fields = ['src']


class ProductSerializer(ModelSerializer):

    images = ProductImageSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id',
                  'name',
                  'price',
                  'category',
                  'description',
                  'quantity',
                  'images']

        extra_kwargs = {
            'description': {'required': False},
            'quantity': {'required': False},
            'images': {'required': False},
        }

    def create(self, validated_data):
        images_data = self.context['request'].FILES.getlist('images', [])
        product = Product.objects.create(**validated_data)
        images = [Image(product=product, src=image_data) for image_data in images_data]
        Image.objects.bulk_create(images)

    def update(self, instance, validated_data):
        images_data = self.context['request'].FILES.getlist('images', [])
        validated_data.pop('images')
        instance.update(**validated_data)
        images = [Image(product=instance, src=image_data) for image_data in images_data]
        Image.objects.bulk_create(images)
