import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import Product from '../models/Product';
import Cart from '../models/Cart';
import { validate } from '../middleware/validation';
import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from '../schemas/cart';
import { getOrCreateCart, addToCart, updateCartItem, removeFromCart, clearCart, calculateCartTotal, markCartAsConverted } from '../utils/cart';

const router = Router();

// Helper to get session ID from request
const getSessionId = (req: Request): string => {
  return req.cookies?.sessionId || req.headers['x-session-id'] as string || 'anonymous';
};

// GET /api/cart - Get current cart
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await getOrCreateCart(sessionId);

    // Populate product details for cart items (include description)
    const populatedCart = await cart.populate('items.productId', 'name price images description');

    const total = calculateCartTotal(cart.items);

    res.status(200).json({
      cart: {
        ...populatedCart.toObject(),
        total,
        itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// POST /api/cart/items - Add item to cart
router.post('/items', validate(addToCartSchema), async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity, size, color } = req.body;
    
    // Verify product exists and is published
    const product = await Product.findOne({
      _id: productId,
      published: true,
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found or not available' });
      return;
    }

    // Check stock availability
    if (product.stock < quantity) {
      res.status(400).json({ error: 'Requested quantity exceeds available stock' });
      return;
    }

    const cart = await addToCart(
      sessionId,
      new Types.ObjectId(productId),
      quantity,
      product.price,
      size,
      color
    );

    // Set session ID cookie if not already set
    if (!req.cookies?.sessionId) {
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      });
    }

    const total = calculateCartTotal(cart.items);

    res.status(200).json({
      cart: {
        ...cart.toObject(),
        total,
        itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// PUT /api/cart/items/:itemId - Update cart item quantity
router.put('/items/:itemId', validate(updateCartItemSchema), async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await updateCartItem(
      sessionId,
      new Types.ObjectId(itemId),
      quantity
    );

    const total = calculateCartTotal(cart.items);

    res.status(200).json({
      cart: {
        ...cart.toObject(),
        total,
        itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }
    if (error instanceof Error && error.message === 'Item not found in cart') {
      res.status(404).json({ error: 'Item not found in cart' });
      return;
    }
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/items/:itemId - Remove item from cart
router.delete('/items/:itemId', validate(removeCartItemSchema), async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const { itemId } = req.params;

    const cart = await removeFromCart(sessionId, new Types.ObjectId(itemId));

    const total = calculateCartTotal(cart.items);

    res.status(200).json({
      cart: {
        ...cart.toObject(),
        total,
        itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// DELETE /api/cart - Clear cart
router.delete('/', async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    await clearCart(sessionId);

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// GET /api/cart/stats - Get cart conversion stats (admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalCarts = await Cart.countDocuments();
    const abandonedCarts = await Cart.countDocuments({ converted: false });
    const convertedCarts = await Cart.countDocuments({ converted: true });

    res.json({
      totalCarts,
      abandonedCarts,
      convertedCarts,
      conversionRate: totalCarts > 0 ? ((convertedCarts / totalCarts) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    console.error('Cart stats error:', error);
    res.status(500).json({ error: 'Failed to get cart stats' });
  }
});

export default router;