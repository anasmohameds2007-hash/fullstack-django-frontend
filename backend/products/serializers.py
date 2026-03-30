from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'original_price',
            'category', 'category_name', 'stock', 'is_in_stock', 'rating',
            'reviews_count', 'image', 'is_active', 'discount_percentage',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'slug']

    def get_discount_percentage(self, obj):
        return obj.discount_percentage


class ProductListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for list views
    """
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'original_price', 'category_name', 'image', 'rating', 'is_in_stock']


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for detail views
    """
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
