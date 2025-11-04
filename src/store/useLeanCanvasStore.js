// store/useLeanCanvasStore.js
import { create } from 'zustand';
import { apiRequest } from '@/lib/api';

const initialCanvas = {
  problem: '',
  solution: '',
  customerSegments: '',
  uniqueValueProposition: '',
  unfairAdvantage: '',
  keyMetrics: '',
  channels: '',
  costStructure: '',
  revenueStreams: '',
};

export const useLeanCanvasStore = create((set, get) => ({
  canvas: { ...initialCanvas },
  loading: false,
  error: null,

  fetchLeanCanvas: async (projectId) => {
    set({ loading: true, error: null });
    try {
      // ✅ PERBAIKAN UTAMA: respons API Anda TIDAK memiliki wrapper "data"
      const data = await apiRequest(`lean-canvas/project/${projectId}`, 'GET');
      // ↑ "data" DI SINI SUDAH LANGSUNG BERISI { leanCanvas: ... } ATAU { initialData: ..., isFromBusinessIdea: true }

      let source = {};

      if (data.leanCanvas) {
        source = data.leanCanvas;
      } else if (data.initialData && data.isFromBusinessIdea) {
        source = data.initialData;
      } else {
        // Jika respons langsung berisi field Lean Canvas
        source = data;
      }

      set({
        canvas: {
          problem: source.problem || '',
          solution: source.solution || '',
          customerSegments: source.customerSegments || '',
          uniqueValueProposition: source.uniqueValueProposition || '',
          unfairAdvantage: source.unfairAdvantage || '',
          keyMetrics: source.keyMetrics || '',
          channels: source.channels || '',
          costStructure: source.costStructure || '',
          revenueStreams: source.revenueStreams || '',
        },
        loading: false,
      });
    } catch (err) {
      console.error('Gagal memuat Lean Canvas:', err);
      if (err.message?.includes('404')) {
        set({ canvas: { ...initialCanvas }, loading: false });
      } else {
        set({ error: err.message || 'Gagal memuat data', loading: false });
      }
    }
  },

  updateField: (field, value) => {
    set((state) => ({ canvas: { ...state.canvas, [field]: value } }));
  },

  saveLeanCanvas: async (projectId) => {
    const { canvas } = get();
    set({ loading: true, error: null });
    try {
      await apiRequest(`lean-canvas/project/${projectId}`, 'PUT', {
        problem: canvas.problem,
        solution: canvas.solution,
        customerSegments: canvas.customerSegments,
        uniqueValueProposition: canvas.uniqueValueProposition,
        unfairAdvantage: canvas.unfairAdvantage,
        keyMetrics: canvas.keyMetrics,
        channels: canvas.channels,
        costStructure: canvas.costStructure,
        revenueStreams: canvas.revenueStreams,
      });
      set({ loading: false });
    } catch (err) {
      console.error('Gagal menyimpan Lean Canvas:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },
}));