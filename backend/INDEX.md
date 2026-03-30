# Django REST Framework E-Commerce Backend
## Complete Documentation Index

Welcome to the Django E-Commerce Backend! This is a production-ready backend built with Django REST Framework, featuring JWT authentication, product management, and shopping cart functionality.

---

## 📚 Documentation Files

### Quick Start (Start Here!)

1. **[SETUP.md](SETUP.md)** ⭐ **→ Start here for 5-minute setup**
   - Virtual environment setup
   - Install dependencies
   - Database configuration
   - Quick test commands
   - Troubleshooting quick fixes

### Main Documentation

2. **[README.md](README.md)** - Complete Project Guide
   - Full features list
   - Project structure overview
   - Installation instructions
   - Database schema
   - Development workflow
   - Frontend integration examples

3. **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - API Reference
   - All endpoints listed in table format
   - Request/response examples
   - Query parameters
   - Status codes
   - Frontend integration code samples

### Guides & References

4. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture Deep Dive
   - Complete folder structure
   - File descriptions
   - Database schema diagrams
   - Models relationships
   - API route structure
   - Performance optimizations
   - Security layers

5. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production Deployment
   - Pre-deployment checklist
   - Heroku setup
   - AWS EC2 deployment
   - Docker deployment
   - PythonAnywhere setup
   - Monitoring & scaling
   - Disaster recovery

6. **[SAMPLE_DATA.md](SAMPLE_DATA.md)** - Testing & Sample Data
   - Populate database with sample data
   - Create test users
   - API endpoint testing
   - Postman collection
   - Performance testing
   - Database state commands

7. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common Issues
   - 15+ common problems & solutions
   - Debug mode setup
   - Performance optimization
   - Security checklist
   - Useful commands
   - Getting help resources

---

## 🚀 Quick Start (3 Steps)

### Step 1: Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Database
```bash
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
```

### Step 3: Run
```bash
python manage.py runserver
# Visit http://localhost:8000/api
# Admin: http://localhost:8000/admin
```

---

## 📁 Project Structure Overview

```
backend/
├── ecommerce_backend/          Main Django project
├── users/                       Authentication app
├── products/                    Product management app
├── cart/                        Shopping cart app
├── requirements.txt             Dependencies
├── manage.py                    Django CLI
├── README.md                    Full documentation ← Read this
├── SETUP.md                     Quick setup
├── API_ENDPOINTS.md             API reference
├── DEPLOYMENT.md                Production guide
├── TROUBLESHOOTING.md           Common issues
└── SAMPLE_DATA.md               Testing guide
```

---

## 🔑 Key Features

### Authentication
- ✅ User registration with validation
- ✅ JWT token-based login
- ✅ Password change endpoint
- ✅ Protected routes with authentication
- ✅ User profile management

### Products
- ✅ Full CRUD operations
- ✅ Product categories
- ✅ Advanced search & filtering
- ✅ Price discounts
- ✅ Ratings & reviews placeholder

### Shopping Cart
- ✅ Add items to cart
- ✅ Remove items
- ✅ Update quantities
- ✅ Cart totals calculation
- ✅ Stock validation

### Admin Panel
- ✅ Django admin interface
- ✅ Manage users & products
- ✅ View carts
- ✅ Inline editing

---

## 🛠 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Django | 4.2.0 |
| REST API | Django REST Framework | 3.14.0 |
| Authentication | SimpleJWT | 5.3.2 |
| CORS | django-cors-headers | 4.3.1 |
| Database | SQLite (SQLite)/PostgreSQL | - |
| Image Handling | Pillow | 10.0.0 |

---

## 📖 How to Use This Documentation

### I'm a Beginner
1. Start with [SETUP.md](SETUP.md) for quick start
2. Read [README.md](README.md) for full understanding
3. Use [API_ENDPOINTS.md](API_ENDPOINTS.md) as reference

