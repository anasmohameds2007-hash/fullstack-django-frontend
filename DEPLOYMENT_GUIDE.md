# Deployment & Submission Guide

## 📋 Pre-Deployment Verification

### File Checklist

**Backend Files (must exist):**
```
backend/
├── Procfile ✅
├── render.yaml ✅
├── requirements.txt ✅ (with gunicorn, whitenoise)
├── .env.production ✅
├── ecommerce_backend/
│   ├── settings.py ✅ (WhiteNoise middleware added)
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── db.sqlite3 ✅ (SQLite database)
└── [apps: users, products, cart]/
```

**Frontend Files (must exist):**
```
frontend/
├── vercel.json ✅
├── .env.production ✅
├── package.json ✅
├── package-lock.json ✅
├── public/
├── src/
│   ├── api.js (must use REACT_APP_API_URL)
│   ├── App.js
│   ├── components/
│   └── pages/
└── [build/ - will be generated]
```

**Root Files:**
```
├── PROBLEM_STATEMENT.md ✅
├── DEPLOYMENT_GUIDE.md ✅
├── .gitignore ✅ (with /backend)
└── README.md
```

---

## 🚀 Deployment Steps (In Order)

### STEP 1: Push All Code to GitHub ✅

```bash
cd c:\Ecommerce_ai_client

# Verify all changes
git status

# Commit
git add .
git commit -m "Prepare for production deployment"

# Push
git push origin main

# Verify on GitHub
# Visit: https://github.com/anasmohameds2007-hash/fullstack-django-frontend
```

### STEP 2: Deploy Backend to Render

#### 2.1 Create Web Service for Backend (SQLite - No Database Setup Needed!)
1. Go to https://render.com
2. Dashboard → New → Web Service
3. Connect GitHub → Select **fullstack-django-frontend**
4. Configuration:
   - Name: **ecommerce-backend**
   - Environment: **Python 3**
   - Region: **Frankfurt (EU)** or closest to you
   - Build Command: ✅ Keep default (Render auto-detects from Procfile)
   - Start Command: ✅ Keep default (Render auto-detects from Procfile)

#### 2.2 Set Environment Variables
Before deploying, add these in **Settings → Environment**:

```
# Security (MUST HAVE)
DEBUG=False
SECRET_KEY=<YOUR_GENERATED_KEY>
ALLOWED_HOSTS=ecommerce-backend.onrender.com

# CORS (Update after frontend deployment)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Database (SQLite - No setup needed!)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# Optional
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_SECRET>
```

**To generate SECRET_KEY:**
```bash
# Run locally
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Copy the output and paste into Render
```

#### 2.3 Deploy Backend
1. Save environment variables
2. Render will auto-deploy from GitHub
3. Wait for "Deploy successful" message
4. Note the URL: `https://ecommerce-backend.onrender.com`

#### 2.4 Create Superuser
1. Dashboard → Your Service → Shell tab
2. Run:
```bash
python manage.py createsuperuser
```
3. Enter credentials (email: admin@example.com, password: admin123)

#### 2.5 Test Backend
```bash
# In browser or terminal
curl https://ecommerce-backend.onrender.com/api/products/

# Should return JSON list of products
```

---

### STEP 3: Deploy Frontend to Vercel

#### 3.1 Setup Vercel Account
1. Go to https://vercel.com
2. Sign up → Connect GitHub
3. Select repository: **fullstack-django-frontend**

#### 3.2 Set Environment Variables
In **Settings → Environment Variables**, add:

```
REACT_APP_API_URL=https://ecommerce-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_ID>
CI=true
```

#### 3.3 Configure Build Settings
- Framework: **Create React App**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

#### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Note the URL: `https://your-project.vercel.app`

#### 3.5 Test Frontend
- Open https://your-project.vercel.app
- Verify products load (API call successful)
- Check console for errors (F12)

---

### STEP 4: Update CORS on Backend

Now that frontend is deployed:

1. Go to Render Dashboard → Backend Service
2. Settings → Environment Variables
3. Update `CORS_ALLOWED_ORIGINS`:
```
https://your-project.vercel.app,https://yourdomain.com
```
4. Save and redeploy

---

### STEP 5: Final Integration Testing

#### Test 1: Product Display
```
1. Open frontend: https://your-project.vercel.app
2. Navigate to Shop page
3. Verify products load
4. Open DevTools (F12)
5. Check Network tab - API call should return 200
```

