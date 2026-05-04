import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../../../shared/src/index';

interface CartState {
  items: CartItem[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  addItem: (item: CartItem) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setSessionId: (sessionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      sessionId: null,
      isLoading: false,
      error: null,

      // Actions
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId
          );

          if (existingIndex >= 0) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
            return { items: newItems };
          }

          // Add new item
          return { items: [...state.items, item] };
        }),

      updateItem: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      clear: () => set({ items: [] }),

      setSessionId: (sessionId) => set({ sessionId }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    }
  )
);

// Computed selectors
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  );
export const useCartItemCount = () =>
  useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
export const useCartSessionId = () => useCartStore((state) => state.sessionId);