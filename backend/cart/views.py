from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from products.models import Product
from .models import Cart, CartItem
from .serializers import (
    CartSerializer, CartItemSerializer,
    AddToCartSerializer, UpdateCartItemSerializer
)


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        """Get or create cart for user"""
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """
        Get current user's cart
        GET /api/cart/cart/my_cart/
        """
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """
        Add item to cart
        POST /api/cart/cart/add_item/
        {
            "product_id": 1,
            "quantity": 1
        }
        """
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = self.get_cart(request.user)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
        quantity = serializer.validated_data['quantity']

        if quantity > product.stock:
            return Response(
                {'error': f'Only {product.stock} items available'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            if cart_item.quantity > product.stock:
                return Response(
                    {'error': f'Only {product.stock} items available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.save()

        cart.save()
        return Response(
            {
                'message': 'Item added to cart',
                'cart': CartSerializer(cart).data
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """
        Remove item from cart
        POST /api/cart/cart/remove_item/
        {
            "product_id": 1
        }
        """
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart = self.get_cart(request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        cart_item.delete()

        return Response(
            {
                'message': 'Item removed from cart',
                'cart': CartSerializer(cart).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        """
        Update item quantity in cart
        POST /api/cart/cart/update_quantity/
        {
            "product_id": 1,
            "quantity": 5
        }
        """
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = self.get_cart(request.user)
        product = get_object_or_404(Product, id=product_id)
        cart_item = get_object_or_404(CartItem, cart=cart, product=product)

        quantity = serializer.validated_data['quantity']

        if quantity > product.stock:
            return Response(
                {'error': f'Only {product.stock} items available'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        return Response(
            {
                'message': 'Quantity updated',
                'cart': CartSerializer(cart).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        """
        Clear entire cart
        POST /api/cart/cart/clear_cart/
        """
        cart = self.get_cart(request.user)
        cart.items.all().delete()

        return Response(
            {
                'message': 'Cart cleared',
                'cart': CartSerializer(cart).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def cart_summary(self, request):
        """
        Get cart summary
        GET /api/cart/cart/cart_summary/
        """
        cart = self.get_cart(request.user)
        return Response({
            'total_items': cart.get_total_items(),
            'total_price': float(cart.get_total_price()),
            'items_count': cart.items.count()
        })
