import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CHECKLIST_ITEMS = [
  'social', 'photos', 'payment', 'offer',
  'delivery', 'price', 'feedback', 'schedule'
];

const createDefaultChecklist = () =>
  CHECKLIST_ITEMS.reduce((acc, id) => ({ ...acc, [id]: false }), {});

export const useLaunchChecklistStore = create(
  persist(
    (set, get) => ({
      // State: { [projectId]: checklist }
      checklistByProject: {},

      // Getter: ambil checklist untuk project tertentu
      getChecklist: (projectId) => {
        const state = get().checklistByProject[projectId];
        return state || createDefaultChecklist();
      },

      // Setter: simpan checklist untuk project tertentu
      setChecklistForProject: (projectId, checklist) => {
        set((state) => ({
          checklistByProject: {
            ...state.checklistByProject,
            [projectId]: checklist,
          },
        }));
      },

      // Toggle item untuk project tertentu
      toggleItem: (projectId, itemId) => {
        if (!CHECKLIST_ITEMS.includes(itemId)) return;

        const currentChecklist = get().getChecklist(projectId);
        const newChecklist = {
          ...currentChecklist,
          [itemId]: !currentChecklist[itemId],
        };

        get().setChecklistForProject(projectId, newChecklist);
      },

      // Inisialisasi project (opsional, tapi aman)
      initProjectChecklist: (projectId) => {
        const current = get().checklistByProject;
        if (!current[projectId]) {
          get().setChecklistForProject(projectId, createDefaultChecklist());
        }
      },
    }),
    {
      name: 'launch-checklist-storage-v2', // ganti nama agar tidak bentrok dengan versi lama
      partialize: (state) => ({ checklistByProject: state.checklistByProject }),
    }
  )
);