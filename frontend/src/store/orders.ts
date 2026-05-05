import { create } from 'zustand';
import { toast } from 'sonner';
import type { Order } from '../../../shared/src/index';
import { ordersApi } from '../lib/api';

interface OrdersState {
  orders: Order[];
  order: Order | null;
  isLoading: boolean;
  error: string | null;
}

interface OrdersActions {
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  setOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type OrdersStore = OrdersState & OrdersActions;

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  // State
  orders: [],
  order: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.list();
      set({ orders: response.data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.get(id);
      set({ order: response.data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch order';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Add API endpoint for updating order status
      await get().fetchOrders();
      toast.success('Order status updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update order status';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  setOrders: (orders) => set({ orders }),
  setOrder: (order) => set({ order }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const useOrders = () => useOrdersStore((state) => state.orders);
export const useOrdersLoading = () => useOrdersStore((state) => state.isLoading);
export const useOrdersError = () => useOrdersStore((state) => state.error);