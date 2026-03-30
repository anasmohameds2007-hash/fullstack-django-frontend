# Troubleshooting Guide

## Common Issues and Solutions

### 1. ImportError or Module Not Found

**Problem:**
```
ModuleNotFoundError: No module named 'django'
```

**Solution:**
```bash
# Ensure virtual environment is activated
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

---

### 2. Port 8000 Already in Use

**Problem:**
```
Address already in use: ('127.0.0.1', 8000)
```

**Solution:**
```bash
# Use a different port
python manage.py runserver 8001

# Or kill the process using port 8000
# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

---

### 3. Database Locked Error

**Problem:**
```
OperationalError: database is locked
```

**Solution:**
```bash
# Delete the database and recreate
rm db.sqlite3
python manage.py migrate

# If still failing, restart the server
python manage.py runserver
```

---

### 4. Migrations Not Applied

**Problem:**
```
ProgrammingError: no such table: auth_user
```

**Solution:**
```bash
# Apply all migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations

# If stuck, reset (WARNING: deletes all data)
python manage.py migrate zero
python manage.py migrate
```

---

### 5. Authentication Issues - Token Invalid

**Problem:**
```
{"detail":"Invalid token"}
```

**Solution:**
- Ensure you're passing the `access` token, not `refresh`
- Check token is not expired (default: 24 hours)
- Use Bearer prefix: `Authorization: Bearer <token>`
- Refresh token if expired:
```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<refresh_token>"}'
```

---

### 6. CORS Errors

**Problem:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
Check `.env` file and ensure frontend URL is in CORS whitelist:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

For development (not recommended for production):
```python
# In settings.py
CORS_ALLOW_ALL_ORIGINS = True  # Temporary only!
```

Restart server after changes.

---

### 7. File Upload Issues (Images)

**Problem:**
```
400 Bad Request when uploading image
```

**Solution:**
- Use `multipart/form-data` content type
- Don't set Content-Type header manually (let browser do it)
- Ensure Pillow is installed: `pip install Pillow`
- Check media folder permissions

```bash
# Ensure media folder exists
mkdir media
mkdir media/products
```

---

### 8. Superuser Login Failed

**Problem:**
```
User doesn't exist or password incorrect
```

**Solution:**
```bash
# Create new superuser
python manage.py createsuperuser

# Or reset password of existing superuser
python manage.py changepassword <username>
```

---

### 9. Static Files Not Loading

**Problem:**
Images and CSS not loading in admin panel

**Solution:**
```bash
# Collect static files
python manage.py collectstatic --noinput

# In development, Django serves static files automatically
# Ensure DEBUG=True in .env
```

---

### 10. Secret Key Error in Production

**Problem:**
```
ImproperlyConfigured: Forbidden host at..
```

**Solution:**
1. Set `DEBUG=False` only after fixing issues
2. Update `ALLOWED_HOSTS` in `.env`:
```
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost
```
3. Change `SECRET_KEY` to a strong random value

---

### 11. Can't Connect to Database

**Problem:**
```
django.db.utils.OperationalError: no such table
```

**Solution:**
```bash
# Run migrations
python manage.py migrate

# If using different database, update .env:
DB_ENGINE=django.db.backends.postgresql
# Install: pip install psycopg2-binary
```

---

### 12. Permission Denied Creating Products

**Problem:**
```
{"detail":"You do not have permission to perform this action."}
```

**Solution:**
- Ensure you're logged in as admin/staff user
- Check user object:
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='youruser')
>>> user.is_staff = True
>>> user.save()
```

---

### 13. Search/Filtering Not Working

**Problem:**
No results from search endpoint

**Solution:**
- Ensure product exists and is active (`is_active=True`)
- Check search parameter: `?search=laptop`
- Verify product name contains search term
- Use admin panel to add test products

---

### 14. Pagination Issues

**Problem:**
Next/previous links showing wrong URL

**Solution:**
Update `ALLOWED_HOSTS` and ensure correct domain:
```
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
```

---

### 15. Cache Issues

**Problem:**
Old data still showing after updates

**Solution:**
```bash
# Clear Django cache
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()

# Restart server
python manage.py runserver
```

---

## Debug Mode

### Enable Detailed Error Pages

In `.env`:
```
DEBUG=True
```

This shows full error traceback (only for development!).

### Check Logs

```bash
# Don't exist by default, but can add:
# In settings.py LOGGING configuration...
```

---

## Performance Issues

### Slow Queries

1. Check database indexes:
```python
# In models.py
class Meta:
    indexes = [
        models.Index(fields=['field_name']),
    ]
```

2. Use `select_related()` and `prefetch_related()`:
```python
Product.objects.select_related('category').prefetch_related('reviews')
```

### High Memory Usage

```bash
# Check process memory
# On macOS/Linux:
top

# On Windows:
tasklist /v

# Optimize queries and use pagination
```

---

## Security Checklist

- [ ] Change `SECRET_KEY` from default
- [ ] Set `DEBUG=False` in production
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Validate all user inputs
- [ ] Use strong database credentials
- [ ] Keep dependencies updated: `pip list --outdated`
- [ ] Add rate limiting for APIs
- [ ] Enable CSRF protection
- [ ] Use secure password validators

---

## Getting Help

### Useful Commands

```bash
# Check Django version
python -m django --version

# List all installed apps
python manage.py show_apps

# Check for errors/warnings
python manage.py check

# Get database info
python manage.py dbshell

# Run Python shell with Django
python manage.py shell

# Clear all migrations
python manage.py migrate zero

# Show SQL for a migration
python manage.py sqlmigrate app_name migration_name
```

### Resources

- Django Documentation: https://docs.djangoproject.com
- Django REST Framework: https://www.django-rest-framework.org
- SimpleJWT Documentation: https://django-rest-framework-simplejwt.readthedocs.io
- Django CORS: https://github.com/adamchainz/django-cors-headers

---

## Contact & Support

If you encounter issues not listed here:

1. Check the error message carefully
2. Google the error with "Django" prefix
3. Check Django documentation
4. Check StackOverflow for similar issues
5. Open an issue on GitHub repository

---

**Remember: Always test changes in development before production!**
