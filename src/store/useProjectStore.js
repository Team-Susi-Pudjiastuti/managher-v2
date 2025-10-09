// src/store/useProjectStore.js
import { create } from 'zustand';

const useProjectStore = create((set, get) => ({
  // === Daftar Proyek ===
  projects: [
    { id: '1', name: 'Kafe Cantik', manager: 'Rina S.', imageUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg' },
    { id: '2', name: 'Online Store Fashion', manager: 'Dewi A.', imageUrl: 'https://images.pexels.com/photos/5585793/pexels-photo-5585793.jpeg' },
  ],

  // === Proyek yang sedang aktif ===
  currentProject: null,

  // === Data per proyek per fase ===
  // Struktur: { [projectId]: { plan: { ... }, sell: { ... }, scaleUp: { ... } } }
  projectData: {},

  // --- Actions ---

  // Tambah proyek baru
  addProject: (project) =>
    set((state) => {
      const newId = Date.now().toString();
      const newProject = {
        ...project,
        id: newId,
        imageUrl: project.imageUrl || '/only-one-red-shoes.png',
      };
      return {
        projects: [...state.projects, newProject],
      };
    }),

  // Edit proyek (nama, manajer, imageUrl)
  updateProject: (id, updatedFields) =>
    set((state) => ({
      projects: state.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updatedFields } : proj
      ),
    })),

  // Hapus proyek + semua datanya
  deleteProject: (id) =>
    set((state) => {
      // Hapus dari daftar proyek
      const updatedProjects = state.projects.filter((proj) => proj.id !== id);
      
      // Hapus data terkait dari projectData
      const updatedProjectData = { ...state.projectData };
      delete updatedProjectData[id];

      // Jika proyek yang dihapus sedang aktif, reset currentProject
      let updatedCurrentProject = state.currentProject;
      if (state.currentProject?.id === id) {
        updatedCurrentProject = updatedProjects.length > 0 ? updatedProjects[0] : null;
      }

      return {
        projects: updatedProjects,
        projectData: updatedProjectData,
        currentProject: updatedCurrentProject,
      };
    }),

  // Set proyek aktif
  setCurrentProject: (projectId) => {
    const project = get().projects.find((p) => p.id === projectId);
    set({ currentProject: project || null });
  },

  // Update data fase tertentu untuk proyek
  updatePhaseData: (projectId, phaseKey, data) =>
    set((state) => {
      const current = state.projectData[projectId] || {};
      return {
        projectData: {
          ...state.projectData,
          [projectId]: {
            ...current,
            [phaseKey]: { ...current[phaseKey], ...data },
          },
        },
      };
    }),

  deletePhaseData: (projectId, phaseKey) => {
    set((state) => {
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        if (project.data && project.data[phaseKey]) {
          delete project.data[phaseKey];
        }
      }
      return { projects: [...state.projects] };
    });
  },

  // Ambil data fase tertentu
  getPhaseData: (projectId, phaseKey) => {
    return get().projectData[projectId]?.[phaseKey] || {};
  },

  // Shortcut: Ambil data Ide Bisnis (bagian dari plan)
  getBusinessIdea: (projectId) => {
    return get().getPhaseData(projectId, 'businessIdea');
  },

  // Shortcut: Simpan Ide Bisnis
  saveBusinessIdea: (projectId, ideaData) => {
    get().updatePhaseData(projectId, 'businessIdea', ideaData);
  },

  // Reset semua data (opsional, untuk dev)
  resetAll: () => set({ projectData: {}, currentProject: null }),
}));

export default useProjectStore;