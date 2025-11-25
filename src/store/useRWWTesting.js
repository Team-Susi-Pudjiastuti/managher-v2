import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

const useRWWTestingStore = create(
  persist(
    (set, get) => ({
      responses: [],
      loading: false,
      error: null,

      getRWWTesting: async (projectId) => {
        try {
          const data = await apiRequest(`rww-testing/${projectId}`, 'GET');
          let responses = [];
          if (Array.isArray(data)) {
            responses = data;
          } else if (Array.isArray(data.responses)) {
            responses = data.responses;
          } else if (Array.isArray(data.data)) {
            responses = data.data;
          } else if (data && typeof data === 'object' && Array.isArray(data.responses)) {
            responses = data.responses;
          };
          // Normalisasi _id jadi id (string)
          const normalized = responses.map(item => ({
            ...item,
            id: (item._id?.$oid || item._id || String(item._id)) || Date.now() + Math.random()
          }));

          set({ responses: normalized, loading: false });
          return normalized;
        } catch (error) {
          console.error('Error fetching RWW data:', error);
          set({ error: err.message || 'Gagal memuat data', loading: false });
        }
      },
      // updateRWWTesting: async (id, updateData) => {
      //   try {
      //     const res = await apiRequest(`rww-testing/${id}`, 'PUT', updateData);
      //     const updated = res.data?.data || {};
      //     set((state) => ({
      //       rwwTesting: Array.isArray(state.rwwTesting)
      //         ? state.rwwTesting.map((p) => (p._id === id ? updated : p))
      //         : []
      //     }));
      //   } catch (error) {
      //     console.error('Error updating RWW:', error);
      //   }
      // },
      addRWWTesting: async (projectId, responses) => {
        set({ loading: true, error: null });
        try {
          await apiRequest(`rww-testing/${projectId}`,'PATCH',{ responses });
          set({ loading: false });
        } catch (err) {
          console.error('Gagal simpan beta testing:', err);
          set({ error: err.message || 'Gagal menyimpan', loading: false });
          throw err;
        }
      },
      

    }),
    {
      name: 'rww-testing-storage',
    }
  )
);

export default useRWWTestingStore;