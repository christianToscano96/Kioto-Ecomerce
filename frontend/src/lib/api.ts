import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, Product, Cart, CartItem, Order } from '../../../shared/src/index';

// Create axios instance with credentials
export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL ?? 'http://localhost:3000/api',
  withCredentials: true,
});

// Add response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post<{ user: User; refreshToken: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; refreshToken: string }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  me: () => api.get<{ user: User }>('/auth/me'),
};

// Products API (public - for storefront)
export const productsApi = {
  list: () =>
    api.get<Product[]>('/public/products'),

  get: (id: string) =>
    api.get<Product>(`/public/products/${id}`),

  getBySlug: (slug: string) =>
    api.get<Product>(`/public/products/slug/${slug}`),

  search: (query: string) =>
    api.get<Product[]>('/public/products', { params: { q: query } }),
};

// Admin Products API
export const adminProductsApi = {
  list: () =>
    api.get<Product[]>('/products/public').then(res => ({ data: res.data })),

  get: (id: string) =>
    api.get<Product>(`/public/products/${id}`),

  create: (data: Partial<Product>) =>
    api.post<Product>('/products/public', data),

  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete(`/products/${id}`),
};

// Cart API
export const cartApi = {
  get: () => api.get<Cart>('/cart'),

  addItem: (data: { productId: string; quantity: number }) =>
    api.post<Cart>('/cart/items', data),

  updateItem: (itemId: string, quantity: number) =>
    api.put<Cart>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) =>
    api.delete<Cart>(`/cart/items/${itemId}`),

  clear: () => api.delete('/cart'),
};

// Checkout API
export const checkoutApi = {
  createSession: (data: { items: CartItem[] }) =>
    api.post<{ url: string }>('/checkout', data),
};

// React Query hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me().then((res) => res.data.user),
    retry: false,
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.list().then((res) => res.data),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.get(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.data.user);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

// Admin Products hooks
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminProductsApi.list().then((res) => res.data),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      adminProductsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

// Orders API
export const ordersApi = {
  list: () =>
    api.get<Order[]>('/orders'),

  get: (id: string) =>
    api.get<Order>(`/orders/${id}`),
};

// Admin Orders hook
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => ordersApi.list().then((res) => res.data),
  });
};

// Utility hooks for cart calculations
export const useCartTotal = () => {
  const { data: cart } = useCart();
  return cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;
};

export const useCartItemCount = () => {
  const { data: cart } = useCart();
  return cart?.items?.reduce((count, item) => count + item.quantity, 0) ?? 0;
};