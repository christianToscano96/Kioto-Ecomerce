import { z } from 'zod';

// Create checkout session schema
export const createCheckoutSchema = z.object({
  body: z.object({
    shippingDetails: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      address: z.object({
        line1: z.string().min(1, 'Address line 1 is required'),
        line2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postal_code: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
      }),
    }).optional(),
  }),
});