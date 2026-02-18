import api from '../utils/api';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const AUTH_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth'; // jwt/refresh, jwt/verify

class AuthService {
  // Регистрация (Djoser) + автоматический вход по JWT
  async register(userData) {
    try {
      await api.post(`${API_BASE_URL}/accounts/auth/users/`, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        re_password: userData.re_password || userData.password,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
      });

      // Сразу логиним по JWT, чтобы пользователь был авторизован
      const loginResult = await this.login(userData.username, userData.password);
      if (loginResult.success) {
        return {
          success: true,
          user: loginResult.user,
          message: 'Регистрация успешна. Вы вошли в систему.',
        };
      }
      return {
        success: true,
        message: 'Регистрация успешна. Войдите в систему.',
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // Вход в систему через JWT (username + password)
  async login(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/jwt/create/`, {
        username,
        password,
      });

      if (!response.data.access || !response.data.refresh) {
        return { success: false, error: 'Неверный ответ сервера' };
      }

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Загружаем профиль пользователя по JWT (api подставит Bearer token)
      const profileRes = await api.get('accounts/profile/');
      const userData = profileRes.data;
      const user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        is_admin: userData.is_admin,
      };
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, data: response.data, user };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // Обновление токена доступа
  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    
    if (!refresh) {
      throw new Error('Refresh token не найден');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
        refresh,
      });

      if (response.data.access) {
        // Сохраняем новый токен доступа
        localStorage.setItem('access_token', response.data.access);
        
        // Обновляем информацию о пользователе, если есть
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return {
        success: true,
        data:response.data,
      };
    } catch (error) {
      // Если обновление токена не удалось, очищаем данные
      this.logout();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
  }

  // Выход из системы (JWT: просто очищаем токены)
  async logout() {
    this.clearAuthData();

    return {
      success: true,
      message: 'Вы успешно вышли из системы',
    };
  }

  // Получение текущего пользователя
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Проверка авторизации
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // Получение токена доступа
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Получение токена обновления
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  // Очистка данных аутентификации (JWT + старый DRF token)
  clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Обработка ошибок
  handleError(error) {
    if (error.response) {
      // Сервер вернул ошибку
      if (error.response.data) {
        // Проверяем различные форматы ошибок
        if (error.response.data.non_field_errors) {
          return error.response.data.non_field_errors.join(', ');
        }
        if (error.response.data.detail) {
          return error.response.data.detail;
        }
        if (error.response.data.email) {
          return `Email: ${error.response.data.email.join(', ')}`;
        }
        if (error.response.data.username) {
          return `Имя пользователя: ${error.response.data.username.join(', ')}`;
        }
        if (error.response.data.password) {
          return `Пароль: ${error.response.data.password.join(', ')}`;
        }
        // Возвращаем первую ошибку из полей
        const fieldErrors = Object.values(error.response.data)[0];
        if (Array.isArray(fieldErrors)) {
          return fieldErrors.join(', ');
        }
      }
      return `Ошибка ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Нет ответа от сервера
      return 'Сервер недоступен. Проверьте подключение к интернету.';
    } else {
      // Ошибка при настройке запроса
      return error.message || 'Произошла неизвестная ошибка';
    }
  }
}

export default new AuthService();