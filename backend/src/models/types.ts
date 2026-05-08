import mongoose from 'mongoose';

// Shared CartItem interface
export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  productName?: string; // Optional for email population
}

// Order status enum
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';