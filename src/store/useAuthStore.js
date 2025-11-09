import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';
import {jwtDecode} from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isHydrated: false, 

      // === REGISTER ===
      register: async (name, username, email, password) => {
        try {
          const res = await apiRequest('register', 'POST', {
            name,
            username,
            email,
            password,
          });

          // { message, data: newUser }
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

          const { token,  data } = res;

          if (!token) throw new Error('No token received from server');

          const decoded = jwtDecode(token);
          if (!decoded) throw new Error('Invalid token');

          set({
            isAuthenticated: true,
            token,
            user: {
              id: data._id,
              name: data.name,
              email: data.email,
              username: data.username,
            },
          });

          return { success: true, message: res.message, user: decoded };
        } catch (error) {
          console.error('Login failed:', error.message);
          return { success: false, message: error.message };
        }
      },

    // === LOAD TOKEN === (biar auto-login setelah reload)
    loadToken: () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const decoded = jwtDecode(savedToken);
          set({
            isAuthenticated: true,
            token: savedToken,
            user: decoded
          });
        } catch (error) {
          console.error('Token decoding failed:', error.message);
          set({ isAuthenticated: false, user: null, token: null });
        }
      } else {
        set({ isHydrated: true });
      }
    },

  // === LOGOUT ===
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, user: null, token: null });
  },
})
    // {
    //   name: 'auth-storage', // disimpan di localStorage
    //   partialize: (state) => ({
    //     isAuthenticated: state.isAuthenticated,
    //     user: state.user,
    //   }),
    // }
  )
);

export default useAuthStore;
