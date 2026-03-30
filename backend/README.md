# Django REST Framework E-Commerce Backend

A production-ready e-commerce backend built with Django REST Framework, featuring JWT authentication, product management, and shopping cart functionality.

## Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **User Management** - Registration, login, password reset  
✅ **Product Management** - Full CRUD operations with categories  
✅ **Shopping Cart** - Add, remove, update items  
✅ **Admin Panel** - Django admin for managing products and users  
✅ **CORS Support** - Ready for frontend integration  
✅ **Pagination** - Built-in pagination for list endpoints  
✅ **Search & Filtering** - Advanced product search  

## Project Structure

```
backend/
├── manage.py                          # Django management script
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment variables template
├── ecommerce_backend/                 # Main project settings
│   ├── __init__.py
│   ├── settings.py                    # Django configuration
│   ├── urls.py                        # Main URL routing
│   ├── asgi.py
│   └── wsgi.py
├── users/                             # Authentication app
│   ├── models.py                      # User models
│   ├── serializers.py                 # User serializers
│   ├── views.py                       # User views
│   ├── urls.py                        # User routes
│   ├── admin.py
│   ├── apps.py
│   └── __init__.py
├── products/                          # Product management app
│   ├── models.py                      # Product & Category models
│   ├── serializers.py                 # Product serializers
│   ├── views.py                       # Product views
│   ├── urls.py                        # Product routes
│   ├── admin.py
│   ├── apps.py
│   └── __init__.py
└── cart/                              # Shopping cart app
    ├── models.py                      # Cart models
    ├── serializers.py                 # Cart serializers
    ├── views.py                       # Cart views
    ├── urls.py                        # Cart routes
    ├── admin.py
    ├── apps.py
    └── __init__.py
```

## Installation

### 1. Clone and Setup

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your settings (important: change SECRET_KEY in production)
```

### 4. Database Setup

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`  
Admin panel at `http://localhost:8000/admin`

## Dependencies

- **Django 4.2.0** - Web framework
- **djangorestframework 3.14.0** - REST API framework
- **djangorestframework-simplejwt 5.3.2** - JWT authentication
- **django-cors-headers 4.3.1** - CORS support
- **python-decouple 3.8** - Environment variables
- **Pillow 10.0.0** - Image processing
- **python-dotenv 1.0.0** - .env file support

---

## API Endpoints

All endpoints require `Content-Type: application/json` header.

### Authentication Endpoints

#### Register User
```
POST /api/auth/users/register/

Request:
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123",
    "password2": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
}

Response (201):
{
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile": {...}
    },
    "message": "User registered successfully"
}
```

#### Login User
```
POST /api/auth/users/login/

Request:
{
    "username": "john_doe",
    "password": "securepass123"
}

Response (200):
{
    "user": {...},
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "message": "Login successful"
}
```

#### Get Current User
```
GET /api/auth/users/me/
Authorization: Bearer {access_token}

Response (200):
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile": {
        "id": 1,
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "New York",
        "country": "USA",
        "zip_code": "10001"
    }
}
```

#### Change Password
```
POST /api/auth/users/change_password/
Authorization: Bearer {access_token}

Request:
{
    "old_password": "securepass123",
    "new_password": "newsecurepass456",
    "new_password2": "newsecurepass456"
}

Response (200):
{
    "message": "Password changed successfully"
}
```

#### Logout
```
POST /api/auth/users/logout/
Authorization: Bearer {access_token}

Response (200):
{
    "message": "Logout successful. Please delete the token on client side."
}
```

---

### Product Endpoints

#### Get All Products
```
GET /api/products/products/
GET /api/products/products/?search=laptop&ordering=-price&page=1

Response (200):
{
    "count": 100,
    "next": "http://localhost:8000/api/products/products/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Laptop",
            "slug": "laptop",
            "price": "999.99",
            "original_price": "1299.99",
            "category_name": "Electronics",
            "image": "http://localhost:8000/media/products/laptop.jpg",
            "rating": 4.5,
            "is_in_stock": true
        },
        ...
    ]
}
```

#### Get Product Details
```
GET /api/products/products/{id}/

Response (200):
{
    "id": 1,
    "name": "Laptop",
    "slug": "laptop",
    "description": "High-performance laptop...",
    "price": "999.99",
    "original_price": "1299.99",
    "category": {
        "id": 1,
        "name": "Electronics",
        "description": "Electronic devices"
    },
    "stock": 50,
    "is_in_stock": true,
    "rating": 4.5,
    "reviews_count": 125,
    "image": "http://localhost:8000/media/products/laptop.jpg",
    "is_active": true,
    "discount_percentage": 23.08,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Search Products
```
GET /api/products/products/search/?q=laptop

Response (200):
[
    {
        "id": 1,
        "name": "Laptop Dell XPS",
        "slug": "laptop-dell-xps",
        "price": "999.99",
        ...
    },
    ...
]
```

#### Get Products by Category
```
GET /api/products/products/by_category/?category_id=1

Response (200):
[...]
```

#### Get Featured Products
```
GET /api/products/products/featured/

Response (200):
[...]
```

#### Get Deals/Sale Products
```
GET /api/products/products/deals/

Response (200):
[...]
```

#### Create Product (Admin Only)
```
POST /api/products/products/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

FormData:
- name: "New Product"
- slug: "new-product"
- description: "Product description"
- price: 99.99
- original_price: 129.99
- category: 1
- stock: 100
- image: (file)

