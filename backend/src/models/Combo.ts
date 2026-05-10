import mongoose, { Document, Model } from 'mongoose';

// Interface for Combo document
export interface ICombo extends Document {
  name: string;
  description: string;
  products: mongoose.Types.ObjectId[];
  categories: mongoose.Types.ObjectId[];
  discount: number; // percentage 0-100
  originalPrice: number;
  comboPrice: number;
  image: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const comboSchema = new mongoose.Schema<ICombo>(
  {
    name: {
      type: String,
      required: [true, 'Combo name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
discount: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount must be at least 0'],
      max: [100, 'Discount cannot exceed 100'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    comboPrice: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Export model
const Combo: Model<ICombo> = mongoose.model<ICombo>('Combo', comboSchema);

export default Combo;