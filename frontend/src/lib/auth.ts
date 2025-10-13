// src/lib/auth.ts
import api from './api';

export const authClient = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const authHelpers = {
  signIn: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  signUp: async (email: string, password: string, userData: any) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name: userData.name,
        role: userData.role || 'viewer'
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  },

  signOut: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  hasRole: (user: any, role: string) => {
    return user?.role === role;
  },

  hasAnyRole: (user: any, roles: string[]) => {
    return roles.includes(user?.role);
  },

  isAdmin: (user: any) => {
    return user?.role === 'admin';
  },

  isManagerOrAdmin: (user: any) => {
    return user?.role === 'admin' || user?.role === 'manager';
  }
};

export default authClient;