### I Need to Deploy
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Choose deployment option (Heroku/AWS/Docker)
3. Follow step-by-step instructions

### I'm Having Issues
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Search for your error
3. Follow solution steps

### I Need to Test
1. Read [SAMPLE_DATA.md](SAMPLE_DATA.md)
2. Populate database
3. Test endpoints with provided examples

### I Need Architecture Details
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
2. Review database schema
3. Understand app relationships

---

## 🔗 API Endpoints Quick Reference

### Authentication
- `POST /api/auth/users/register/` - Register user
- `POST /api/auth/users/login/` - Login (get JWT)
- `GET /api/auth/users/me/` - Get profile
- `POST /api/auth/users/change_password/` - Change password

### Products
- `GET /api/products/products/` - List products
- `POST /api/products/products/` - Create (admin)
- `GET /api/products/products/{id}/` - Get product
- `PUT /api/products/products/{id}/` - Update (admin)
- `DELETE /api/products/products/{id}/` - Delete (admin)
- `GET /api/products/products/search/?q=query` - Search
- `GET /api/products/categories/` - List categories

### Cart
- `GET /api/cart/cart/my_cart/` - Get cart
- `POST /api/cart/cart/add_item/` - Add item
- `POST /api/cart/cart/remove_item/` - Remove item
- `POST /api/cart/cart/update_quantity/` - Update quantity
- `POST /api/cart/cart/clear_cart/` - Clear cart

Full reference: [API_ENDPOINTS.md](API_ENDPOINTS.md)

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Password hashing (Django built-in)
- ✅ CSRF protection
- ✅ CORS whitelist
- ✅ Permission classes (IsAuthenticated, IsAdminUser)
- ✅ Input validation via serializers
- ✅ SQL injection protection (ORM)
- ✅ XSS protection
- ✅ Secure headers

See [DEPLOYMENT.md](DEPLOYMENT.md) for production security setup.

---

## 📊 Database Models

### User Relationships
```
User (Django built-in)
  ├─ UserProfile (OneToOne)
  ├─ Cart (OneToOne)
  │   └─ CartItem (OneToMany)
  │       └─ Product (ForeignKey)
  │           └─ Category (ForeignKey)
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for complete schema.

---

## 🎯 Common Tasks

### Add a New Product
```bash
python manage.py shell
>>> from products.models import Product, Category
>>> cat = Category.objects.get(id=1)
>>> Product.objects.create(name='Laptop', price=999, category=cat, stock=10)
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### View Database
```bash
# SQLite browser
sqlite3 db.sqlite3

# Or use Django shell
python manage.py dbshell
```

### Run Tests
```bash
python manage.py test
```

### Collect Static Files
```bash
python manage.py collectstatic
```

