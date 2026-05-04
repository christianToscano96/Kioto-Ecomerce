// Shared TypeScript Types for Admin Ecommerce MVP

// User Types
export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  createdAt: Date;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  published: boolean;
  materials?: string;
  sizes?: string[];
  createdAt: Date;
}

export interface CreateProductInput {
  name: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  published?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  // Populated product fields (when cart is populated)
  product?: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
}

export interface Cart {
  _id?: string;
  sessionId: string;
  items: CartItem[];
  createdAt?: Date;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  stripePaymentIntentId: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Auth Types
export interface AuthResponse {
  user: User;
  token: string;
}