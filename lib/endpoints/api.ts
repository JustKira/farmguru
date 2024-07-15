import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { BACKEND_API } from '..';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: BACKEND_API,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItem('refreshToken');
      try {
        const response = await axios.post(`${BACKEND_API}/refresh`, { refreshToken });
        const { accessToken } = response.data;
        await SecureStore.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, handle logout
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');

        router.push('/autherror');

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
