import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'order' | 'low_stock' | 'out_of_stock' | 'return';

export interface INotification extends Document {
  type: NotificationType;
  title: string;
  message: string;
  orderId?: Types.ObjectId;
  productId?: Types.ObjectId;
  productSnapshot?: {
    name: string;
    stock: number;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['order', 'low_stock', 'out_of_stock', 'return'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productSnapshot: {
      name: String,
      stock: Number,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

export const Notification = model<INotification>('Notification', notificationSchema);