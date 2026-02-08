import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
// Ensure axios points to the backend API during development
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
import { useRouter } from 'next/router';

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (t) {
      setToken(t);
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    }
  }, []);

  const login = (t: string) => {
    setToken(t);
    localStorage.setItem('token', t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    router.push('/admin/dashboard');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
