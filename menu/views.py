from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import status
from rest_framework.generics import ListAPIView
from .models import Product, Category, Rating
from .serializer import ProductSerializer, CategorySerializer, RatingSerializer
from rest_framework.renderers import TemplateHTMLRenderer


class HomeAPIView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK, template_name='home.html')


class ProductAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    renderer_classes = [TemplateHTMLRenderer]

    # Show Product
    def get(self, request, *args, **kwargs):

        # Show Product By ID (pk)
        if pk := kwargs.pop('pk', None):
            products = Product.objects.filter(pk=pk)
            template = 'product/product.html'

        # Show All Products
        else:
            products = Product.objects.all()
            template = 'menu.html'

        serializer = ProductSerializer(products, many=True)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK, template_name=template)

    # Create New Product (Requires admin access)
    # def post(self, request, *args, **kwargs):
    #     serializer = ProductSerializer(data=request.data, context={'request': request})
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # # Update Product (Requires admin access)
    # def put(self, request, *args, **kwargs):
    #     product = Product.objects.filter(pk=kwargs['pk'])
    #     serializer = ProductSerializer(product, data=request.data, partial=True, context={'request': request})
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # # Delete Product (Requires admin access)
    # def delete(self, request, *args, **kwargs):
    #     Product.objects.filter(pk=kwargs['pk']).update(is_delete=False)
    #     return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)


class CategoryProductsAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryAPIView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        if name := kwargs.pop('name', None):
            category = Category.objects.filter(name=name)
            serializer = CategorySerializer(category, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK, template_name='product/category.html')
        return Response(status=status.HTTP_400_BAD_REQUEST, template_name='home.html')


class RatingAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        product = get_object_or_404(Product, id=kwargs.get('product_id'))
        user = request.user
        is_rating = Rating.objects.filter(product=product, user=user)
        if is_rating.exists():
            serializer = RatingSerializer(is_rating, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        serializer = RatingSerializer(Rating.objects.filter(product=product))
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        product = get_object_or_404(Product, id=kwargs.get('product_id'))
        user = request.user
        rate = kwargs.get('rate')
        Rating.objects.get_or_create(product=product, user=user, rate=rate)
        return Response(status=status.HTTP_201_CREATED)

