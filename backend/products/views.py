from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from django.db import models

from .models import Product, Category
from .serializers import (
    ProductSerializer, ProductListSerializer,
    ProductDetailSerializer, CategorySerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['created_at', 'price', 'rating']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        """
        Create a new product (admin only)
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update product details (admin only)
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Delete product (admin only)
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def reviews(self, request, pk=None):
        """
        Get product reviews (placeholder)
        GET /api/products/products/{id}/reviews/
        """
        product = self.get_object()
        return Response({
            'product_id': product.id,
            'reviews_count': product.reviews_count,
            'rating': product.rating,
            'message': 'Reviews feature (implement separately)'
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def search(self, request):
        """
        Search products
        GET /api/products/products/search/?q=query
        """
        query = request.query_params.get('q', '')
        products = Product.objects.filter(
            is_active=True,
            name__icontains=query
        ) | Product.objects.filter(
            is_active=True,
            description__icontains=query
        )
        serializer = ProductListSerializer(products[:20], many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_category(self, request):
        """
        Get products by category
        GET /api/products/products/by_category/?category_id=1
        """
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {'error': 'category_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        products = Product.objects.filter(
            is_active=True,
            category_id=category_id
        )
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """
        Get featured/top products
        GET /api/products/products/featured/
        """
        products = Product.objects.filter(
            is_active=True,
            rating__gte=4.0
        ).order_by('-rating')[:10]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def deals(self, request):
        """
        Get products on sale
        GET /api/products/products/deals/
        """
        products = Product.objects.filter(
            is_active=True,
            original_price__isnull=False
        ).exclude(
            price=models.F('original_price')
        )[:20]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
