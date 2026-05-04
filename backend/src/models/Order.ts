import mongoose, { Document, Model, Schema } from 'mongoose';
import { ICartItem, OrderStatus } from './types';

// Interface for Order document
export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  total: number;
  status: OrderStatus;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Item Schema (embedded in Order)
const orderItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive'],
  },
});

// Order Schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ sessionId: 1 });

// Export model
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;