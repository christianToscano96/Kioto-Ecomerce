import { create } from 'zustand';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface Combo {
  _id: string;
  name: string;
  description?: string;
  products: Array<{ _id: string; name: string; price: number; images: string[] } | string>;
  categories: Array<{ _id: string; name: string } | string>;
  discount: number;
  originalPrice: number;
  comboPrice: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

interface CombosState {
  combos: Combo[];
  combo: Combo | null;
  isLoading: boolean;
  error: string | null;
}

interface CombosActions {
  fetchCombos: () => Promise<void>;
  fetchPublicCombos: () => Promise<void>;
  fetchCombo: (id: string) => Promise<void>;
  createCombo: (data: Partial<Combo>) => Promise<void>;
  updateCombo: (id: string, data: Partial<Combo>) => Promise<void>;
  deleteCombo: (id: string) => Promise<void>;
  setCombos: (combos: Combo[]) => void;
  setCombo: (combo: Combo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type CombosStore = CombosState & CombosActions;

export const useCombosStore = create<CombosStore>((set, get) => ({
  // State
  combos: [],
  combo: null,
  isLoading: false,
  error: null,

  // Admin combos (for admin panel)
  fetchCombos: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ combos: Combo[] }>('/combos');
      set({ combos: res.data.combos || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch combos';
      set({ error: message, combos: [] });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Public combos (with date filter)
  fetchPublicCombos: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ combos: Combo[] }>('/public/combos');
      set({ combos: res.data.combos || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch combos';
      set({ error: message, combos: [] });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin combos
  fetchCombo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ combo: Combo }>(`/combos/${id}`);
      set({ combo: res.data.combo });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch combo';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  createCombo: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/combos', data);
      await get().fetchCombos();
      toast.success('Combo created');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create combo';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateCombo: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/combos/${id}`, data);
      await get().fetchCombos();
      toast.success('Combo updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update combo';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCombo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/combos/${id}`);
      await get().fetchCombos();
      toast.success('Combo deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete combo';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  setCombos: (combos) => set({ combos }),
  setCombo: (combo) => set({ combo }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const useCombos = () => useCombosStore((state) => state.combos);
export const useCombo = (id: string) => {
  const combo = useCombosStore((state) => state.combo);
  const fetchCombo = useCombosStore((state) => state.fetchCombo);
  const isLoading = useCombosStore((state) => state.isLoading);
  
  return { combo, isLoading, fetchCombo };
};
export const useCombosLoading = () => useCombosStore((state) => state.isLoading);
export const useCombosError = () => useCombosStore((state) => state.error);