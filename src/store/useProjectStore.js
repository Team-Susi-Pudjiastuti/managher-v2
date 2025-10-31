import { create } from 'zustand';

const createEmptyLevels = () => [
  { id: 1, completed: false,  data: {} },
  { id: 2, completed: false,  data: {} },
  { id: 3, completed: false,  data: {} },
  { id: 4, completed: false,  data: {} },
  { id: 5, completed: false,  data: {} },
  { id: 6, completed: false,  data: {} },
  { id: 7, completed: false,  data: {
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
  }
];

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
  getProject: (id) => get().projects.find(p => p.id === id),
}));

// Auto-persist
if (typeof window !== 'undefined') {
  useProjectStore.subscribe(() => {
    localStorage.setItem('managher_projects', JSON.stringify(useProjectStore.getState().projects));
  });
  const saved = localStorage.getItem('managher_projects');
  if (saved) {
    try {
      const projects = JSON.parse(saved).map(p => ({
        ...p,
        levels: p.levels && p.levels.length >= 7 ? p.levels : createEmptyLevels()
      }));
      useProjectStore.setState({ projects });
    } catch (e) {
      console.warn('Failed to load projects');
    }
  }
}

export default useProjectStore;