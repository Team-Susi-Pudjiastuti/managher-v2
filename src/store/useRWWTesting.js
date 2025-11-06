import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

const useRWWTestingStore = create(
  persist(
    (set, get) => ({
      rwwTesting: [],
      getRWWTesting: async (projectId) => {
        try {
          const res = await apiRequest(`rww-testing/${projectId}`, 'GET');
          const rwwTesting = res.data || [];
          set({ rwwTesting });
          return rwwTesting;
        } catch (error) {
          console.error('Error fetching RWW data:', error);
          return [];
        }
      },
      updateRWWTesting: async (id, updateData) => {
        try {
          const res = await apiRequest(`rww-testing/${id}`, 'PUT', updateData);
          const updated = res.data?.data || {};
          set((state) => ({
            rwwTesting: Array.isArray(state.rwwTesting)
              ? state.rwwTesting.map((p) => (p._id === id ? updated : p))
              : []
          }));
        } catch (error) {
          console.error('Error updating RWW:', error);
        }
      },
      addRWWTesting: async (data) => {
        try {
          // Pastikan data berisi real, win, worth sebagai array
          const res = await apiRequest(`rww-testing`, 'POST', data);
          const newData = res.data?.data || {};
          set((state) => ({
            rwwTesting: [...(state.rwwTesting || []), newData]
          }));
        } catch (error) {
          console.error('Error adding RWW:', error);
        }
      },
    }),
    {
      name: 'rww-testing-storage',
    }
  )
);

export default useRWWTestingStore;