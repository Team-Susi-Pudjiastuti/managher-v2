import { create } from 'zustand';

const createEmptyLevels = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    if (id === 7) {
      return {
        id,
        completed: false,
        data: {
          checklist: {
            social: false,
            photos: false,
            payment: false,
            offer: false,
            delivery: false,
            price: false,
            feedback: false,
            schedule: false,
          }
        }
      };
    }
    return {
      id,
      completed: false,
      data: {}
    };
  });
};

const useProjectStore = create((set, get) => ({
  projects: [],

  addProject: (project) => {
    const newProject = {
      ...project,
      levels: project.levels || createEmptyLevels(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  getProject: (id) => get().projects.find((p) => p.id === id),

  // 🔴 Fungsi HAPUS PROYEK
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));

if (typeof window !== 'undefined') {
  useProjectStore.subscribe(() => {
    localStorage.setItem('managher_projects', JSON.stringify(useProjectStore.getState().projects));
  });

  const saved = localStorage.getItem('managher_projects');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const projects = parsed.map((p) => {
        let levels = p.levels;
        if (!levels || levels.length !== 12) {
          levels = createEmptyLevels();
          if (Array.isArray(p.levels)) {
            p.levels.forEach((savedLevel) => {
              const existing = levels.find(l => l.id === savedLevel.id);
              if (existing) {
                existing.completed = savedLevel.completed || false;
                existing.data = savedLevel.data || {};
              }
            });
          }
        }
        return { ...p, levels };
      });
      useProjectStore.setState({ projects });
    } catch (e) {
      console.warn('Gagal memuat proyek dari localStorage:', e);
    }
  }
}

export default useProjectStore;