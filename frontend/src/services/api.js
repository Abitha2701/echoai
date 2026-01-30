import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};

// News API
export const newsAPI = {
  getNews: async (page = 1, limit = 20) => {
    const response = await api.get('/news', { params: { page, limit } });
    return response.data;
  },

  getNewsByCategory: async (category, page = 1) => {
    const response = await api.get(`/news/category/${category}`, { params: { page } });
    return response.data;
  },

  searchNews: async (query, page = 1) => {
    const response = await api.get('/news/search', { params: { q: query, page } });
    return response.data;
  },

  getArticleById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  }
};

// Summary API
export const summaryAPI = {
  generateSummary: async (articleId, text = null) => {
    const response = await api.post('/summaries/generate', { articleId, text });
    return response.data;
  },

  getSavedSummaries: async () => {
    const response = await api.get('/summaries/saved');
    return response.data;
  },

  saveArticle: async (articleId, notes = '') => {
    const response = await api.post(`/summaries/save/${articleId}`, { notes });
    return response.data;
  },

  unsaveArticle: async (articleId) => {
    const response = await api.delete(`/summaries/unsave/${articleId}`);
    return response.data;
  }
};

export default api;