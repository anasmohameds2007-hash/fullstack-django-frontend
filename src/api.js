const API_URL = process.env.REACT_APP_API_URL || '';

export const apiUrl = (path) => `${API_URL}${path}`;

export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return response;
};
