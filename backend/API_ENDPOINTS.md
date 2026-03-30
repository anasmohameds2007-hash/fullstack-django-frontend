# API Endpoints Quick Reference

## Base URL
```
http://localhost:8000/api
```

---

## Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/users/register/` | No | Register new user |
| POST | `/auth/users/login/` | No | Login, get JWT tokens |
| GET | `/auth/users/me/` | Yes | Get current user profile |
| POST | `/auth/users/change_password/` | Yes | Change user password |
| POST | `/auth/users/logout/` | Yes | Logout user |

---

## Products Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products/products/` | No | Get all products (paginated) |
| GET | `/products/products/{id}/` | No | Get single product |
| POST | `/products/products/` | Yes* | Create product (admin only) |
| PUT | `/products/products/{id}/` | Yes* | Update product (admin only) |
| DELETE | `/products/products/{id}/` | Yes* | Delete product (admin only) |
| GET | `/products/products/search/?q=query` | No | Search products |
| GET | `/products/products/featured/` | No | Get featured products |
| GET | `/products/products/by_category/?category_id=1` | No | Get products by category |
| GET | `/products/products/deals/` | No | Get products on sale |
| GET | `/products/categories/` | No | Get all categories |
| POST | `/products/categories/` | Yes* | Create category (admin only) |

*Yes = Requires authentication and admin privilege

---

## Cart Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart/cart/my_cart/` | Yes | Get user's cart |
| POST | `/cart/cart/add_item/` | Yes | Add item to cart |
| POST | `/cart/cart/remove_item/` | Yes | Remove item from cart |
| POST | `/cart/cart/update_quantity/` | Yes | Update item quantity |
| POST | `/cart/cart/clear_cart/` | Yes | Clear entire cart |
| GET | `/cart/cart/cart_summary/` | Yes | Get cart summary |

---

## Request Examples

### Register
```bash
POST /auth/users/register/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password2": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Login
```bash
POST /auth/users/login/
{
  "username": "john_doe",
  "password": "SecurePass123"
}

Response: { access, refresh, user, message }
```

### Get Products
```bash
GET /products/products/
GET /products/products/?search=laptop
GET /products/products/?ordering=-price
GET /products/products/?page=1
```

### Add to Cart
```bash
POST /cart/cart/add_item/
Authorization: Bearer <access_token>
{
  "product_id": 1,
  "quantity": 2
}
```

### Update Quantity
```bash
POST /cart/cart/update_quantity/
Authorization: Bearer <access_token>
{
  "product_id": 1,
  "quantity": 5
}
```

### Remove from Cart
```bash
POST /cart/cart/remove_item/
Authorization: Bearer <access_token>
{
  "product_id": 1
}
```

---

## Query Parameters

### Pagination
```
?page=1              # Page number for paginated results
&page_size=20        # Items per page (default: 10)
```

### Search & Filtering
```
?search=laptop       # Search products by name/description
?category_id=1       # Filter by category ID
```

### Ordering
```
?ordering=price           # Order by price (ascending)
?ordering=-price          # Order by price (descending)
?ordering=-created_at     # Recently added
?ordering=rating          # Order by rating
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Authentication

### Using Tokens in Requests

**Header Method (Recommended):**
```
Authorization: Bearer <access_token>
```

**Example with curl:**
```bash
curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
     http://localhost:8000/api/auth/users/me/
```

**Example with JavaScript:**
```javascript
const token = localStorage.getItem('accessToken');
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

fetch('/api/auth/users/me/', { headers })
    .then(r => r.json())
    .then(data => console.log(data));
```

---

## Pagination Response Format

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/products/products/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Error Response Format

```json
{
  "error": "Error message",
  "details": {
    "field_name": ["Error details"]
  }
}
```

---

## Common Request Headers

```
Content-Type: application/json
Authorization: Bearer <token>
```

For file uploads (images):
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

---

## Frontend Integration Template

### React Example

```javascript
const API_URL = 'http://localhost:8000/api';

// Get Products
export const getProducts = async () => {
    const res = await fetch(`${API_URL}/products/products/`);
    return res.json();
};

// Login
export const login = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    localStorage.setItem('access', data.access);
    return data;
};

// Add to Cart
export const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem('access');
    const res = await fetch(`${API_URL}/cart/cart/add_item/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity })
    });
    return res.json();
};

// Get Cart
export const getCart = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch(`${API_URL}/cart/cart/my_cart/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
};
```

---

## Rate Limiting

Currently no rate limiting. For production, add:
```python
# In settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

---

## Production Checklist

- [ ] Change SECRET_KEY in .env
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_HOSTS
- [ ] Configure HTTPS/SSL
- [ ] Set up database (PostgreSQL)
- [ ] Add rate limiting
- [ ] Enable CSRF protection
- [ ] Update CORS_ALLOWED_ORIGINS with frontend domain
- [ ] Add logging
- [ ] Set up monitoring/alerting
- [ ] Add API versioning
- [ ] Document API changes

---

For more details, see [README.md](README.md) and [SETUP.md](SETUP.md)
