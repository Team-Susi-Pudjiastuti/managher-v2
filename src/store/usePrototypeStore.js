import { create } from 'zustand';
import { apiRequest } from '@/lib/api';

export const usePrototypeStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest(`prototype/${projectId}`, 'GET');
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
      await apiRequest(`prototype/${projectId}`, 'PUT', { products });
      set({ loading: false });
    } catch (err) {
      console.error('Gagal simpan prototype:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },

  updateProductImage: async (id, file) => {
    try {
      if (!file) throw new Error("File tidak ada");

      const formData = new FormData();
      formData.append("file", file);

      // pakai apiRequest tanpa Content-Type (browser akan otomatis set)
      const data = await apiRequest(`prototype/${id}/upload`, 'PATCH', formData);
      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Gagal upload image.");
      return null;
    }
  }



}));