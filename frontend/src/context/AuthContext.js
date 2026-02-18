import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Инициализация при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Вход в систему
  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user || result.data.user);
      }
      
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Регистрация
  const register = useCallback(async (userData) => {
    setAuthLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Выход из системы
  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      const result = await authService.logout();
      setUser(null);
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Обновление токена
  const refreshToken = useCallback(async () => {
    try {
      const result = await authService.refreshToken();
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      return result;
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      throw error;
    }
  }, [logout]);

  const value = {
    user,
    loading,
    authLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    getAccessToken: authService.getAccessToken,
    getRefreshToken: authService.getRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};