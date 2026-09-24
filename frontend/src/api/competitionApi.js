import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    if (window.location.port === '8081' || window.location.port === '19006') {
      return 'http://localhost:5000/api';
    }
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Robust Cross-Platform Storage Adapter (SecureStore for Native, localStorage/memory for Web)
const storage = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      return null;
    }
  },
  setItem: async (key, val) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, val);
        return;
      }
      await SecureStore.setItemAsync(key, val);
    } catch (e) {}
  },
  deleteItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (e) {}
  },
};

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Ignore request error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await storage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${baseURL}/auth/refresh`, {
            token: refreshToken,
          });
          const newToken = data.tokens?.accessToken || data.token;
          await storage.setItem('userToken', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await storage.deleteItem('userToken');
        await storage.deleteItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

// Competition Endpoints
export const getCompetitionDetails = async (id = 'active') => {
  const response = await api.get(`/competitions/${id}`);
  return response.data;
};

export const getAllCompetitions = async () => {
  const response = await api.get('/competitions/all');
  return response.data;
};

export const createCompetition = async (payload) => {
  const response = await api.post('/competitions', payload);
  return response.data;
};

export const updateCompetition = async (id, payload) => {
  const response = await api.put(`/competitions/${id}`, payload);
  return response.data;
};

export const deleteCompetition = async (id) => {
  const response = await api.delete(`/competitions/${id}`);
  return response.data;
};

export const getAdminParticipants = async () => {
  const response = await api.get('/admin/participants');
  return response.data;
};

export const getCompetitionStatus = async (id = 'active') => {
  const response = await api.get(`/competitions/${id}/status`);
  return response.data;
};

// Registration Endpoints
export const registerForCompetition = async (compId) => {
  const response = await api.post(`/competitions/${compId}/register`);
  return response.data;
};

export const checkRegistration = async (compId) => {
  const response = await api.get(`/users/me/registration/${compId}`);
  return response.data;
};

// Submission Endpoints
export const submitEntry = async (compId, formData, onProgress) => {
  const response = await api.post(`/competitions/${compId}/submissions`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

export const getSubmission = async (compId) => {
  const response = await api.get(`/competitions/${compId}/submissions/me`);
  return response.data;
};

export const updateSubmission = async (compId, formData, onProgress) => {
  const response = await api.put(`/competitions/${compId}/submissions/me`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

// Authentication Endpoints
export const signup = async (payload) => {
  const dataToSend = typeof payload === 'string'
    ? { username: arguments[0], password: arguments[1] }
    : payload;
  const response = await api.post('/auth/signup', dataToSend);
  const token = response.data.tokens?.accessToken || response.data.token;
  const refreshToken = response.data.tokens?.refreshToken || response.data.refreshToken;
  if (token) await storage.setItem('userToken', token);
  if (refreshToken) await storage.setItem('refreshToken', refreshToken);
  return response.data;
};

export const login = async (payload) => {
  const dataToSend = typeof payload === 'string'
    ? { username: arguments[0], password: arguments[1] }
    : payload;
  const response = await api.post('/auth/login', dataToSend);
  const token = response.data.tokens?.accessToken || response.data.token;
  const refreshToken = response.data.tokens?.refreshToken || response.data.refreshToken;
  if (token) await storage.setItem('userToken', token);
  if (refreshToken) await storage.setItem('refreshToken', refreshToken);
  return response.data;
};

export const refreshAuthToken = async () => {
  const refreshToken = await storage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');
  const response = await axios.post(`${baseURL}/auth/refresh`, {
    token: refreshToken,
  });
  const newToken = response.data.tokens?.accessToken || response.data.token;
  if (newToken) await storage.setItem('userToken', newToken);
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {}
  await storage.deleteItem('userToken');
  await storage.deleteItem('refreshToken');
};
