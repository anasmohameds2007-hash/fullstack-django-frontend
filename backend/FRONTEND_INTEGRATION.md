# Frontend-Backend Integration Guide

This guide shows how to integrate your React frontend with the Django backend API.

## Backend Setup (Already Complete!)

Your Django backend is ready at: `http://localhost:8000/api`

---

## Step 1: Update Frontend API Configuration

In your React project, create or update `src/api.js`:

```javascript
import axios from 'axios';

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/token/refresh/`,
                    { refresh: refreshToken }
                );
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return apiClient(originalRequest);
            } catch (err) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
```

---

## Step 2: Authentication Service

Create `src/services/authService.js`:

```javascript
import apiClient from '../api';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await apiClient.post('/auth/users/register/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Login user
    login: async (username, password) => {
        try {
            const response = await apiClient.post('/auth/users/login/', {
                username,
                password,
            });
            
            // Store tokens
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => !!localStorage.getItem('access_token'),

    // Get user profile
    getProfile: async () => {
        try {
            const response = await apiClient.get('/auth/users/me/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Change password
    changePassword: async (oldPassword, newPassword, newPassword2) => {
        try {
            const response = await apiClient.post('/auth/users/change_password/', {
                old_password: oldPassword,
                new_password: newPassword,
                new_password2: newPassword2,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default authService;
```

---

## Step 3: Product Service

Create `src/services/productService.js`:

```javascript
import apiClient from '../api';

const productService = {
    // Get all products
    getProducts: async (page = 1, pageSize = 10) => {
        try {
            const response = await apiClient.get('/products/products/', {
                params: { page, page_size: pageSize },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single product
    getProduct: async (productId) => {
        try {
            const response = await apiClient.get(`/products/products/${productId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search products
    searchProducts: async (query) => {
        try {
            const response = await apiClient.get('/products/products/search/', {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get products by category
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await apiClient.get('/products/products/by_category/', {
                params: { category_id: categoryId },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get featured products
    getFeaturedProducts: async () => {
        try {
            const response = await apiClient.get('/products/products/featured/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get deals/sale products
    getDeals: async () => {
        try {
            const response = await apiClient.get('/products/products/deals/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get categories
    getCategories: async () => {
        try {
            const response = await apiClient.get('/products/categories/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get category details
    getCategory: async (categoryId) => {
        try {
            const response = await apiClient.get(`/products/categories/${categoryId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default productService;
```

---

## Step 4: Cart Service

Create `src/services/cartService.js`:

```javascript
import apiClient from '../api';

const cartService = {
    // Get user cart
    getCart: async () => {
        try {
            const response = await apiClient.get('/cart/cart/my_cart/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add item to cart
    addToCart: async (productId, quantity = 1) => {
        try {
            const response = await apiClient.post('/cart/cart/add_item/', {
                product_id: productId,
                quantity,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Remove item from cart
    removeFromCart: async (productId) => {
        try {
            const response = await apiClient.post('/cart/cart/remove_item/', {
                product_id: productId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity) => {
        try {
            const response = await apiClient.post('/cart/cart/update_quantity/', {
                product_id: productId,
                quantity,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            const response = await apiClient.post('/cart/cart/clear_cart/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get cart summary
    getCartSummary: async () => {
        try {
            const response = await apiClient.get('/cart/cart/cart_summary/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default cartService;
```

---

## Step 5: React Hooks for API Calls

Create `src/hooks/useProduct.js`:

```javascript
import { useState, useEffect } from 'react';
import productService from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await productService.getProducts(currentPage);
                setProducts(data.results);
                setHasMore(!!data.next);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    return {
        products,
        loading,
        error,
        hasMore,
        currentPage,
        setCurrentPage,
    };
};

export const useProduct = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await productService.getProduct(productId);
                setProduct(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
};
```

Create `src/hooks/useCart.js`:

```javascript
import { useState, useEffect } from 'react';
import cartService from '../services/cartService';

export const useCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addItem = async (productId, quantity) => {
        try {
            const data = await cartService.addToCart(productId, quantity);
            setCart(data.cart);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const removeItem = async (productId) => {
        try {
            const data = await cartService.removeFromCart(productId);
            setCart(data.cart);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const updateItem = async (productId, quantity) => {
        try {
            const data = await cartService.updateQuantity(productId, quantity);
            setCart(data.cart);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const clear = async () => {
        try {
            const data = await cartService.clearCart();
            setCart(data.cart);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return {
        cart,
        loading,
        error,
        addItem,
        removeItem,
        updateItem,
        clear,
        refetch: fetchCart,
    };
};
```

---

## Step 6: React Component Examples

### Login Component

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.username?.[0] || err.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

export default Login;
```

### Product List Component

```javascript
import React from 'react';
import { useProducts } from '../hooks/useProduct';
import productService from '../services/productService';

function ProductList() {
    const { products, loading, error, hasMore, currentPage, setCurrentPage } =
        useProducts();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="products">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                    <button>Add to Cart</button>
                </div>
            ))}
            {hasMore && (
                <button onClick={() => setCurrentPage(currentPage + 1)}>
                    Load More
                </button>
            )}
        </div>
    );
}

export default ProductList;
```

### Cart Component

```javascript
import React from 'react';
import { useCart } from '../hooks/useCart';

function ShoppingCart() {
    const { cart, loading, error, removeItem, updateItem } = useCart();

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>Error loading cart</p>;
    if (!cart || cart.items.length === 0) return <p>Cart is empty</p>;

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                    <h4>{item.product.name}</h4>
                    <p>${item.product.price}</p>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={item.quantity}
                        onChange={(e) =>
                            updateItem(item.product.id, parseInt(e.target.value))
                        }
                    />
                    <p>Total: ${item.item_total}</p>
                    <button onClick={() => removeItem(item.product.id)}>
                        Remove
                    </button>
                </div>
            ))}
            <h3>Cart Total: ${cart.total_price}</h3>
            <button className="checkout">Checkout</button>
        </div>
    );
}

export default ShoppingCart;
```

---

## Step 7: Environment Configuration

Create `.env` in your React project root:

```
REACT_APP_API_URL=http://localhost:8000/api
```

For production:
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

---

## Step 8: Proxy Configuration (Optional)

If you want to avoid CORS issues during development, add to `package.json`:

```json
{
  "proxy": "http://localhost:8000",
  "devDependencies": {
    "http-proxy-middleware": "^2.0.6"
  }
}
```

Create `src/setupProxy.js`:

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
```

---

## Testing Integration

### 1. Start Backend
```bash
cd backend
python manage.py runserver
```

### 2. Start Frontend
```bash
npm start
```

### 3. Test Login
- Go to http://localhost:3000/login
- Use credentials from backend
- Check localStorage for tokens

### 4. Test Products
- Navigate to products page
- Should see list from Django backend

### 5. Test Cart
- Add product to cart
- Check cart updates
- Verify API calls in Network tab

---

## Common Integration Issues

### CORS Error
**Problem**: 'Access to XMLHttpRequest has been blocked by CORS policy'

**Solution**: Ensure backend has correct CORS_ALLOWED_ORIGINS in .env

```
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Token Not Being Sent
**Problem**: 401 Unauthorized on authenticated endpoints

**Solution**: Check localStorage has token and it's being sent correctly

```javascript
// In browser console:
localStorage.getItem('access_token')  // Should show token
```

### API URL Not Working
**Problem**: Network requests fail with 404

**Solution**: Check REACT_APP_API_URL is set correctly

```bash
# In terminal:
echo $REACT_APP_API_URL  # Should show your backend URL
```

---

## Publishing to Production

### Backend
Follow [DEPLOYMENT.md](../DEPLOYMENT.md)

### Frontend
```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or other hosting
# Update REACT_APP_API_URL to your production backend URL
```

---

## Resources

- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [Django REST Framework](https://www.django-rest-framework.org)
- [JWT Authentication Guide](https://auth0.com/learn/json-web-tokens)

---

Now your React frontend and Django backend are integrated! 🎉

For more information:
- Backend: See [backend/README.md](../README.md)
- Frontend: Continue with React development
