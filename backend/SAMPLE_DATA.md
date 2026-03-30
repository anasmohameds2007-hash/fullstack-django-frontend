# Sample Data & Testing

This guide shows how to populate the database with sample data for testing.

## Method 1: Using Django Shell

```bash
# Enter Django shell
python manage.py shell
```

### Create Sample Categories

```python
from products.models import Category

categories_data = [
    {'name': 'Electronics', 'description': 'Electronic devices and gadgets'},
    {'name': 'Clothing', 'description': 'Apparel and fashion items'},
    {'name': 'Books', 'description': 'Physical and digital books'},
    {'name': 'Home & Garden', 'description': 'Household and garden products'},
    {'name': 'Sports & Outdoors', 'description': 'Sports equipment and outdoor gear'},
]

for cat_data in categories_data:
    category = Category.objects.create(**cat_data)
    print(f'Created: {category.name}')
```

### Create Sample Products

```python
from products.models import Product, Category
from django.utils.text import slugify

products_data = [
    # Electronics
    {
        'name': 'MacBook Pro 14"',
        'category_id': 1,
        'description': '14-inch MacBook Pro with M2 Pro chip',
        'price': 1999.99,
        'original_price': 2299.99,
        'stock': 10,
        'rating': 4.8,
        'reviews_count': 245
    },
    {
        'name': 'iPhone 14 Pro',
        'category_id': 1,
        'description': 'Latest iPhone with A16 Bionic chip',
        'price': 999.99,
        'original_price': 1099.99,
        'stock': 25,
        'rating': 4.7,
        'reviews_count': 1200
    },
    {
        'name': 'Sony WH-1000XM5 Headphones',
        'category_id': 1,
        'description': 'Premium noise-cancelling headphones',
        'price': 399.99,
        'original_price': 449.99,
        'stock': 50,
        'rating': 4.6,
        'reviews_count': 890
    },
    
    # Clothing
    {
        'name': 'Cotton T-Shirt',
        'category_id': 2,
        'description': '100% organic cotton comfort fit t-shirt',
        'price': 29.99,
        'original_price': 39.99,
        'stock': 100,
        'rating': 4.5,
        'reviews_count': 342
    },
    {
        'name': 'Blue Jeans',
        'category_id': 2,
        'description': 'Classic blue denim jeans, perfect fit',
        'price': 59.99,
        'original_price': 79.99,
        'stock': 75,
        'rating': 4.4,
        'reviews_count': 523
    },
    
    # Books
    {
        'name': 'Django for Beginners',
        'category_id': 3,
        'description': 'Learn Django web framework from scratch',
        'price': 39.99,
        'original_price': 49.99,
        'stock': 200,
        'rating': 4.9,
        'reviews_count': 456
    },
    {
        'name': 'Python Mastery',
        'category_id': 3,
        'description': 'Advanced Python programming techniques',
        'price': 49.99,
        'original_price': 69.99,
        'stock': 150,
        'rating': 4.8,
        'reviews_count': 678
    },
    
    # Home & Garden
    {
        'name': 'Coffee Maker',
        'category_id': 4,
        'description': 'Programmable 12-cup coffee maker',
        'price': 44.99,
        'original_price': 59.99,
        'stock': 30,
        'rating': 4.3,
        'reviews_count': 234
    },
    {
        'name': 'LED Desk Lamp',
        'category_id': 4,
        'description': 'USB-charged LED desk lamp with adjustable brightness',
        'price': 34.99,
        'original_price': 49.99,
        'stock': 40,
        'rating': 4.6,
        'reviews_count': 189
    },
    
    # Sports & Outdoors
    {
        'name': 'Running Shoes',
        'category_id': 5,
        'description': 'Professional running shoes with cushioning',
        'price': 129.99,
        'original_price': 159.99,
        'stock': 60,
        'rating': 4.7,
        'reviews_count': 567
    },
    {
        'name': 'Yoga Mat',
        'category_id': 5,
        'description': 'Non-slip yoga mat, 6mm thick',
        'price': 24.99,
        'original_price': 34.99,
        'stock': 120,
        'rating': 4.5,
        'reviews_count': 345
    },
]

for product_data in products_data:
    category_id = product_data.pop('category_id')
    product_data['slug'] = slugify(product_data['name'])
    product_data['category_id'] = category_id
    product_data['is_active'] = True
    
    product = Product.objects.create(**product_data)
    print(f'Created: {product.name}')

exit()
```

