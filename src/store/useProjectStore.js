import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';
import useAuthStore from './useAuthStore';

// const createEmptyLevels = () => [
//   { id: 1, completed: false,  data: {} },
//   { id: 2, completed: false,  data: {} },
//   { id: 3, completed: false,  data: {} },
//   { id: 4, completed: false,  data: {} },
//   { id: 5, completed: false,  data: {} },
//   { id: 6, completed: false,  data: {} },
//   { id: 7, completed: false,  data: {
//       checklist: {
//         social: false,
//         photos: false,
//         payment: false,
//         offer: false,
//         delivery: false,
//         price: false,
//         feedback: false,
//         schedule: false,
//       }
//     }
//   }
// ];

const useProjectStore = create(
  persist((set, get) => ({
    projects: [],
    getAllprojects: async (userId) => {
      try {
        const res = await apiRequest(`project/${userId}`, 'GET');
        console.log('API response:', res.data);
        set({ projects: res.data || [] });
      } catch (error) {
        console.error('Error fetching projects:', error);
        set({ projects: [] });
      }
    },
    addProject: async (user, title) => {
      const res = await apiRequest('project', 'POST', {
        user,
        title,
      });
      set((state) => ({ projects: [...state.projects, res.data] }));
    },
    // updateProject: (id, updates) =>
    //   set((state) => ({
    //     projects: state.projects.map((p) =>
    //       p.id === id ? { ...p, ...updates } : p
    //     ),
    //   })),
    getProject: async (id) => {
      const res = await apiRequest('project', 'GET', { id });
      return res.data || {};
    },
  })
  )
);


export default useProjectStore;