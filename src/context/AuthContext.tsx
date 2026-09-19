import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.ts';
import { Address, User } from '../types.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { name?: string; phone?: string; addresses?: Address[] }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('zikala_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize user to localStorage and verify session on load
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('zikala_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('zikala_user');
      }
    } catch (e) {
      console.warn('Auth local storage sync error', e);
    }
  }, [user]);

  // Verify token on mount
  useEffect(() => {
    const token = api.getToken();
    if (token && !user) {
      api
        .getMe()
        .then((verifiedUser) => {
          setUser(verifiedUser);
        })
        .catch(() => {
          api.setToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, phone, pass);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    setIsLoading(true);
    try {
      const res = await api.login('admin@zikala.com', 'admin123');
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoUser = async () => {
    setIsLoading(true);
    try {
      const res = await api.login('demo@zikala.com', 'demo123');
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('zikala_user');
  };

  const updateProfile = async (updates: { name?: string; phone?: string; addresses?: Address[] }) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await api.updateProfile(updates);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        login,
        register,
        loginAsAdmin,
        loginAsDemoUser,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
