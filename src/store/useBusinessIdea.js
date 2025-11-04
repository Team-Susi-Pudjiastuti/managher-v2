import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

const useBusinessIdeaStore = create(
  persist(
    (set, get) => ({
      businessIdeas: [],
      loading: false,
      error: null,

      getBusinessIdeas: async (id) => {
        const res = await apiRequest(`business-idea/${id}`, 'GET');
        const ideas = res.data || [];
        set({ businessIdeas: ideas });
        return ideas;
      },

      updateBusinessIdeas: async (id, updateData) => {
        const res = await apiRequest(`business-idea/${id}`, 'PUT', updateData);
        const updates = res.data || {};
        set((state) => ({
          businessIdeas: Array.isArray(state.businessIdeas) 
            ? state.businessIdeas.map((p) => p._id === id ? { ...p, ...updates } : p)
            : []
        }));
        return updates;
      },


    }),
  )
);

export default useBusinessIdeaStore;