### Create Test Users

```python
from django.contrib.auth.models import User

users_data = [
    {'username': 'john_doe', 'email': 'john@example.com', 'password': 'securepass123'},
    {'username': 'jane_smith', 'email': 'jane@example.com', 'password': 'securepass456'},
    {'username': 'admin_user', 'email': 'admin@example.com', 'password': 'adminpass789', 'is_staff': True, 'is_superuser': True},
]

for user_data in users_data:
    password = user_data.pop('password')
    user = User.objects.create_user(**user_data)
    user.set_password(password)
    user.save()
    print(f'Created user: {user.username}')

exit()
```

---

## Method 2: Using Management Command (Django Fixture)

Create `products/management/commands/populate_db.py`:

```python
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, Product
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating categories...')
        
        categories = [
            Category.objects.create(name='Electronics', description='Electronic devices')
        ]
        
        self.stdout.write('Creating products...')
        
        Product.objects.create(
            name='Laptop',
            slug='laptop',
            description='High-performance laptop',
            price=999.99,
            original_price=1299.99,
            category=categories[0],
            stock=10,
            is_active=True
        )
        
        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
```

Run with:
```bash
python manage.py populate_db
```

---

## Method 3: Using CSV

Create `sample_data.csv`:

```csv
name,category,price,original_price,stock,rating
Laptop,Electronics,999.99,1299.99,10,4.8
iPhone,Electronics,899.99,999.99,15,4.7
T-Shirt,Clothing,29.99,39.99,50,4.5
Jeans,Clothing,59.99,79.99,40,4.4
Book,Books,39.99,49.99,100,4.9
```

---

## Testing API Endpoints

### 1. Test User Registration

```bash
curl -X POST http://localhost:8000/api/auth/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:8000/api/auth/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'

# Copy the 'access' token for next tests
```

### 3. Test Get Products

```bash
curl http://localhost:8000/api/products/products/
```

### 4. Test Add to Cart

```bash
curl -X POST http://localhost:8000/api/cart/cart/add_item/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 5. Test Get Cart

```bash
curl http://localhost:8000/api/cart/cart/my_cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "E-Commerce API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/users/register/",
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPass123!\",\"password2\":\"TestPass123!\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/users/login/",
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"testuser\",\"password\":\"TestPass123!\"}"
        }
      }
    },
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/products/products/"
      }
    },
    {
      "name": "Get Cart",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/cart/cart/my_cart/",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ]
      }
    },
    {
      "name": "Add to Cart",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/cart/cart/add_item/",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"product_id\":1,\"quantity\":1}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

---

## Performance Testing with Load

### Using Apache Bench

```bash
# Install Apache Bench
# macOS: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test GET endpoint
ab -n 1000 -c 10 http://localhost:8000/api/products/products/

# Results show:
# - Requests per second
# - Time per request
# - Failed requests
```

### Using Django Test Client

```python
from django.test import Client
from django.test import TestCase

class APILoadTest(TestCase):
    def setUp(self):
        self.client = Client()
    
    def test_product_list_performance(self):
        for i in range(100):
            response = self.client.get('/api/products/products/')
            self.assertEqual(response.status_code, 200)
```

---

## Database State Commands

```bash
# Show all users
python manage.py shell -c "from django.contrib.auth.models import User; print(User.objects.all())"

# Count products
python manage.py shell -c "from products.models import Product; print(f'Total products: {Product.objects.count()}')"

# List all carts
python manage.py shell -c "from cart.models import Cart; carts = Cart.objects.all(); print(f'Total carts: {len(carts)}')"

# Reset all data (WARNING: Deletes everything!)
python manage.py flush
```

---

## Cleanup

To delete all data and start fresh:

```bash
# Delete database
rm db.sqlite3

# Create new database
python manage.py migrate

# Populate with sample data
python manage.py shell < sample_data.py
```

---

## Testing Best Practices

1. **Always use a test database** - Don't test on production
2. **Create realistic data** - Use actual product names and prices
3. **Test edge cases** - Empty cart, max quantity, etc.
4. **Verify status codes** - 200 OK, 201 Created, etc.
5. **Check response format** - Correct JSON structure
6. **Test authentication** - With and without tokens
7. **Test permissions** - Admin vs. regular users
8. **Load testing** - Simulate multiple users

---

For more testing information, see:
- [README.md](README.md)
- [API_ENDPOINTS.md](API_ENDPOINTS.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
