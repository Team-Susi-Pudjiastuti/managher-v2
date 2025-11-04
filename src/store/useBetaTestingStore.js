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
      
      let responses = [];
      if (Array.isArray(data)) {
        responses = data;
      } else if (Array.isArray(data.responses)) {
        responses = data.responses;
      } else if (Array.isArray(data.data)) {
        responses = data.data;
      } else if (data && typeof data === 'object' && Array.isArray(data.responses)) {
        responses = data.responses;
      }

      // Normalisasi _id jadi id (string)
      const normalized = responses.map(item => ({
        ...item,
        id: (item._id?.$oid || item._id || String(item._id)) || Date.now() + Math.random()
      }));

      set({ responses: normalized, loading: false });
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