import mongoose, { Document, Model } from 'mongoose';

// Interface for Product document
export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  published: boolean;
  materials?: string;
  sizes?: string[];
  colors?: string[];
  category?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock must be non-negative'],
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    materials: {
      type: String,
      trim: true,
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Auto-generate slug from name before save
productSchema.pre<IProduct>('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Virtual for image URLs (not persisted)
productSchema.virtual('imageUrls').get(function () {
  return this.images || [];
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Export model
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;