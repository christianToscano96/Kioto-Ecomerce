import { z } from 'zod';

// Create category schema - only name required
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
});

// Update category schema - only name
export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  }),
});