import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión desde localStorage
    const savedUser = localStorage.getItem('harmony_user');
    const token = localStorage.getItem('harmony_token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error al restaurar usuario:', err);
        localStorage.removeItem('harmony_user');
        localStorage.removeItem('harmony_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem('harmony_token', data.token);
      localStorage.setItem('harmony_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setUser(null);
      localStorage.removeItem('harmony_token');
      localStorage.removeItem('harmony_user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('harmony_token');
    localStorage.removeItem('harmony_user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
