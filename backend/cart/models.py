from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Cart(models.Model):
    """
    Shopping cart model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f'Cart of {self.user.username}'

    def get_total_items(self):
        """Get total number of items in cart"""
        return sum(item.quantity for item in self.items.all())

    def get_total_price(self):
        """Get total price of all items in cart"""
        return sum(item.get_item_total() for item in self.items.all())


class CartItem(models.Model):
    """
    Individual item in shopping cart
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('cart', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.quantity} x {self.product.name} in {self.cart.user.username}\'s cart'

    def get_item_total(self):
        """Get total price for this cart item"""
        return self.product.price * self.quantity
