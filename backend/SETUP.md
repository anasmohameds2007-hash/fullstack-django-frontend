# Quick Setup Guide

This guide will help you get the Django backend running in 5 minutes.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Step 1: Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 3: Configure Environment

```bash
# Copy the example .env file
cp .env.example .env

# Edit .env (optional - defaults work for local development)
# Important: Change SECRET_KEY before production deployment
```

## Step 4: Setup Database

```bash
# Create database schema
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Follow prompts to create username, email, and password
```

## Step 5: Run Server

```bash
python manage.py runserver
```

Your API is now running at: `http://localhost:8000`

---

## Quick Test

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/auth/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

Save the `access` token from response.

### 3. Get Products

```bash
curl http://localhost:8000/api/products/products/
```

### 4. Add to Cart (using token from step 2)

```bash
curl -X POST http://localhost:8000/api/cart/cart/add_item/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

---

## Admin Panel

1. Go to: `http://localhost:8000/admin`
2. Login with superuser credentials (created in Step 4)
3. Add products and categories from here

---

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [API_ENDPOINTS.md](API_ENDPOINTS.md) for detailed endpoint reference
- Review code in `users/`, `products/`, `cart/` apps
- Integrate with your React frontend

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `pip install -r requirements.txt` |
| `Port 8000 in use` | Run `python manage.py runserver 8001` |
| `Database error` | Run `python manage.py migrate` |
| `Permission denied` | Activate virtual environment |

---

## Useful Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Add data via shell
python manage.py shell

# Collect static files
python manage.py collectstatic

# Run tests (when added)
python manage.py test
```

---

## Environment Variables

Key variables in `.env`:

```
DEBUG=True                    # Set to False in production
SECRET_KEY=...               # Keep secret, change in production
ALLOWED_HOSTS=localhost,...  # Add your domain in production
CORS_ALLOWED_ORIGINS=...     # Add frontend URL
JWT_EXPIRATION_HOURS=24      # Token expiration time
```

---

For detailed API documentation, see [README.md](README.md)

**You're all set! 🎉**
