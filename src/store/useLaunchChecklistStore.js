// store/useLaunchChecklistStore.js
import { create } from 'zustand';
import { apiRequest } from '@/lib/api';

export const useLaunchChecklistStore = create((set, get) => ({
  checklist: {},
  loading: false,
  error: null,

  fetchChecklist: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest(`launch/${projectId}`, 'GET');
      set({ checklist: data.checklist || {}, loading: false });
    } catch (err) {
      console.error('Gagal fetch checklist:', err);
      set({ error: err.message || 'Gagal memuat', loading: false });
    }
  },

  saveChecklist: async (projectId, checklist) => {
    set({ loading: true, error: null });
    try {
      await apiRequest(`launch/${projectId}`, 'PUT', { checklist });
      set({ loading: false });
    } catch (err) {
      console.error('Gagal simpan checklist:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },
}));