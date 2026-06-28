'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthCtx = createContext({
  isAdmin: false,
  loading: false,
  adminLogin: () => {},
  adminLogout: () => {},
});

export function AuthProvider({ children }) {
  // Start as NOT loading — only load if a token exists
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      // No token → definitely not admin, no need to hit the API
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    // Token exists → verify it
    setLoading(true);
    api.get('/auth/verify')
      .then(() => setIsAdmin(true))
      .catch(() => {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const adminLogin = (token) => {
    localStorage.setItem('admin_token', token);
    setIsAdmin(true);
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return (
    <AuthCtx.Provider value={{ isAdmin, loading, adminLogin, adminLogout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
