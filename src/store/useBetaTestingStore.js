// store/useBetaTestingStore.js
import { create } from 'zustand';
import { apiRequest } from '@/lib/api';

export const useBetaTestingStore = create((set, get) => ({
  responses: [],
  loading: false,
  error: null,

  fetchResponses: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest(`beta-testing/${projectId}`, 'GET');
      set({
        responses: Array.isArray(data.responses) ? data.responses : [],
        loading: false,
      });
    } catch (err) {
      console.error('Gagal fetch beta testing:', err);
      set({ error: err.message || 'Gagal memuat data', loading: false });
    }
  },

  saveResponses: async (projectId, responses) => {
    set({ loading: true, error: null });
    try {
      await apiRequest(`beta-testing/${projectId}`, 'PUT', { responses });
      set({ loading: false });
    } catch (err) {
      console.error('Gagal simpan beta testing:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },
}));