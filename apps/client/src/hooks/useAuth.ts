import { create } from 'zustand';
import api from '../services/api';

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  initialize: () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('accessToken');
    if (userEmail && token) {
      set({ user: { email: userEmail }, isAuthenticated: true });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userEmail', email);
      set({ user: { email }, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userEmail', email);
      set({ user: { email }, isAuthenticated: true });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    set({ user: null, isAuthenticated: false });
  }
}));

// Initialize auth state
useAuth.getState().initialize();

export default useAuth;
