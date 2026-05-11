import { z } from 'zod';

export const createComboSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    products: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1, 'At least one product is required'),
    categories: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    discount: z.number().min(0).max(100),
    active: z.boolean().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const updateComboSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    products: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    categories: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    discount: z.number().min(0).max(100).optional(),
    active: z.boolean().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const generateComboImageSchema = z.object({
  body: z.object({
    productNames: z.array(z.string()).min(1),
    productImages: z.array(z.string().url()).min(1),
  }),
});