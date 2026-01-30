// src/context/AuthContext.js - Authentication Context
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          // Optionally verify token with backend and refresh stored user
          const profile = await authAPI.getProfile();
          // `authAPI.getProfile()` returns `response.data` from axios; backend returns { success: true, data: user }
          const resolvedUser = profile?.data ?? profile?.user ?? profile;
          if (resolvedUser) {
            setUser(resolvedUser);
            localStorage.setItem('user', JSON.stringify(resolvedUser));
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      // Immediately hydrate with full profile (includes stats)
      const profile = await authAPI.getProfile();
      const resolvedUser = profile?.data ?? profile?.user ?? response.user;
      setUser(resolvedUser);
      localStorage.setItem('user', JSON.stringify(resolvedUser));
      setIsAuthenticated(true);
      addToast('Registration successful!', 'success');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      addToast(errorMessage, 'error');
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      // Fetch full profile so stats & preferences are up to date
      const profile = await authAPI.getProfile();
      const resolvedUser = profile?.data ?? profile?.user ?? response.user;
      setUser(resolvedUser);
      localStorage.setItem('user', JSON.stringify(resolvedUser));
      setIsAuthenticated(true);
      addToast('Login successful!', 'success');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      addToast(errorMessage, 'error');
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    addToast('Logged out successfully', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      addToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Update failed';
      addToast(errorMessage, 'error');
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
