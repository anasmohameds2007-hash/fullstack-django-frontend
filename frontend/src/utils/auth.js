/**
 * Auth Utility Functions
 * Helper functions for authentication
 */

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/** Label for UI; API uses first_name / email / username, not `name`. */
export const getUserDisplayName = (user) => {
  if (!user) return '';
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (full) return full;
  if (user.email) return user.email;
  if (user.username) return user.username;
  return 'User';
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getToken() && !!getCurrentUser();
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('loggedIn');
  // Keep signupData for convenience
};

// Clear all auth data (complete reset)
export const clearAllAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('signupData');
};