More in [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🐛 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Port 8000 in use | [TROUBLESHOOTING.md#port-8000-already-in-use](TROUBLESHOOTING.md) |
| ModuleNotFoundError | [TROUBLESHOOTING.md#importerror-or-module-not-found](TROUBLESHOOTING.md) |
| Database error | [TROUBLESHOOTING.md#database-locked-error](TROUBLESHOOTING.md) |
| Token invalid | [TROUBLESHOOTING.md#authentication-issues-token-invalid](TROUBLESHOOTING.md) |
| CORS error | [TROUBLESHOOTING.md#cors-errors](TROUBLESHOOTING.md) |
| Can't login | [TROUBLESHOOTING.md#superuser-login-failed](TROUBLESHOOTING.md) |

---

## 🚀 Next Steps

1. **Setup** - Follow [SETUP.md](SETUP.md)
2. **Test** - Use [SAMPLE_DATA.md](SAMPLE_DATA.md)
3. **Integrate** - Follow frontend examples in [README.md](README.md)
4. **Deploy** - Use [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📞 Support Resources

- **Official Django Docs**: https://docs.djangoproject.com
- **Django REST Framework**: https://www.django-rest-framework.org
- **SimpleJWT Docs**: https://django-rest-framework-simplejwt.readthedocs.io
- **CORS Headers**: https://github.com/adamchainz/django-cors-headers

---

## 📋 Useful Commands Cheat Sheet

```bash
# Virtual Environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Dependencies
pip install -r requirements.txt
pip freeze > requirements.txt

# Database
python manage.py makemigrations
python manage.py migrate
python manage.py migrate zero          # Rollback all
python manage.py flush                 # Delete all data

# Users
python manage.py createsuperuser
python manage.py changepassword <username>

# Running
python manage.py runserver
python manage.py runserver 8001        # Different port

# Admin
python manage.py createsuperuser
python manage.py shell

# Testing
python manage.py test
python manage.py test app_name

# Static Files
python manage.py collectstatic

# Cleanup
python manage.py cleanup                       # Sessions
python manage.py clearsessions
```

---

## ✅ Pre-Production Checklist

- [ ] Read [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Change SECRET_KEY in .env
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_HOSTS
- [ ] Configure HTTPS/SSL
- [ ] Set up PostgreSQL database
- [ ] Enable rate limiting
- [ ] Configure monitoring
- [ ] Test all endpoints
- [ ] Set up backups
- [ ] Review security settings

---

## 📝 Documentation Format Legend

| Symbol | Meaning |
|--------|---------|
| ⭐ | Important/Start here |
| 🚀 | Deployment/Production |
| 🔐 | Security related |
| 🐛 | Troubleshooting |
| 📊 | Data/Database |
| 🛠 | Tools/Configuration |

---

## 📞 Content by Category

### Getting Started
- [SETUP.md](SETUP.md) - 5-minute setup
- [README.md](README.md) - Full guide
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture

### API Development
- [API_ENDPOINTS.md](API_ENDPOINTS.md) - All endpoints
- [SAMPLE_DATA.md](SAMPLE_DATA.md) - Testing

### Operations
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment options
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Issue fixes

---

## 🎓 Learning Path

1. **Understanding** (1-2 hours)
   - Read [README.md](README.md) overview
   - Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

2. **Setup** (15 minutes)
   - Follow [SETUP.md](SETUP.md)

3. **Hands-on** (30 minutes)
   - Populate data from [SAMPLE_DATA.md](SAMPLE_DATA.md)
   - Test endpoints from [API_ENDPOINTS.md](API_ENDPOINTS.md)

4. **Development** (ongoing)
   - Reference [README.md](README.md) and [API_ENDPOINTS.md](API_ENDPOINTS.md)
   - Use [TROUBLESHOOTING.md](TROUBLESHOOTING.md) as needed

5. **Deployment** (2-4 hours)
   - Choose option in [DEPLOYMENT.md](DEPLOYMENT.md)
   - Follow step-by-step guide

---

## 🆘 Getting Help

### Issue not in docs?
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Search error on Stack Overflow with "Django" prefix
3. Check official Django docs
4. Review [README.md](README.md) for similar examples

---

## 📜 File Manifest

| File | Size | Purpose |
|------|------|---------|
| README.md | ~500 lines | Complete documentation |
| SETUP.md | ~100 lines | Quick start guide |
| API_ENDPOINTS.md | ~400 lines | API reference |
| PROJECT_STRUCTURE.md | ~400 lines | Architecture details |
| DEPLOYMENT.md | ~300 lines | Production deployment |
| SAMPLE_DATA.md | ~300 lines | Testing & sample data |
| TROUBLESHOOTING.md | ~400 lines | Issue solutions |
| INDEX.md | This file | Navigation guide |

---

## 🎉 You're Ready!

You now have a complete, production-ready Django REST Framework backend!

Next step: [SETUP.md](SETUP.md) ⭐

**Happy coding! 🚀**

---

*Last Updated: 2024*
*Django Version: 4.2.0*
*DRF Version: 3.14.0*
