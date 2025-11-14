import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserFromToken, isAuthenticated, setToken, clearToken } from '@/utils/auth';


const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (isAuthenticated()) {
        const userData = getUserFromToken();
        setUser(userData);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token) => {
    setToken(token);
    const userData = getUserFromToken();
    setUser(userData);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes('ADMIN') || false,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};