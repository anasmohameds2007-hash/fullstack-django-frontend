# Deployment Guide

## Production Deployment Checklist

Before deploying to production, follow this checklist:

### 1. Security Configuration

```bash
# Generate a strong SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Update `.env`:
```
DEBUG=False
SECRET_KEY=your-very-long-random-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended)

```bash
# Install PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Install Python driver
pip install psycopg2-binary

# Create database
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# Update .env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

#### Option B: SQLite (Simple but not for high traffic)

```
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=/absolute/path/to/db.sqlite3
```

### 3. Static & Media Files

```bash
# Collect static files
python manage.py collectstatic --noinput

# Configure web server to serve from:
# Static: /var/www/ecommerce/staticfiles/
# Media: /var/www/ecommerce/media/
```

### 4. Update Environment Settings

```
# .env
DEBUG=False
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_SECURITY_POLICY={...}
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

---

## Deployment Options

### Option 1: Heroku Deployment

#### Setup
```bash
# Install Heroku CLI
# Create Python runtime file
echo "python-3.11.0" > runtime.txt

# Create Procfile
echo "web: gunicorn ecommerce_backend.wsgi" > Procfile

# Install required packages
pip install gunicorn whitenoise

# Update requirements.txt
pip freeze > requirements.txt
```

#### Deploy
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Option 2: AWS EC2 Deployment

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 or later)
- Domain name

#### Setup
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y python3-pip postgresql nginx

# Clone repository
git clone your-repo-url
cd backend

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Configure database
sudo -u postgres createdb ecommerce_db

# Run migrations
python manage.py migrate
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

#### Nginx Configuration

Create `/etc/nginx/sites-available/ecommerce`:
```nginx
upstream django {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    charset utf-8;

    location /static/ {
        alias /home/ubuntu/backend/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/backend/media/;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Gunicorn Service

Create `/etc/systemd/system/django.service`:
```ini
[Unit]
Description=Django Ecommerce Backend
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/backend
ExecStart=/home/ubuntu/backend/venv/bin/gunicorn ecommerce_backend.wsgi:application --access-logfile - --error-logfile - --bind 127.0.0.1:8000

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl enable django
sudo systemctl start django
sudo systemctl status django
```

#### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Docker Deployment

#### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["gunicorn", "ecommerce_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    depends_on:
      - db
    environment:
      DB_ENGINE: django.db.backends.postgresql
      DB_NAME: ecommerce_db
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_HOST: db
      DEBUG: 'False'
      SECRET_KEY: your-secret-key
    ports:
      - "8000:8000"
    volumes:
      - .:/app

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

### Option 4: PythonAnywhere

1. Upload files to PythonAnywhere
2. Create virtual environment
3. Install requirements
4. Configure Web app settings
5. Update WSGI file path
6. Set domain in Web settings

---

## Post-Deployment Tasks

### 1. Domain Configuration

Update ALLOWED_HOSTS:
```python
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
```

### 2. CORS Configuration

Update frontend domain:
```
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Environment Variables

Move from `.env` to system environment:
```bash
export DEBUG=False
export SECRET_KEY=your-secret-key
export ALLOWED_HOSTS=yourdomain.com
```

### 4. Database Backup

```bash
# PostgreSQL backup
pg_dump ecommerce_db > backup.sql

# Restore
psql ecommerce_db < backup.sql
```

### 5. Monitoring Setup

Add monitoring tools:
- New Relic
- Sentry
- DataDog
- AWS CloudWatch

### 6. Logging

Configure in settings.py:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

---

## Performance Optimization

### 1. Database Optimization

```python
# settings.py
DATABASES = {
    'default': {
        'CONNECTION': {
            'connect_timeout': 10,
        },
        'ATOMIC_REQUESTS': True,
        'CONN_MAX_AGE': 600,
    }
}
```

### 2. Caching

```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### 3. CDN Setup

- Upload media to S3/CloudFront
- Configure ALLOWED_HOSTS
- Use CDN domain in frontend

### 4. API Rate Limiting

```python
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

## Maintenance

### Regular Tasks

```bash
# Check for security updates
pip list --outdated

# Update packages
pip install --upgrade package-name

# Run tests
python manage.py test

# Check for issues
python manage.py check --deploy
```

### Backup Strategy

- Daily database backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures

### Monitoring

- CPU usage
- Memory usage
- Disk space
- API response times
- Error rates
- Database connections

---

## Scaling for High Traffic

1. **Database**
   - Use read replicas
   - Implement connection pooling
   - Cache frequently accessed data

2. **Application**
   - Use multiple gunicorn workers
   - Implement load balancing
   - Use CDN for static files

3. **Infrastructure**
   - scale horizontally (add more servers)
   - Use auto-scaling groups
   - Implement load balancer

4. **Optimization**
   - Enable gzip compression
   - Minify static files
   - Use lazy loading for images

---

## Disaster Recovery

### Backup Procedures

```bash
# Automated daily backup
0 3 * * * pg_dump ecommerce_db > /backups/ecommerce_$(date +\%Y\%m\%d).sql

# Upload to cloud storage
0 4 * * * aws s3 cp /backups/ s3://your-bucket-backup/ --recursive
```

### Recovery Plan

1. Assess damage
2. Restore from latest backup
3. Verify data integrity
4. Notify users if needed
5. Clear cache/reload services

---

## Security Hardening

- [ ] Update all packages
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set strong database passwords
- [ ] Enable 2FA for admin access
- [ ] Regular security audits
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection enabled
- [ ] Rate limiting configured

---

For more information:
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/conf/settings/#deployment-checklist)
- [OWASP Django Security](https://owasp.org/www-community/attacks/xss/)
- [Django REST Framework Security](https://www.django-rest-framework.org/topics/security/)
