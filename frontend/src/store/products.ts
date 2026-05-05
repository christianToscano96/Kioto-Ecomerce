import { create } from 'zustand';
import { toast } from 'sonner';
import type { Product } from '../../../shared/src/index';
import { productsApi, adminProductsApi } from '../lib/api';

interface ProductsState {
  products: Product[];
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

interface ProductsActions {
  // Public products
  fetchProducts: (params?: { search?: string }) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  
  // Admin products
  fetchAdminProducts: () => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Setters
  setProducts: (products: Product[]) => void;
  setProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // State
  products: [],
  product: null,
  isLoading: false,
  error: null,

  // Public products
  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productsApi.list();
      let filtered = products;
      if (params?.search) {
        filtered = products.filter(p => 
          p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          p.description?.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      set({ products: filtered });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsApi.get(id);
      set({ product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin products
  fetchAdminProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminProductsApi.list();
      set({ products: response.data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch admin products';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await adminProductsApi.create(data);
      await get().fetchAdminProducts();
      toast.success('Product created');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await adminProductsApi.update(id, data);
      await get().fetchAdminProducts();
      toast.success('Product updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminProductsApi.delete(id);
      await get().fetchAdminProducts();
      toast.success('Product deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  setProducts: (products) => set({ products }),
  setProduct: (product) => set({ product }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Selectors
export const useProducts = () => useProductsStore((state) => state.products);
export const useProduct = (id: string) => {
  const product = useProductsStore((state) => state.product);
  const fetchProduct = useProductsStore((state) => state.fetchProduct);
  const isLoading = useProductsStore((state) => state.isLoading);
  
  // Fetch product when id changes - must be in useEffect, not render body
  // Use a stable reference to avoid stale closure
  const fetchProductRef = useProductsStore.getState().fetchProduct;
  
  // Use useEffect pattern at component level instead
  return { product, isLoading, fetchProduct: fetchProductRef };
};
export const useProductsLoading = () => useProductsStore((state) => state.isLoading);
export const useProductsError = () => useProductsStore((state) => state.error);