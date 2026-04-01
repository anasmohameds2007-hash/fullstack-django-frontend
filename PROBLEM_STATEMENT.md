# E-Commerce Project - Problem Statement & Solutions

## Project Overview
**Full-Stack E-Commerce Platform** with React frontend and Django REST API backend, designed for cloud deployment on Vercel (frontend) and Render (backend).

---

## ⚠️ Critical Issues & Solutions

### 1. **Frontend Build Failing on Vercel** ❌

#### Problem
```
npm run build fails during Vercel deployment
Build command error: "npm ERR! code 1"
```

#### Root Causes
- Missing environment variables
- Build-time API configuration errors
- Undefined imports or missing dependencies
- React version compatibility issues

#### Solution Steps

**Step 1: Test Build Locally**
```bash
cd c:\Ecommerce_ai_client\frontend
npm install
npm run build
```
Check for specific errors in terminal output.

**Step 2: Review Build Logs**
- Go to Vercel Dashboard → Your Project → Deployments
- Click on failed deployment → Logs
- Find exact error message and line number

**Step 3: Common Fixes**

**A) Fix Environment Variables**
Update `frontend/.env.production`:
```bash
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your-client-id
CI=true
GENERATE_SOURCEMAP=false
```

**B) Fix Import Errors**
Check `src/pages/*.jsx` and `src/components/*.jsx`:
```javascript
// ❌ WRONG
import { API } from '../api.js'

// ✅ CORRECT
import { fetchAPI } from '../api'
```

**C) Remove Unused Imports**
```bash
npm ls
```
Remove unused packages:
```bash
npm uninstall package-name
npm install
```

**Step 4: Add Environment Variables to Vercel**
1. Vercel Dashboard → Settings → Environment Variables
2. Add:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com`
   - `REACT_APP_GOOGLE_CLIENT_ID` = `your-google-id`
   - `CI` = `true`

**Step 5: Deploy Again**
```bash
git add .
git commit -m "Fix build errors"
git push origin main
```

---

### 2. **Backend Database Not Connected** ✅ (Using SQLite - No Setup Needed!)

#### Status
✅ **ALREADY SOLVED** - Your backend is configured to use SQLite by default!

#### How It Works
SQLite is a file-based database that requires NO external setup:
- Database file: `backend/db.sqlite3` (automatically created)
- No server needed
- No credentials needed
- Perfect for deployment on Render

#### Verification
Your `backend/ecommerce_backend/settings.py` already has:
```python
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.sqlite3'),
        'NAME': BASE_DIR / config('DB_NAME', default='db.sqlite3'),
    }
}
```

#### For Deployment
In Render Dashboard → Your Backend Service → Environment, just add:
```
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

Or simply leave them empty - the defaults work perfectly!

#### Migration (Automatic)
Render will automatically run migrations during build:
```bash
python manage.py migrate
```
This creates all database tables in `db.sqlite3`
            'USER': os.getenv('DB_USER', ''),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', ''),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }
```

**Step 2: Deploy Backend**
Render will automatically:
1. Install dependencies
2. Run migrations: `python manage.py migrate`
3. Collect static files

**Step 3: Create Superuser**
In Render Dashboard → Your Service → Shell:
```bash
python manage.py createsuperuser
```

---

### 3. **Environment Variables Not Configured** ❌

#### Problem
```
Deployment fails: SECRET_KEY, API_URL not found
Applications crash: "REACT_APP_API_URL is undefined"
```

#### Solution

**Backend Environment Variables**

File: `backend/.env.production` (for reference only, actual vars in Render Dashboard)

In [Render Dashboard](https://render.com):
```
# Security
DEBUG=False
SECRET_KEY=django-insecure-your-generated-key-here
ALLOWED_HOSTS=your-app.onrender.com,*.onrender.com
SECURE_SSL_REDIRECT=True
SECURE_BROWSER_XSS_FILTER=True

# CORS
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://yourdomain.com

# Database (SQLite - No Setup Needed!)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# OAuth
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

# Frontend
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend Environment Variables**

In [Vercel Dashboard](https://vercel.com):
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
CI=true
GENERATE_SOURCEMAP=false
```

---

### 4. **Frontend-Backend API Communication Not Working** ❌

#### Problem
```
Frontend deployed but API calls fail
Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
Error: "Cannot fetch from undefined URL"
```

#### Solution

**Step 1: Update Backend api.js**
File: `frontend/src/api.js`

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Step 2: Configure Backend CORS**
File: `backend/ecommerce_backend/settings.py`

```python
# Use environment variable
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000'
).split(',')

CORS_ALLOW_CREDENTIALS = True

