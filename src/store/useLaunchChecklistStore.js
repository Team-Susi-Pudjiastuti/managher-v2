import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/api';

const CHECKLIST_ITEMS = [
  'social', 'photos', 'payment', 'offer',
  'delivery', 'price', 'feedback', 'schedule'
];

const createDefaultChecklist = () =>
  CHECKLIST_ITEMS.reduce((acc, id) => ({ ...acc, [id]: false }), {});

export const useLaunchChecklistStore = create(
  persist(
    (set, get) => ({
      checklist: createDefaultChecklist(),
      loading: false,
      error: null,

      fetchChecklist: async (projectId) => {
        if (!projectId) {
          set({ checklist: createDefaultChecklist() });
          return;
        }
        set({ loading: true, error: null });
        try {
          const res = await apiRequest(`launch/${projectId}`, 'GET');
          const rawChecklist = res.data || {};
          const normalized = {};
          CHECKLIST_ITEMS.forEach(id => {
            normalized[id] = !!rawChecklist[id];
          });
          set({ checklist: normalized, loading: false });
        } catch (err) {
          console.error('Gagal fetch checklist:', err);
          set({
            error: err.message || 'Gagal memuat',
            checklist: createDefaultChecklist(),
            loading: false
          });
        }
      },

      saveChecklist: async (projectId, checklist) => {
        if (!projectId) throw new Error('Project ID diperlukan');
        set({ loading: true, error: null });
        try {
          await apiRequest(`launch/${projectId}`, 'PUT', { data: checklist });
          set({ checklist, loading: false });
        } catch (err) {
          console.error('Gagal simpan checklist:', err);
          set({ error: err.message || 'Gagal menyimpan', loading: false });
          throw err;
        }
      },

      toggleItem: async (projectId, itemId) => {
        if (!CHECKLIST_ITEMS.includes(itemId)) return;
        const current = get().checklist;
        const newChecklist = { ...current, [itemId]: !current[itemId] };
        set({ checklist: newChecklist });
        await get().saveChecklist(projectId, newChecklist);
      },
    }),
    {
      name: 'launch-checklist-storage',
      partialize: (state) => ({ checklist: state.checklist }),
    }
  )
);