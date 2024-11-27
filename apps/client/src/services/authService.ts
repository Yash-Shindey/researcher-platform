import axios from 'axios';
import { API_URL } from '../config/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string) {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
  }
};
