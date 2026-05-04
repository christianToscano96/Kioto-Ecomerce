import { Router } from 'express';

const router = Router();

// API Documentation endpoint
router.get('/', (_req, res) => {
  res.json({
    endpoints: {
      auth: {
        'POST /api/auth/register': {
          description: 'Register a new user',
          body: { email: 'string (required)', password: 'string (min 6)', name: 'string (optional)' },
          response: { user: 'User object', refreshToken: 'string' },
        },
        'POST /api/auth/login': {
          description: 'Login user',
          body: { email: 'string', password: 'string' },
          response: { user: 'User object', refreshToken: 'string' },
        },
        'POST /api/auth/logout': {
          description: 'Logout user',
          response: { message: 'Logged out successfully' },
        },
        'POST /api/auth/refresh': {
          description: 'Refresh JWT token',
          body: { refreshToken: 'string' },
          response: { token: 'string' },
        },
      },
      products: {
        'GET /api/products': {
          description: 'List all products (admin only)',
          auth: 'Required (admin)',
        },
        'POST /api/products': {
          description: 'Create product (admin only)',
          auth: 'Required (admin)',
          body: { name: 'string', price: 'number', images: 'string[]', description: 'string', stock: 'number', published: 'boolean' },
        },
        'PUT /api/products/:id': {
          description: 'Update product (admin only)',
          auth: 'Required (admin)',
        },
        'DELETE /api/products/:id': {
          description: 'Delete product (admin only)',
          auth: 'Required (admin)',
        },
        'GET /api/public/products': {
          description: 'List published products',
          query: { search: 'string (optional)', page: 'number (optional)' },
        },
        'GET /api/public/products/:id': {
          description: 'Get single product by ID or slug',
        },
      },
      cart: {
        'GET /api/cart': { description: 'Get cart contents' },
        'POST /api/cart/items': {
          description: 'Add item to cart',
          body: { productId: 'string', quantity: 'number' },
        },
        'PUT /api/cart/items/:itemId': {
          description: 'Update cart item quantity',
          body: { quantity: 'number' },
        },
        'DELETE /api/cart/items/:itemId': { description: 'Remove item from cart' },
        'DELETE /api/cart': { description: 'Clear cart' },
      },
      checkout: {
        'POST /api/checkout': {
          description: 'Create Stripe Checkout session',
          response: { sessionId: 'string', url: 'string' },
        },
        'POST /api/checkout/webhook': {
          description: 'Stripe webhook endpoint',
          note: 'Handles checkout.session.completed and checkout.session.expired',
        },
      },
      orders: {
        'GET /api/orders': { description: 'List orders (admin only)' },
        'GET /api/orders/:id': { description: 'Get single order' },
      },
    },
  });
});

export default router;