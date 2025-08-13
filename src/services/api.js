import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Adding token to request:', token.substring(0, 20) + '...'); // Debug log
    } else {
      console.log('⚠️ No token found for request to:', config.url); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data); // Debug log
    if (error.response?.status === 401) {
      console.log('🚪 401 Unauthorized - clearing tokens and redirecting'); // Debug log
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on login/register pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      console.log('🔵 Attempting login with:', credentials.email); // Debug log
      const response = await api.post('/auth/login', credentials);
      console.log('🔵 Login response:', response.data); // Debug log
      
      const { access_token, user } = response.data;
      
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('🔵 Token stored:', access_token.substring(0, 20) + '...'); // Debug log
      } else {
        console.error('❌ No access_token in response');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error); // Debug log
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

// Password API
export const passwordAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/passwords');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch passwords' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch password' };
    }
  },

  create: async (passwordData) => {
    try {
      const response = await api.post('/passwords', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create password' };
    }
  },

  update: async (id, passwordData) => {
    try {
      const response = await api.put(`/passwords/${id}`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update password' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete password' };
    }
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },
};

export default api;
