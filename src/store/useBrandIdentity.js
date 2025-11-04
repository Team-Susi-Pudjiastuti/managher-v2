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
          set({ brandIdentity: res.data || {} });
          return res.data;
        } catch (error) {
          console.error('Error fetching brand identity:', error);
        }
      },
      updateBrandIdentity: async (id, data) => {
        try {
          const res = await apiRequest(`brand-identity/${id}`, 'PUT', data);
          set((state) => ({ brandIdentity: { ...state.brandIdentity, ...res.data } }));
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