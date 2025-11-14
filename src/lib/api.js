import axios from 'axios';
import { getToken, clearToken } from '@/utils/auth';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) =>
    api.post('/api/auth/login', credentials),
  register: (userData) =>
    api.post('/api/auth/register', userData),
};

// Sweets API endpoints
export const sweetsAPI = {
  getAll: () => api.get('/api/sweets'),
  search: (params) =>
    api.get('/api/sweets/search', { params }),
  create: (sweet) =>
    api.post('/api/sweets', sweet),
  update: (id, sweet) =>
    api.put(`/api/sweets/${id}`, sweet),
  delete: (id) => api.delete(`/api/sweets/${id}`),
  purchase: (id, quantity) =>
    api.post(`/api/sweets/${id}/purchase`, { quantity }),
  restock: (id, quantity) =>
    api.post(`/api/sweets/${id}/restock`, { quantity }),
};

export default api;