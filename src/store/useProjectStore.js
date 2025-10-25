import { create } from 'zustand';

const useProjectStore = create((set) => ({
  projects: [],
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      )
    })),
}));

export default useProjectStore;