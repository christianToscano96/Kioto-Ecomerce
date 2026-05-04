import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { validate } from '../middleware/validation';
import { createCheckoutSchema } from '../schemas/checkout';
import { getOrCreateCart, calculateCartTotal, clearCart } from '../utils/cart';
import Cart from '../models/Cart';
import Order from '../models/Order';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Helper to get session ID from request
const getSessionId = (req: Request): string => {
  return req.cookies?.sessionId || (req.headers['x-session-id'] as string) || 'anonymous';
};

// POST /api/checkout - Create checkout session
router.post('/', validate(createCheckoutSchema), async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await getOrCreateCart(sessionId);

    // Check if cart has items
    if (cart.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Populate product details for Stripe line items
    await cart.populate('items.productId', 'name images');

    // Create line items for Stripe
    const lineItems = cart.items.map(item => {
      const product = item.productId as any;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product?.name || 'Product',
            images: product?.images || [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel`,
      metadata: {
        sessionId,
        cartId: cart._id.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/checkout/webhook - Handle Stripe webhook
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Get the cart from metadata
      const sessionId = session.metadata?.sessionId;

      if (!sessionId) {
        throw new Error('No session ID in metadata');
      }

      // Get cart directly (don't create new)
      const cart = await Cart.findOne({ sessionId });

      if (!cart || cart.items.length === 0) {
        console.error(`No cart found for session ${sessionId}`);
        res.json({ received: true });
        return;
      }

      const total = calculateCartTotal(cart.items);

      // Create order
      const order = await Order.create({
        sessionId,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        status: 'paid',
        stripePaymentIntentId: session.payment_intent as string,
      });

      // Clear the cart using the utility function
      await clearCart(sessionId);

      console.log(`Order ${order._id} created from session ${session.id}`);
    } catch (error) {
      console.error('Error creating order from webhook:', error);
      // Still return 200 to acknowledge receipt, but log the error
    }
  } else if (event.type === 'checkout.session.expired') {
    // Handle expired sessions if needed
    console.log(`Session expired: ${event.data.object.id}`);
  }

  res.json({ received: true });
});

export default router;