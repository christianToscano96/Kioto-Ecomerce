import axios from 'axios';
import type { User, Product, Cart, CartItem, Order } from '../../../shared/src/index';

// Create axios instance with credentials
export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL ?? 'http://localhost:4000/api',
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
    api.get<{ products: Product[] }>('/public/products').then(res => res.data.products),

  get: (id: string) =>
    api.get<{ product: Product }>(`/public/products/${id}`).then(res => res.data.product),

  getBySlug: (slug: string) =>
    api.get<{ product: Product }>(`/public/products/slug/${slug}`).then(res => res.data.product),

  search: (query: string) =>
    api.get<{ products: Product[] }>('/public/products', { params: { q: query } }).then(res => res.data.products),
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
  get: () => api.get<{ cart: Cart }>('/cart'),

  addItem: (data: { productId: string; quantity: number; size?: string }) =>
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

// Orders API
export const ordersApi = {
  list: () =>
    api.get<Order[]>('/orders'),

  get: (id: string) =>
    api.get<Order>(`/orders/${id}`),
};