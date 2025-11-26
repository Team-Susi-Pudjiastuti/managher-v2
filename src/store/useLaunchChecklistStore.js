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
      checklist: createDefaultChecklist(),

      toggleItem: (projectId, itemId) => {
        if (!CHECKLIST_ITEMS.includes(itemId)) return;
        const current = get().checklist;
        const newChecklist = { ...current, [itemId]: !current[itemId] };
        set({ checklist: newChecklist });
      },
    }),
    {
      name: 'launch-checklist-storage',
      partialize: (state) => ({ checklist: state.checklist }),
    }
  )
);