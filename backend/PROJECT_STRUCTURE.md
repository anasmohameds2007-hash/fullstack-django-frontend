# Complete Project Structure

```
ecommerce_ai_client/
│
├── src/                                    # React Frontend
│   ├── components/
│   ├── pages/
│   ├── App.js
│   └── ...
│
└── backend/                                # Django Backend (NEW)
    │
    ├── manage.py                           # Django management script
    ├── requirements.txt                    # Python dependencies
    ├── .env.example                        # Environment template
    ├── db.sqlite3                          # SQLite database (generated)
    │
    ├── README.md                           # Full documentation
    ├── SETUP.md                            # Quick setup guide
    ├── API_ENDPOINTS.md                    # API reference
    ├── TROUBLESHOOTING.md                  # Common issues
    ├── PROJECT_STRUCTURE.md                # This file
    │
    ├── start.sh                            # Linux/macOS startup script
    ├── start.bat                           # Windows startup script
    │
    ├── ecommerce_backend/                  # Main Django project
    │   ├── __init__.py
    │   ├── settings.py                     # Django configuration
    │   ├── urls.py                         # Main URL routing
    │   ├── wsgi.py                         # WSGI config for deployment
    │   └── asgi.py                         # ASGI config for async
    │
    ├── users/                              # Authentication App
    │   ├── __init__.py
    │   ├── apps.py                         # App configuration
    │   ├── models.py                       # User & UserProfile models
    │   ├── serializers.py                  # User serializers
    │   ├── views.py                        # User viewsets (register, login, etc.)
    │   ├── urls.py                         # User routes
    │   ├── admin.py                        # Admin configuration
    │   ├── migrations/                     # Database migrations
    │   │   ├── 0001_initial.py
    │   │   └── __init__.py
    │   └── tests.py
    │
    ├── products/                           # Product Management App
    │   ├── __init__.py
    │   ├── apps.py                         # App configuration
    │   ├── models.py                       # Product & Category models
    │   ├── serializers.py                  # Product serializers
    │   ├── views.py                        # Product viewsets
    │   ├── urls.py                         # Product routes
    │   ├── admin.py                        # Admin configuration
    │   ├── migrations/                     # Database migrations
    │   │   ├── 0001_initial.py
    │   │   └── __init__.py
    │   └── tests.py
    │
    ├── cart/                               # Shopping Cart App
    │   ├── __init__.py
    │   ├── apps.py                         # App configuration
    │   ├── models.py                       # Cart & CartItem models
    │   ├── serializers.py                  # Cart serializers
    │   ├── views.py                        # Cart viewsets
    │   ├── urls.py                         # Cart routes
    │   ├── admin.py                        # Admin configuration
    │   ├── migrations/                     # Database migrations
    │   │   ├── 0001_initial.py
    │   │   └── __init__.py
    │   └── tests.py
    │
    └── media/                              # User uploaded files
        └── products/                       # Product images

    └── staticfiles/                        # Collected static files (production)
```

---

## File Descriptions

### Root Files

| File | Purpose |
|------|---------|
| `manage.py` | Django management command runner |
| `requirements.txt` | Python package dependencies |
| `.env.example` | Template for environment variables |
| `start.sh` / `start.bat` | Quick startup scripts |
| `README.md` | Complete documentation |
| `SETUP.md` | Quick setup guide |
| `API_ENDPOINTS.md` | API reference |
| `TROUBLESHOOTING.md` | Common issues & solutions |

### Main Project (ecommerce_backend/)

| File | Purpose |
|------|---------|
| `settings.py` | Django configuration, installed apps, middleware |
| `urls.py` | Main URL routing to app endpoints |
| `wsgi.py` | WSGI for production deployment |
| `asgi.py` | ASGI for async/WebSocket support |

### Users App

| File | Purpose |
|------|---------|
| `models.py` | User & UserProfile database schema |
| `serializers.py` | User data validation & serialization |
| `views.py` | Register, login, password change endpoints |
| `urls.py` | User route definitions |
| `admin.py` | Admin panel configuration |
| `apps.py` | App metadata |

**Key Models:**
- `User` (Django built-in) - Username, email, password
- `UserProfile` - Extended user info (phone, address, etc.)

---

### Products App

| File | Purpose |
|------|---------|
| `models.py` | Product & Category models with relationships |
| `serializers.py` | Product data serialization |
| `views.py` | CRUD operations, search, filtering |
| `urls.py` | Product route definitions |
| `admin.py` | Admin panel for managing products |
| `apps.py` | App metadata |

**Key Models:**
- `Category` - Product categories
- `Product` - Product details (name, price, stock, etc.)

**Key Endpoints:**
- List/Create products
- Retrieve/Update/Delete products
- Search products
- Filter by category
- Featured products
- Sale products

---

### Cart App

| File | Purpose |
|------|---------|
| `models.py` | Cart & CartItem models |
| `serializers.py` | Cart data serialization |
| `views.py` | Add/remove/update cart items |
| `urls.py` | Cart route definitions |
| `admin.py` | Admin panel for cart management |
| `apps.py` | App metadata |

**Key Models:**
- `Cart` - One per user
- `CartItem` - Individual items in cart

**Key Endpoints:**
- Get cart
- Add item
- Remove item
- Update quantity
- Clear cart
- Cart summary

---

## Database Schema

