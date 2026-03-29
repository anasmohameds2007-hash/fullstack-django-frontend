/**
 * API Configuration
 * Centralized API client for E-Commerce AI
 */

// For production deployment - DO NOT commit this change
const API_URL = 'https://ecommerce-ai-server-fgze.onrender.com/api';
// Original: const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Build full API URL
 * @param {string} path - API endpoint path
 * @returns {string} Full API URL
 */
export const apiUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
};

/**
 * Make authenticated API request
 * @param {string} path - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const url = apiUrl(path);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  // Merge options, with user options taking precedence
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Don't set Content-Type if body is FormData
  if (options.body instanceof FormData) {
    delete mergedOptions.headers['Content-Type'];
  }

  const response = await fetch(url, mergedOptions);
  
  // Handle 401 Unauthorized - token expired
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally redirect to login
    // window.location.href = '/login';
  }
  
  return response;
};

/**
 * Make unauthenticated API request
 * @param {string} path - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const publicFetch = async (path, options = {}) => {
  const url = apiUrl(path);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  return fetch(url, mergedOptions);
};

/**
 * Parse JSON response with error handling
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Parsed JSON data
 */
export const parseResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

// API Endpoints
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    updatePassword: '/auth/update-password',
    refresh: '/auth/refresh',
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    addresses: '/users/addresses',
    wishlist: '/users/wishlist',
  },
  products: {
    list: '/products',
    search: '/products/search',
    categories: '/products/categories/all',
    featured: '/products/featured/list',
    byId: (id) => `/products/${id}`,
    byCategory: (category) => `/products/category/${category}`,
    related: (id) => `/products/${id}/related`,
    reviews: (id) => `/products/${id}/reviews`,
  },
  cart: {
    get: '/cart',
    addItem: '/cart/items',
    updateItem: (itemId) => `/cart/items/${itemId}`,
    removeItem: (itemId) => `/cart/items/${itemId}`,
    clear: '/cart',
    applyCoupon: '/cart/coupon',
    removeCoupon: '/cart/coupon',
    validate: '/cart/validate',
    sync: '/cart/sync',
  },
};
