import { create } from 'zustand';
import { apiRequest } from '@/lib/api';

export const useLeanCanvasStore = create((set, get) => ({
  canvas: {
    problem: '',
    solution: '',
    keyMetrics: '',
    uniqueValueProposition: '',
    unfairAdvantage: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: '',
  },
  loading: false,
  error: null,

  setCanvas: (data) => set({ canvas: data }),

  // src/store/useProjectStore.js
  fetchLeanCanvas: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest(`lean-canvas/${projectId}`, 'GET');
      let source = {};

      if (data.leanCanvas) {
        // dari DB langsung
        source = data.leanCanvas;
      } else if (data.initialData && data.isFromBusinessIdea) {
        // dari hasil map Business Idea
        source = data.initialData;
      } else {
        source = data;
      }

      set({
        canvas: {
          problem: source.problem || '',
          solution: source.solution || '',
          keyMetrics: source.keyMetrics || '',
          uniqueValueProposition: source.uniqueValueProposition || '',
          unfairAdvantage: source.unfairAdvantage || '',
          channels: source.channels || '',
          customerSegments: source.customerSegments || '',
          costStructure: source.costStructure || '',
          revenueStreams: source.revenueStreams || '',
        },
        loading: false,
      });
    } catch (err) {
      console.error('Gagal memuat Lean Canvas:', err);
      set({ error: err.message || 'Gagal memuat data', loading: false });
    }
  },

  updateField: (field, value) => {
    set((state) => ({ canvas: { ...state.canvas, [field]: value } }));
  },

  updateLeanCanvas: async (projectId, updateData) => {
  set({ loading: true, error: null });
  try {
    const data = await apiRequest(`lean-canvas/${projectId}`, 'PUT', updateData);
    set({
      canvas: data.leanCanvas,
      loading: false,
    });
  } catch (err) {
    console.error('Gagal mengupdate Lean Canvas:', err);
    set({ error: err.message || 'Gagal mengupdate data', loading: false });
  }
},

  saveLeanCanvas: async (projectId) => {
    const { canvas } = get();
    set({ loading: true, error: null });
    try {
      await apiRequest(`lean-canvas/${projectId}`, 'PUT', {
        problem: canvas.problem,
        solution: canvas.solution,
        keyMetrics: canvas.keyMetrics,
        uniqueValueProposition: canvas.uniqueValueProposition,
        unfairAdvantage: canvas.unfairAdvantage,
        channels: canvas.channels,
        customerSegments: canvas.customerSegments,
        costStructure: canvas.costStructure,
        revenueStreams: canvas.revenueStreams,
      });
      set({ loading: false });
    } catch (err) {
      console.error('Gagal menyimpan:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },
}));