import { z } from 'zod';

// Add to cart schema
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    size: z.string().optional(),
    color: z.string().optional(),
  }),
});

// Update cart item schema
export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
  params: z.object({
    itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

// Remove cart item schema (params only)
export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});