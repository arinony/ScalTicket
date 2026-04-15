// src/store/authStore.ts
import { create } from 'zustand';
import axios from 'axios';

// Configuration de base d'Axios pour éviter les répétitions d'URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth'
});

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; newPassword?: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initialisation sécurisée depuis le localStorage
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // --- INSCRIPTION ---
  register: async (name, email, password) => {
    try {
      await api.post('/register', { 
        name, 
        email, 
        password, 
        role: 'admin' // On force le rôle admin pour ton dashboard
      });
    } catch (error) {
      throw error; // On laisse le composant gérer l'erreur avec un toast
    }
  },

  // --- CONNEXION ---
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      // Persistance
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  // --- MISE À JOUR PROFIL ---
  updateProfile: async (data) => {
    const { token } = get();
    try {
      const response = await api.put('/profile', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      throw error;
    }
  },

  // --- DÉCONNEXION ---
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
    // Optionnel : rediriger vers /login
    window.location.href = '/login';
  },
}));

// --- INTERCEPTEUR (SENIOR TIP) ---
// Ce bloc permet d'injecter automatiquement le token dans TOUTES les requêtes 
// si l'utilisateur est connecté, ce qui simplifie tes futurs appels API (Events, Tickets...)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});