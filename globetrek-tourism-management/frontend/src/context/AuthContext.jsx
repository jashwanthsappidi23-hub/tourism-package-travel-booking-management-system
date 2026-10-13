import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(api.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err);
          api.setToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    api.setToken(data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    api.setToken(data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const demoLogin = async (roleName) => {
    const data = await api.demoLogin(roleName);
    api.setToken(data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    isAdmin: user?.role === 'Administrator',
    isGuide: user?.role === 'Guide',
    isCustomer: user?.role === 'Customer',
    login,
    register,
    demoLogin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
