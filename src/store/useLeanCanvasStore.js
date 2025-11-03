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
  isFromBusinessIdea: false, // untuk logika UI opsional

  // Ambil data: dari Lean Canvas atau inisialisasi dari Business Idea
  fetchLeanCanvas: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiRequest(`lean-canvas/${projectId}`, 'GET');
      const data = res.data;

      // Jika ada field `isFromBusinessIdea`, berarti ini inisialisasi
      const isFromBI = res.isFromBusinessIdea || false;

      set({
        canvas: {
          problem: data.problem || '',
          solution: data.solution || '',
          customerSegments: data.customerSegments || '',
          uniqueValueProposition: data.uniqueValueProposition || '',
          unfairAdvantage: data.unfairAdvantage || '',
          keyMetrics: data.keyMetrics || '',
          channels: data.channels || '',
          costStructure: data.costStructure || '',
          revenueStreams: data.revenueStreams || '',
        },
        isFromBusinessIdea: isFromBI,
        loading: false,
      });
    } catch (err) {
      console.error('Gagal fetch Lean Canvas:', err);
      set({ error: err.message || 'Gagal memuat data', loading: false });
    }
  },

  // Update field lokal
  updateField: (field, value) => {
    set((state) => ({
      canvas: { ...state.canvas, [field]: value },
    }));
  },

  // Simpan ke Lean Canvas (PUT)
  saveLeanCanvas: async (projectId) => {
    const { canvas } = get();
    set({ loading: true, error: null });
    try {
      await apiRequest(`lean-canvas/${projectId}`, 'PUT', {
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
      // Setelah simpan, data tidak lagi "dari Business Idea"
      set({ isFromBusinessIdea: false, loading: false });
    } catch (err) {
      console.error('Gagal simpan Lean Canvas:', err);
      set({ error: err.message || 'Gagal menyimpan', loading: false });
      throw err;
    }
  },
}));