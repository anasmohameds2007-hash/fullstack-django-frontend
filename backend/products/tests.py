from django.test import TestCase
from .models import Product, Category


class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Electronics',
            description='Electronic devices'
        )
        self.product = Product.objects.create(
            name='Laptop',
            slug='laptop',
            description='High-performance laptop',
            price=999.99,
            original_price=1299.99,
            category=self.category,
            stock=50
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, 'Laptop')
        self.assertTrue(self.product.is_in_stock)

    def test_discount_percentage(self):
        discount = self.product.discount_percentage
        self.assertGreater(discount, 0)
        self.assertLess(discount, 100)
