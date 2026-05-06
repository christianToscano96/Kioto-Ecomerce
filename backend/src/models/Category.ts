import mongoose, { Document, Model } from 'mongoose';

// Interface for Category document
export interface ICategory extends Document {
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

// Text index for search functionality
categorySchema.index({ name: 'text', description: 'text' });

// Auto-generate slug from name before save
categorySchema.pre<ICategory>('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Export model
const Category: Model<ICategory> = mongoose.model<ICategory>(
  'Category',
  categorySchema,
);

export default Category;