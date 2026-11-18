import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  quickLogin: (role: 'customer' | 'admin') => Promise<void>;
  register: (data: { username: string; email: string; full_name: string; password: string }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('apex_user');
    const token = localStorage.getItem('apex_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('apex_user');
        localStorage.removeItem('apex_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const loggedUser = await api.login(username, password);
    setUser(loggedUser);
    localStorage.setItem('apex_user', JSON.stringify(loggedUser));
    localStorage.setItem('apex_token', loggedUser.token);
  };

  const quickLogin = async (role: 'customer' | 'admin') => {
    const username = role === 'admin' ? 'demoadmin' : 'democustomer';
    const password = role === 'admin' ? 'admin1234' : 'demo1234';
    await login(username, password);
  };

  const register = async (data: { username: string; email: string; full_name: string; password: string }) => {
    const newUser = await api.register(data);
    setUser(newUser);
    localStorage.setItem('apex_user', JSON.stringify(newUser));
    localStorage.setItem('apex_token', newUser.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('apex_user');
    localStorage.removeItem('apex_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        quickLogin,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
