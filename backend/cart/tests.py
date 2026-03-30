from django.test import TestCase
from django.contrib.auth.models import User
from products.models import Product, Category
from .models import Cart, CartItem


class CartModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.cart = Cart.objects.create(user=self.user)
        
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Laptop',
            slug='laptop',
            description='Test laptop',
            price=999.99,
            category=self.category,
            stock=10
        )

    def test_cart_creation(self):
        self.assertEqual(self.cart.user, self.user)

    def test_add_item_to_cart(self):
        CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=2
        )
        self.assertEqual(self.cart.get_total_items(), 2)
        self.assertEqual(self.cart.get_total_price(), 1999.98)
