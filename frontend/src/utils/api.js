import axios from 'axios';

// Базовый URL вашего Django API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для добавления токена к каждому запросу
// Поддержка: JWT (access_token, Bearer) и DRF Token (token, Token) от api/accounts/login/
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    const drfToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (drfToken) {
      config.headers.Authorization = `Token ${drfToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если ошибка 401 (неавторизован)
    if (error.response?.status === 401) {
      // Очищаем токены и перенаправляем на логин
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Перенаправляем на страницу входа
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;