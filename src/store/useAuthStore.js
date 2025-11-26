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
            name: data.name,
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
          const res = await apiRequest("me", "GET"); 
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

     // === UPDATE PROFIL (nama, username, email) ===
    updateProfile: async (data) => {
    try {
      const res = await apiRequest('/profile', 'PUT', data);
      set({ user: res.user });
      return { success: true, message: 'Profil berhasil diperbarui', user: res.user };
    } catch (error) {
      console.error('Update profile failed:', error.message);
      return { success: false, message: error.message };
    }
  },

  // === UPLOAD FOTO PROFIL ===
  uploadAvatar: async (file) => {
    if (!file) {
      return { success: false, message: 'File tidak ditemukan' };
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`http://localhost:3000/api/avatar`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Upload gagal');
      }

      const data = await res.json();
      set({ user: data.user });
      return { success: true, message: 'Foto profil berhasil diperbarui', user: data.user };
    } catch (error) {
      console.error('Avatar upload failed:', error.message);
      return { success: false, message: error.message };
    }
  },

  // === GANTI PASSWORD ===
  changePassword: async (oldPassword, newPassword) => {
    try {
      const res = await apiRequest('change-password', 'PUT', {
        oldPassword,
        newPassword,
      });
      return { success: true, message: res.message };
    } catch (error) {
      console.error('Change password failed:', error.message);
      return { success: false, message: error.message };
    }
  },

  // === HAPUS AKUN ===
  deleteAccount: async () => {
    try {
      await apiRequest('profile', 'DELETE');
      set({ user: null, isAuthenticated: false });
      return { success: true, message: 'Akun berhasil dihapus' };
    } catch (error) {
      console.error('Delete account failed:', error.message);
      return { success: false, message: error.message };
    }
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