# Additional security headers
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
```

**Step 3: Update Frontend Package.json Proxy**
File: `frontend/package.json`

```json
{
  "proxy": "http://localhost:8000",
  ...
}
```
(Keep for local development only)

**Step 4: Test API Connection**
In browser console (on deployed frontend):
```javascript
fetch('https://your-backend.onrender.com/api/products/')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

---

### 5. **Static Files Not Serving** ⚠️

#### Problem
```
CSS, images not loading on deployed site
404 errors for /static/* resources
```

#### Solution

**Step 1: Add WhiteNoise Middleware**
File: `backend/ecommerce_backend/settings.py` ✅ (Already done)

**Step 2: Collect Static Files**
This runs automatically in Render build command:
```bash
python manage.py collectstatic --noinput
```

**Step 3: Verify Static Files Configuration**
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

---

### 6. **Google OAuth Not Working** ⚠️

#### Problem
```
Google authentication fails
Error: "Redirect URI mismatch"
```

#### Solution

**Step 1: Update Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. OAuth 2.0 Client IDs
4. Edit and add Authorized redirect URIs:
   ```
   https://your-backend.onrender.com/api/auth/google/
   https://your-frontend.vercel.app
   https://your-frontend.vercel.app/auth/callback
   ```

**Step 2: Update Backend Callback URL**
File: `backend/ecommerce_backend/urls.py`

```python
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.generic import TemplateView

urlpatterns = [
    # ... existing urls
    path('api/auth/google/', GoogleAuthView.as_view(), name='google-auth'),
    path('auth/callback/', TemplateView.as_view(template_name='auth_callback.html')),
]
```

**Step 3: Update Frontend Google Login Component**
File: `frontend/src/components/GoogleLogin.jsx`

```javascript
const handleSuccess = async (credentialResponse) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    // redirect to dashboard
  } catch (error) {
    console.error('Auth error:', error);
  }
};
```

---

## 📋 Complete Deployment Checklist

### Phase 1: Local Testing ✅
- [x] Frontend builds locally: `npm run build`
- [x] Backend runs locally: `python manage.py runserver`
- [x] API calls work: `curl http://localhost:8000/api/products/`

### Phase 2: Backend Setup on Render

- [ ] Create Render account
- [ ] Create PostgreSQL database instance
- [ ] Create Web Service for backend
- [ ] Add all environment variables
- [ ] Connect GitHub repository
- [ ] Set Build Command:
  ```
  pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
  ```
- [ ] Set Start Command:
  ```
  gunicorn ecommerce_backend.wsgi:application --bind 0.0.0.0:$PORT
  ```
- [ ] Deploy and test: `curl https://your-backend.onrender.com/api/products/`
- [ ] Create superuser
- [ ] Add sample data

### Phase 3: Frontend Setup on Vercel

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Set Build Command: `npm run build`
- [ ] Set Output Directory: `build`
- [ ] Deploy

### Phase 4: Integration Testing

- [ ] Frontend loads
- [ ] API calls successful
- [ ] Products display
- [ ] Google auth works
- [ ] Cart functions
- [ ] Mobile responsive
- [ ] No console errors

### Phase 5: Production Optimization

- [ ] Enable HTTPS redirect
- [ ] Set up domain name
- [ ] Configure email notifications
- [ ] Enable error tracking (Sentry)
- [ ] Setup CI/CD pipeline

---

## 🔍 Testing URLs

**After Deployment, Test These:**

```bash
# Backend health check
curl https://your-backend.onrender.com/admin/

# API endpoints
curl https://your-backend.onrender.com/api/products/
curl https://your-backend.onrender.com/api/users/profile/

# Frontend
https://your-app.vercel.app/

# CORS test
curl -H "Origin: https://your-app.vercel.app" \
  https://your-backend.onrender.com/api/products/
```

---

## 📝 Quick Reference Commands

**Backend:**
```bash
# Local development
python manage.py runserver

# Database
python manage.py migrate
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Generate secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Frontend:**
```bash
# Local development
npm start

# Build
npm run build

# Test
npm test

# Install dependencies
npm install
```

---

## 🚀 Final Submission Checklist

- [ ] All code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] All environment variables set
- [ ] Database connected and migrated
- [ ] API working end-to-end
- [ ] Google OAuth functioning
- [ ] Mobile responsive
- [ ] No critical errors in console
- [ ] Documentation updated
- [ ] README with deployment links

---

## 📞 Troubleshooting Links

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Render Deployment Docs](https://render.com/docs)
- [Django Deployment Guide](https://docs.djangoproject.com/en/4.2/howto/deployment/)
- [CORS Troubleshooting](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [React Build Issues](https://create-react-app.dev/docs/troubleshooting/)

