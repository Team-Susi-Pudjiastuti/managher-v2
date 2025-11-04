// store/usePrototypeStore.js
import { create } from 'zustand';
import { apiRequest } from '@/lib/api';

export const usePrototypeStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest(`prototype/project/${projectId}`, 'GET');
      set({
        products: Array.isArray(data.data) ? data.data : [],
        loading: false,
      });
    } catch (err) {
      console.error('Gagal fetch prototype:', err);
      set({ error: err.message || 'Gagal memuat data', loading: false });
    }
  },

  saveProducts: async (projectId, products) => {
    set({ loading: true, error: null });
    try {
      await apiRequest(`prototype/project/${projectId}`, 'PUT', { products });
      set({ loading: false });
    } catch (err) {
      console.error('Gagal simpan prototype:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },
}));