import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';
import {jwtDecode} from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
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

    login: async (username, password) => {
      try {
        const res = await apiRequest("login", "POST", { username, password });
        const { data } = res;

        // tidak perlu token, karena disimpan di cookie
        set({
          isAuthenticated: true,
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
          },
        });

        return { success: true, message: res.message, user: data };
      } catch (error) {
        console.error("Login failed:", error.message);
        return { success: false, message: error.message };
      }
    },



      // === CEK SESSION DARI BACKEND ===
      loadSession: async () => {
        try {
          const res = await apiRequest("me", "GET"); // backend harus sediakan endpoint /me
          if (res.user) {
            set({
              user: res.user,
              isAuthenticated: true,
              isHydrated: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isHydrated: true,
            });
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isHydrated: true,
          });
        }
      },

  // === LOGOUT ===
    logout: async () => {
      await apiRequest("logout", "POST"); // backend hapus cookie
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });
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
