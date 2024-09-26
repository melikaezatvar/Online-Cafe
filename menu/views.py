from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from .models import Product, Category
from .serializer import ProductSerializer, CategorySerializer
from rest_framework.renderers import TemplateHTMLRenderer


class HomeAPIView(APIView):
    renderer_classes = [TemplateHTMLRenderer]

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK, template_name='home.html')


class ProductAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    # Show Product
    def get(self, request, *args, **kwargs):
        # Show Product By ID (pk)
        if pk := kwargs.pop('pk', None):
            products = Product.objects.filter(pk=pk)

        # Show Products By Category
        elif name := kwargs.pop('name', None):
            products = Category.objects.get(name=name).get_products()

        # Show All Products
        else:
            products = Product.objects.all()

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create New Product (Requires admin access)
    def post(self, request, *args, **kwargs):
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update Product (Requires admin access)
    def put(self, request, *args, **kwargs):
        product = Product.objects.filter(pk=kwargs['pk'])
        serializer = ProductSerializer(product, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete Product (Requires admin access)
    def delete(self, request, *args, **kwargs):
        Product.objects.filter(pk=kwargs['pk']).update(is_delete=False)
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)


class CategoryAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

