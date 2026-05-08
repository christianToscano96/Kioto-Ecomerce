import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { validate } from '../middleware/validation';
import { createCheckoutSchema } from '../schemas/checkout';
import { getOrCreateCart, calculateCartTotal, calculateShipping, markCartAsConverted } from '../utils/cart';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../services/email';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Helper to get session ID from request
const getSessionId = (req: Request): string => {
  return req.cookies?.sessionId || (req.headers['x-session-id'] as string) || 'anonymous';
};

// POST /api/checkout - Create checkout session (fake mode - no Stripe)
router.post('/', validate(createCheckoutSchema), async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await getOrCreateCart(sessionId);

    // Check if cart has items
    if (cart.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Populate product details
    await cart.populate('items.productId', 'name images stock');

    // Check stock availability
    for (const item of cart.items) {
      const product = item.productId as any;
      if (product.stock < item.quantity) {
        res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}` 
        });
        return;
      }
    }

    const subtotal = calculateCartTotal(cart.items);
    const shipping = calculateShipping(req.body.shippingDetails?.address?.postal_code || '');
    const total = subtotal + shipping;

    // FAKE CHECKOUT: Create order directly without Stripe (no transactions for standalone MongoDB)
    const order = await Order.create({
      sessionId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      shipping,
      total,
      status: 'pending',
      shippingDetails: req.body.shippingDetails,
    });

    // Deduct stock from products
    await Promise.all(
      cart.items.map(item =>
        Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        )
      )
    );

    // Mark cart as converted (customer completed purchase)
    await markCartAsConverted(sessionId);

// Send order confirmation email
     try {
       await sendOrderConfirmationEmail(order, (order._id as any).toString());
       // Send admin notification
       try {
         await sendAdminNotificationEmail(order, (order._id as any).toString(), order.shippingDetails?.name || 'Cliente');
       } catch (adminEmailError) {
         console.error('Failed to send admin notification email:', adminEmailError);
       }
     } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    res.status(200).json({
      orderId: order._id,
      sessionId: `fake_session_${order._id}`,
      success: true,
      message: 'Order created successfully',
      shipping: shipping,
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
    const stripeSession = event.data.object as Stripe.Checkout.Session;

    try {
      // Get the cart from metadata
      const sessionId = stripeSession.metadata?.sessionId;

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

      // Check stock availability before creating order
      await cart.populate('items.productId', 'name stock');
      for (const item of cart.items) {
        const product = item.productId as any;
        if (product.stock < item.quantity) {
          console.error(`Insufficient stock for ${product.name} (ID: ${product._id})`);
          res.json({ received: true });
          return;
        }
      }

      const total = calculateCartTotal(cart.items);
      const subtotal = total; // Use cart total as subtotal
      const shipping = Number(stripeSession.metadata?.shipping) || 0;

      // Extract shipping details from Stripe session
      const customerDetails = stripeSession.customer_details;
      const shippingDetails = {
        name: customerDetails?.name || '',
        email: customerDetails?.email || '',
        address: {
          line1: customerDetails?.address?.line1 || '',
          line2: customerDetails?.address?.line2 || '',
          city: customerDetails?.address?.city || '',
          state: customerDetails?.address?.state || '',
          postal_code: customerDetails?.address?.postal_code || '',
          country: customerDetails?.address?.country || '',
        },
      };

      // Create order (no transactions for standalone MongoDB)
      const order = await Order.create({
        sessionId,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: 'paid',
        stripePaymentIntentId: stripeSession.payment_intent as string,
        shippingDetails,
      });

      // Deduct stock from products
      await Promise.all(
        cart.items.map(item =>
          Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
          )
        )
      );

      // Mark cart as converted
      await markCartAsConverted(sessionId);

      console.log(`Order ${order._id} created from session ${stripeSession.id}`);

      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail(order, (order._id as any).toString());
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    } catch (error) {
      console.error('Error creating order from webhook:', error);
    }
  } else if (event.type === 'checkout.session.expired') {
    // Handle expired sessions if needed
    console.log(`Session expired: ${event.data.object.id}`);
  }

  res.json({ received: true });
});

export default router;