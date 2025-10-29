import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      // === REGISTER ===
      register: async (name, username, email, password) => {
        try {
          const res = await apiRequest('register', 'POST', {
            name,
            username,
            email,
            password,
          });

          // backend kamu mengembalikan: { message, data: newUser }
          const user = res.data;

          if (!user) throw new Error('Invalid response from server');

          set({
            isAuthenticated: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              username: user.username,
            },
          });

          return { success: true, message: res.message };
        } catch (error) {
          console.error('Registration failed:', error.message);
          return { success: false, message: error.message };
        }
      },

      // === LOGIN ===
      login: async (username, password) => {
        try {
          const res = await apiRequest('login', 'POST', {
            username,
            password
          });

          console.log('Response dari API:', res)

          // backend kamu mengembalikan: { message, data: { username, email } }
          const userData = res.data;

          if (!userData) throw new Error('Invalid response from server');

          set({
            isAuthenticated: true,
            user: {
              id: userData._id,
              name: userData.name,
              username: userData.username,
              email: userData.email,
            },
          });

          return { success: true, message: res.message || 'Login successful', user: userData };
        } catch (error) {
          console.error('Login failed:', error.message);
          return { success: false, message: error.message };
        }
      },

      // === LOGOUT ===
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    // {
    //   name: 'auth-storage', // disimpan di localStorage
    //   partialize: (state) => ({
    //     isAuthenticated: state.isAuthenticated,
    //     user: state.user,
    //   }),
    // }
  )
);
