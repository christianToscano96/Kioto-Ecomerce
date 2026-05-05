import mongoose from 'mongoose';

// Shared CartItem interface
export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

// Order status enum
export type OrderStatus = 'pending' | 'paid' | 'failed';