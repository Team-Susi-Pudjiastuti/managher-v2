import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

const useRWWTestingStore = create(
    persist((set, get) => ({
        rwwTesting: [],
        average: 0,
        getRWWTesting: async (projectId) => {
            const res = await apiRequest(`rww-testing/${projectId}`, 'GET');
            const rwwTesting = res.data || [];
            set({ rwwTesting });
            return rwwTesting;
        },
        updateRWWTesting: async (id, updateData) => {
            const res = await apiRequest(`rww-testing/${id}`, 'PUT', updateData);
            const updates = res.data || {};
            set((state) => ({
                rwwTesting: Array.isArray(state.rwwTesting) 
                ? state.rwwTesting.map((p) => p._id === id ? { ...p, ...updates } : p)
                : []
            }));
        },
        addRWWTesting: async (data) => {
            const res = await apiRequest(`rww-testing`, 'POST', data);
            const newData = res.data || {};
            set((state) => ({
                rwwTesting: Array.isArray(state.rwwTesting) 
                ? [...state.rwwTesting, data]
                : [data]
            }));
        }, 
        averageRWWTesting: async (projectId) => {
            const res = await apiRequest(`rww-testing/${projectId}`, 'GET');
            const rwwTesting = res.data || [];
            set({ average: rwwTesting });
            return average;
        }
    }))
);

export default useRWWTestingStore;