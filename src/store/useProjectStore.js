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
    phases: [],
    levels:[],
    planLevels: [],
    sellLevels: [],
    scaleUpLevels: [],
    getAllprojects: async (userId) => {
      try {
        const res = await apiRequest(`project/${userId}`, 'GET');
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
      const newProject = res.data;

      set((state) => ({ projects: [...state.projects, newProject] }));
     
      return newProject;
    },
    // updateProject: (id, updates) =>
    //   set((state) => ({
    //     projects: state.projects.map((p) =>
    //       p.id === id ? { ...p, ...updates } : p
    //     ),
    //   })),
    // getProject: async (projectId) => {
    //   const res = await apiRequest(`project/detail/${projectId}`, 'GET');
    //   set 
    //   return res.data || {};
    // },
    getPhases: async (projectId) => {
      const res = await apiRequest(`phase/${projectId}`, 'GET');
      const phases = res.data || [];
      set({ phases: phases });
      return phases;
    },
    getLevels: async (projectId) => {
      const res = await apiRequest(`level/${projectId}`, 'GET');
      const levels = res.data || [];
      set({ levels: levels });
      set({ planLevels: levels.filter(l => l.phase.name === 'plan') });  
      set({ sellLevels: levels.filter(l => l.phase.name === 'sell') });
      set({ scaleUpLevels: levels.filter(l => l.phase.name === 'scale_up') });  
      return levels;
    },
    deleteProject: async (projectId) => {
      await apiRequest(`project/${projectId}`, 'DELETE');
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
      }));
    },
  })
  )
);



export default useProjectStore;