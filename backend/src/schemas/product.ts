import { z } from 'zod';

// Create product schema
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    price: z.number().min(0, 'Price must be non-negative'),
    images: z.array(z.string().url('Invalid image URL')).optional().default([]),
    description: z.string().min(1, 'Description is required'),
    stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
    published: z.boolean().default(false),
  }),
});

// Update product schema (all fields optional)
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    price: z.number().min(0, 'Price must be non-negative').optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    description: z.string().min(1, 'Description is required').optional(),
    stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
    published: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

// Public product query schema
export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1', 10)),
    limit: z.string().optional().transform(val => parseInt(val || '10', 10)),
    search: z.string().optional(),
  }),
});