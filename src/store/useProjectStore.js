'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../lib/api';

const useProjectStore = create(
  persist(
    (set, get) => ({
      project: {},
      projects: [],
      phases: [],
      levels: [],
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

      getProject: async (id) => {
        try {
          const res = await apiRequest(`project/detail/${id}`, 'GET');
          const project = res.data || {};
          set({ project });
          return project;
        } catch (error) {
          console.error('Error fetching project:', error);
          return {};
        }
      },

      addProject: async (user, title) => {
        try {
          const res = await apiRequest('project', 'POST', { user, title });
          const newProject = res.data;
          set((state) => ({ projects: [...state.projects, newProject] }));
          return newProject;
        } catch (error) {
          console.error('Error adding project:', error);
          throw error;
        }
      },

      getPhases: async (projectId) => {
        try {
          const res = await apiRequest(`phase/${projectId}`, 'GET');
          const phases = res.data || [];
          set({ phases });
          return phases;
        } catch (error) {
          console.error('Error fetching phases:', error);
          return [];
        }
      },

      getLevels: async (projectId) => {
        try {
          const res = await apiRequest(`level/${projectId}`, 'GET');
          const levels = res.data || [];

          const planLevels = levels.filter(l => l.phase?.name === 'plan') || [];
          const sellLevels = levels.filter(l => l.phase?.name === 'sell') || [];
          const scaleUpLevels = levels.filter(l => l.phase?.name === 'scale_up') || [];

          set({ levels, planLevels, sellLevels, scaleUpLevels });
          return levels;
        } catch (error) {
          console.error('Error fetching levels:', error);
          set({ levels: [], planLevels: [], sellLevels: [], scaleUpLevels: [] });
          return [];
        }
      },

      updateLevelStatus: async (id, updates) => {
        try {
          const res = await apiRequest(`level/${id}`, 'PUT', updates);
          const updatedLevel = res.data;

          set((state) => {
            const newLevels = state.levels.map((l) =>
              l._id === id ? { ...l, ...updatedLevel } : l
            );

            const planLevels = newLevels.filter(l => l.phase?.name === 'plan') || [];
            const sellLevels = newLevels.filter(l => l.phase?.name === 'sell') || [];
            const scaleUpLevels = newLevels.filter(l => l.phase?.name === 'scale_up') || [];

            return { levels: newLevels, planLevels, sellLevels, scaleUpLevels };
          });

          return updatedLevel;
        } catch (error) {
          console.error('Error updating level status:', error);
          throw error;
        }
      },

      deleteProject: async (projectId) => {
        try {
          await apiRequest(`project/${projectId}`, 'DELETE');
          set((state) => ({
            projects: state.projects.filter((p) => p._id !== projectId),
          }));
        } catch (error) {
          console.error('Error deleting project:', error);
          throw error;
        }
      },
    }),
    {
      name: 'project-storage',
    }
  )
);

export default useProjectStore;