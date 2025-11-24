// src/store/useBrandIdentityStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/api';

const useBrandIdentityStore = create(
  persist(
    (set) => ({
      brandIdentity: {},
      getBrandIdentity: async (projectId) => {
        try {
          const res = await apiRequest(`brand-identity/${projectId}`, 'GET');
          // ✅ Ambil brandIdentity dari respons
          set({ brandIdentity: res.brandIdentity || {} });
          return res.brandIdentity;
        } catch (error) {
          console.error('Error fetching brand identity:', error);
          return null;
        }
      },
      updateBrandIdentity: async (id, data) => {
        try {
          const res = await apiRequest(`brand-identity/${id}`, 'PUT', data);
          // ✅ Ambil brandIdentity dari respons, bukan res.data
          set((state) => ({
            brandIdentity: {
              ...state.brandIdentity,
              ...res.brandIdentity, // ✅ perbarui dengan data terbaru
            },
          }));
        } catch (error) {
          console.error('Error updating brand identity:', error);
        }
      },
    }),
    {
      name: 'brand-identity-storage',
    }
  )
);

export default useBrandIdentityStore;