#### Test 2: API Direct Call
```bash
curl https://ecommerce-backend.onrender.com/api/products/ \
  -H "Origin: https://your-project.vercel.app"

# Should return products without CORS error
```

#### Test 3: Authentication
```
1. Try Google Login (if configured)
2. Verify user created in Django admin
3. Check token stored in localStorage
```

#### Test 4: Mobile Responsive
```
1. Open frontend on mobile device
2. Test navigation
3. Verify layout responsive
4. Test all pages
```

---

## 📱 Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Products displaying correctly
- [ ] API calls working (no CORS errors)
- [ ] Google OAuth working (if implemented)
- [ ] Static files loading (CSS, images, fonts)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Database connected and populated
- [ ] Superuser created
- [ ] Security headers configured
- [ ] HTTPS enabled (automatic on Vercel/Render)

---

## 🔧 Troubleshooting During Deployment

### Backend Build Fails
```
Check Render Logs:
1. Services → Your Backend → Logs
2. Look for error messages
3. Common issues:
   - Missing DATABASE_URL
   - Python version incompatible
   - Missing dependencies in requirements.txt
```

### Frontend Build Fails
```
Check Vercel Logs:
1. Deployments → Failed Deploy → Logs
2. Common issues:
   - REACT_APP_API_URL undefined
   - Import errors
   - Missing dependencies in package-lock.json
```

### CORS Errors
```
Error: "Access to XMLHttpRequest blocked by CORS policy"

Solution:
1. Verify frontend URL in CORS_ALLOWED_ORIGINS
2. Check Origin header in request
3. Ensure DEBUG=False in production
```

### API Returns 404
```
Error: "Cannot GET /api/products/"

Solution:
1. Verify backend URL is correct
2. Check if backend is running
3. Verify DATABASE_URL is set
4. Check migrations ran successfully
```

### Static Files Not Loading
```
Error: CSS/images 404

Solution:
1. Ensure WhiteNoise middleware added
2. Run collectstatic:
   python manage.py collectstatic --noinput
3. This is automatic in build command
```

---

## 📝 Documentation for Submission

### Create README.md

```markdown
# E-Commerce Full-Stack Application

## Overview
React frontend with Django REST API backend for e-commerce platform.

## Live Deployment
- **Frontend**: https://your-project.vercel.app
- **Backend API**: https://ecommerce-backend.onrender.com
- **Admin Panel**: https://ecommerce-backend.onrender.com/admin/

## Technology Stack
- **Frontend**: React 19, React Router v7, Axios
- **Backend**: Django 4.2, Django REST Framework
- **Database**: SQLite 3
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Authentication**: Google OAuth 2.0, JWT Tokens

## Features
✅ Product Catalog
✅ Shopping Cart
✅ User Authentication (Google OAuth)
✅ Order Management
✅ Admin Dashboard
✅ Responsive Design
✅ CORS Enabled

## Local Development

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Deployment

See [PROBLEM_STATEMENT.md](PROBLEM_STATEMENT.md) and [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## API Documentation
- Products: GET /api/products/
- Users: GET /api/users/profile/
- Cart: GET/POST /api/cart/
- Auth: POST /api/auth/google/

## Project Structure
```
├── backend/        # Django REST API
├── frontend/       # React application
├── PROBLEM_STATEMENT.md
└── DEPLOYMENT_GUIDE.md
```
```

### Create API_DOCUMENTATION.md
```markdown
# API Endpoints

## Products
- GET /api/products/ - List all products
- GET /api/products/{id}/ - Get product details
- POST /api/products/ - Create product (admin only)

## Users
- GET /api/users/profile/ - Get current user
- POST /api/users/register/ - Register new user
- POST /api/auth/token/ - Login

## Cart
- GET /api/cart/ - Get cart items
- POST /api/cart/add/ - Add to cart
- DELETE /api/cart/{id}/ - Remove item

## Authentication
- Google OAuth: POST /api/auth/google/
- JWT Token: Authorization: Bearer {token}
```

---

## ✅ Final Submission Checklist

Before submitting:

- [ ] GitHub repository public and complete
- [ ] README.md present and detailed
- [ ] Code properly commented
- [ ] No sensitive data in repo (.env ignored)
- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] API endpoints documented
- [ ] Problem statement included
- [ ] Deployment guide included
- [ ] All features tested
- [ ] No console errors
- [ ] Both URLs accessible and functional

---

## 📞 Support

**Repository**: https://github.com/anasmohameds2007-hash/fullstack-django-frontend

**Deployment Docs**:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Django Docs](https://docs.djangoproject.com/)

