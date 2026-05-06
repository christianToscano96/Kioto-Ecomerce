import { z } from 'zod';

// Create category schema - name required, imageUrl optional
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    imageUrl: z.string().url('Invalid URL').optional(),
  }),
});

// Update category schema - name required, imageUrl optional
export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    imageUrl: z.string().url('Invalid URL').optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  }),
});