Response (201):
{...product data...}
```

#### Update Product (Admin Only)
```
PUT /api/products/products/{id}/
PATCH /api/products/products/{id}/
Authorization: Bearer {access_token}
```

#### Delete Product (Admin Only)
```
DELETE /api/products/products/{id}/
Authorization: Bearer {access_token}

Response (204): No Content
```

#### Get Categories
```
GET /api/products/categories/

Response (200):
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Electronics",
            "description": "Electronic devices"
        },
        ...
    ]
}
```

---

### Cart Endpoints

#### Get User's Cart
```
GET /api/cart/cart/my_cart/
Authorization: Bearer {access_token}

Response (200):
{
    "id": 1,
    "user": 1,
    "items": [
        {
            "id": 1,
            "product": {
                "id": 1,
                "name": "Laptop",
                "slug": "laptop",
                "price": "999.99",
                "image": "..."
            },
            "quantity": 2,
            "item_total": 1999.98
        }
    ],
    "total_items": 2,
    "total_price": 1999.98,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
}
```

#### Add Item to Cart
```
POST /api/cart/cart/add_item/
Authorization: Bearer {access_token}

Request:
{
    "product_id": 1,
    "quantity": 2
}

Response (201):
{
    "message": "Item added to cart",
    "cart": {...cart data...}
}
```

#### Remove Item from Cart
```
POST /api/cart/cart/remove_item/
Authorization: Bearer {access_token}

Request:
{
    "product_id": 1
}

Response (200):
{
    "message": "Item removed from cart",
    "cart": {...cart data...}
}
```

#### Update Item Quantity
```
POST /api/cart/cart/update_quantity/
Authorization: Bearer {access_token}

Request:
{
    "product_id": 1,
    "quantity": 5
}

Response (200):
{
    "message": "Quantity updated",
    "cart": {...cart data...}
}
```

#### Clear Cart
```
POST /api/cart/cart/clear_cart/
Authorization: Bearer {access_token}

Response (200):
{
    "message": "Cart cleared",
    "cart": {...cart data...}
}
```

#### Get Cart Summary
```
GET /api/cart/cart/cart_summary/
Authorization: Bearer {access_token}

Response (200):
{
    "total_items": 2,
    "total_price": 1999.98,
    "items_count": 1
}
```

---

## Authentication

### JWT Tokens

The API uses JWT (JSON Web Tokens) for authentication. After login, you receive two tokens:

- **Access Token**: Used for API requests (expires in 24 hours)
- **Refresh Token**: Used to get a new access token (expires in 7 days)

### Using Tokens

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Example with curl:
```bash
curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
     http://localhost:8000/api/auth/users/me/
```

Example with JavaScript:
```javascript
const response = await fetch('http://localhost:8000/api/auth/users/me/', {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
});
```

### Refresh Token

To get a new access token using the refresh token:

```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
     -H "Content-Type: application/json" \
     -d '{"refresh": "<refresh_token>"}'
```

---

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid data provided",
    "details": {
        "field_name": ["Error message"]
    }
}
```

### 401 Unauthorized
```json
{
    "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 500 Server Error
```json
{
    "detail": "Internal server error"
}
```

---

## Admin Panel

Access the Django admin at: `http://localhost:8000/admin`

Login with the superuser credentials you created during setup.

### Admin Features

- Manage users and profiles
- Create/edit/delete products and categories
- View and manage shopping carts
- View order history

---

## Security Considerations

For production deployment:

1. **Change SECRET_KEY** in `.env`
2. **Set DEBUG=False** in `.env`
3. **Update ALLOWED_HOSTS** with your domain
4. **Use environment variables** for sensitive data
5. **Enable HTTPS** (whitelist HTTPS URLs in CORS)
6. **Set strong password validators**
7. **Use a production database** (PostgreSQL recommended)
8. **Configure proper CORS headers**
9. **Add rate limiting** for API endpoints
10. **Enable CSRF protection**

---

## Frontend Integration

Example React integration:

```javascript
// API Configuration
const API_URL = 'http://localhost:8000/api';

// Login
const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    return data;
};

// Get Products
const getProducts = async () => {
    const response = await fetch(`${API_URL}/products/products/`);
    return response.json();
};

// Add to Cart
const addToCart = async (productId, quantity) => {
    const response = await fetch(`${API_URL}/cart/cart/add_item/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity })
    });
    return response.json();
};
```

---

## Database Schema

### Models Relationships

```
User (Django default)
    └─ UserProfile (OneToOne)
    └─ Cart (OneToOne)
        └─ CartItem (ForeignKey)
            └─ Product (ForeignKey)
                └─ Category (ForeignKey)
```

---

## Testing

To test the API, you can use:

- **cURL**: `curl http://localhost:8000/api/products/products/`
- **Postman**: Import endpoints from documentation
- **Python requests**: See examples below

```python
import requests

# Get products
response = requests.get('http://localhost:8000/api/products/products/')
print(response.json())

# Login
response = requests.post(
    'http://localhost:8000/api/auth/users/login/',
    json={'username': 'john_doe', 'password': 'securepass123'}
)
token = response.json()['access']

# Get cart with authentication
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/cart/cart/my_cart/', headers=headers)
print(response.json())
```

---

## Troubleshooting

### Port Already in Use
```bash
python manage.py runserver 8001  # Use different port
```

### Database Locked Error
```bash
# Delete and recreate database
rm db.sqlite3
python manage.py migrate
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Issues
Check `.env` CORS_ALLOWED_ORIGINS matches your frontend URL

---

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues, questions, or suggestions, please open an issue on the repository.

**Happy Coding! 🚀**
