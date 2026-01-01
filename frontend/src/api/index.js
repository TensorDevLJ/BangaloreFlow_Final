import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

export const calculateFare = async (origin, destination, mood = 'neutral') => {
  const response = await api.post('/fare', { origin, destination, mood });
  return response.data;
};

export const getHistory = async (limit = 10) => {
  const response = await api.get(`/history?limit=${limit}`);
  return response.data;
};

export const getPopularRoutes = async (limit = 5) => {
  const response = await api.get(`/popular-routes?limit=${limit}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export default api;
