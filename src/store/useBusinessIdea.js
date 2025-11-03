import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

const useBusinessIdeaStore = create(
  persist(
    (set, get) => ({
      businessIdeas: null,
      loading: false,
      error: null,
      getBusinessIdeas: async (id) => {
        try {
          console.log("📡 Fetching business idea by ID:", id);
          const res = await apiRequest(`business-idea/${id}`, 'GET');
          const data = res?.data || {}; //

          set({ businessIdea: data }); //
          return data;
        } catch (err) {
          console.error("Error fetching business idea:", err);
        }
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
