import mongoose from 'mongoose';

// Shared CartItem interface
export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

// Order status enum
export type OrderStatus = 'pending' | 'paid' | 'failed';