```
┌─────────────────┐
│   User          │
│─────────────────│
│ id (PK)         │
│ username        │
│ email           │
│ password        │
│ first_name      │
│ last_name       │
└────────┬────────┘
         │ OneToOne
         │
┌────────▼────────────────┐
│   UserProfile           │
│────────────────────────│
│ id (PK)                │
│ user (FK ← User)       │
│ phone                  │
│ address                │
│ city                   │
│ country                │
│ zip_code               │
└──────────────────────────┘


         │
         │ OneToOne
         │
┌────────▼──────────────────┐
│   Cart                     │
│──────────────────────────│
│ id (PK)                  │
│ user (FK ← User)         │
│ created_at               │
│ updated_at               │
└────────┬──────────────────┘
         │ OneToMany
         │
┌────────▼──────────────┐      ┌───────────────┐
│   CartItem            │      │   Product     │
│──────────────────────│      │───────────────│
│ id (PK)              │──FK──→| id (PK)       │
│ cart (FK ← Cart)     │      │ name          │
│ product (FK ┘        │      │ price         │
│ quantity             │      │ stock         │
│ created_at           │      │ image         │
│ updated_at           │      │ category (FK) │
└──────────────────────┘      └───────┬───────┘
                                      │ ManyToOne
                            ┌─────────▼─────────┐
                            │   Category        │
                            │───────────────────│
                            │ id (PK)           │
                            │ name              │
                            │ description       │
                            └───────────────────┘
```

---

## API Route Structure

```
/api/
├── auth/
│   └── users/
│       ├── register/         POST
│       ├── login/            POST
│       ├── me/               GET
│       ├── change_password/  POST
│       └── logout/           POST
│
├── products/
│   ├── products/             GET, POST (admin)
│   │   ├── {id}/             GET, PUT, DELETE
│   │   ├── search/           GET
│   │   ├── featured/         GET
│   │   ├── by_category/      GET
│   │   ├── deals/            GET
│   │   └── {id}/reviews/     GET
│   │
│   └── categories/           GET, POST (admin)
│       └── {id}/             GET, PUT, DELETE
│
└── cart/
    └── cart/
        ├── my_cart/          GET
        ├── add_item/         POST
        ├── remove_item/      POST
        ├── update_quantity/  POST
        ├── clear_cart/       POST
        └── cart_summary/     GET
```

---

## Models Relationships Diagram

```
User (1) ←──→ (1) UserProfile
 │
 └─────→ (1) Cart (1) ←──→ (many) CartItem
                                    │
                                    └──→ (many) Product (many) ←──→ (1) Category
```

---

## Migration Flow

```
First-time setup:
1. python manage.py makemigrations
2. python manage.py migrate

After model changes:
1. python manage.py makemigrations app_name
2. python manage.py migrate
```

---

## Key Features by File

### Authentication (users/views.py)
- ✅ Register with validation
- ✅ Login with JWT tokens
- ✅ Get current user
- ✅ Change password
- ✅ Logout endpoint

### Products (products/views.py)
- ✅ List all products (paginated)
- ✅ Get product details
- ✅ Create product (admin)
- ✅ Update product (admin)
- ✅ Delete product (admin)
- ✅ Search products
- ✅ Filter by category
- ✅ Featured products
- ✅ Sale/Deals products

### Cart (cart/views.py)
- ✅ Get user cart
- ✅ Add item to cart
- ✅ Remove item from cart
- ✅ Update item quantity
- ✅ Clear entire cart
- ✅ Cart summary

---

## Configuration Files

### .env
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
JWT_EXPIRATION_HOURS=24
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### settings.py
- Installed apps configuration
- Middleware setup
- Database configuration
- JWT settings
- CORS settings
- REST Framework settings
- Static/Media files

---

## Development Workflow

```
1. Create feature branch
2. Make changes to models/views/serializers
3. Create migrations (makemigrations)
4. Apply migrations (migrate)
5. Test endpoints with API client
6. Commit changes
7. Push to repository
```

---

## Deployment Structure

For production, the structure may include:

```
backend/
├── nginx/              # Web server config
├── docker/             # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── logs/               # Application logs
├── backups/            # Database backups
└── env.production      # Production environment
```

---

## Environment Variables

| Variable | Default | Production |
|----------|---------|------------|
| DEBUG | True | False |
| SECRET_KEY | dev-key | Strong random string |
| ALLOWED_HOSTS | localhost | Domain name |
| DB_ENGINE | sqlite3 | PostgreSQL |
| DB_NAME | db.sqlite3 | Production DB |
| JWT_EXPIRATION_HOURS | 24 | 24 |
| CORS_ALLOWED_ORIGINS | localhost:3000 | Frontend domain |

---

## Performance Optimizations

1. **Database Indexing**
   ```python
   class Meta:
       indexes = [models.Index(fields=['slug'])]
   ```

2. **Query Optimization**
   ```python
   select_related('category')      # Foreign Key
   prefetch_related('reviews')    # Reverse relations
   ```

3. **Pagination**
   ```
   Default: 10 items per page
   Customizable via ?page_size=20
   ```

4. **Caching**
   - Add Django cache framework
   - Cache frequently accessed data

5. **Database**
   - Use PostgreSQL for production
   - Set up proper indexes
   - Enable connection pooling

---

## Security Layers

1. **Authentication** - JWT tokens
2. **Authorization** - Permission classes
3. **Validation** - Serializers
4. **CORS** - Whitelist frontend domains
5. **SQL Injection** - ORM protection
6. **CSRF** - CSRF middleware
7. **Password** - Django hashing
8. **HTTPS** - SSL in production

---

For more details, see individual documentation files:
- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Quick start
- [API_ENDPOINTS.md](API_ENDPOINTS.md) - API reference
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
