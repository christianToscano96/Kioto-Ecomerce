import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { validate } from '../middleware/validation';
import { createCheckoutSchema } from '../schemas/checkout';
import { getOrCreateCart, calculateCartTotal, calculateShipping, markCartAsConverted } from '../utils/cart';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../services/email';
import { createPaymentLink } from '../services/galio';

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
    await cart.populate('items.productId', 'name images stock variants');

    // Check stock availability
    for (const item of cart.items) {
      const product = item.productId as any;
      let availableStock = product.stock;
      
      // Check variant stock if size is specified
      if (product.variants && product.variants.length > 0) {
        // Item must have size if product has variants
        const itemSize = (item as any).size;
        if (!itemSize) {
          res.status(400).json({ 
            error: `${product.name} requires size selection. Please specify a size.` 
          });
          return;
        }
        
        const variant = product.variants.find((v: any) => v.size === itemSize);
        if (!variant) {
          res.status(400).json({ 
            error: `Size ${itemSize} not available for ${product.name}` 
          });
          return;
        }
        availableStock = variant.stock;
      }
      
      if (availableStock < item.quantity) {
        res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${availableStock}, Required: ${item.quantity}` 
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
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        const itemSize = (item as any).size;
        
        // If product has variants and item has size, deduct from variant
        if (product?.variants && product.variants.length > 0 && itemSize) {
          const variantIndex = product.variants.findIndex((v: any) => v.size === itemSize);
          if (variantIndex >= 0) {
            product.variants[variantIndex].stock -= item.quantity;
            await product.save();
            return;
          }
        }
        
        // Otherwise deduct from base stock
        return Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      })
    );

    // Mark cart as converted (customer completed purchase)
    await markCartAsConverted(sessionId);

    // Create GalioPay payment link
    let paymentUrl = null;
    try {
      const galioItems = cart.items.map(item => ({
        title: (item.productId as any)?.name || 'Product',
        quantity: item.quantity,
        unitPrice: item.price,
        currencyId: 'ARS',
      }));

      const galioLink = await createPaymentLink({
        items: galioItems,
        referenceId: order._id.toString(),
        backUrl: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?orderId=${order._id}`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel`,
        },
        notificationUrl: `${process.env.PUBLIC_API_URL || 'http://localhost:4000'}/api/webhooks/galio`,
        sandbox: process.env.GALIO_SANDBOX === 'true',
      });
      paymentUrl = galioLink.url;

      // Save GalioPay payment ID to order
      order.galioPaymentId = galioLink.referenceId;
      await order.save();
    } catch (galioError) {
      console.error('GalioPay error:', galioError);
      // Continue without GalioPay link - order still created
    }

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
    }

    res.status(200).json({
      orderId: order._id,
      sessionId: `fake_session_${order._id}`,
      success: true,
      message: 'Order created successfully',
      shipping: shipping,
      paymentUrl, // GalioPay payment URL
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
       await cart.populate('items.productId', 'name stock variants');
       for (const item of cart.items) {
         const product = item.productId as any;
         let availableStock = product.stock;
         
         if (product.variants && product.variants.length > 0 && (item as any).size) {
           const variant = product.variants.find((v: any) => v.size === (item as any).size);
           if (variant) {
             availableStock = variant.stock;
           }
         }
         
         if (availableStock < item.quantity) {
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
         cart.items.map(async (item) => {
           const product = await Product.findById(item.productId);
           const itemSize = (item as any).size;
           
           if (product?.variants && product.variants.length > 0 && itemSize) {
             const variantIndex = product.variants.findIndex((v: any) => v.size === itemSize);
             if (variantIndex >= 0) {
               product.variants[variantIndex].stock -= item.quantity;
               await product.save();
               return;
             }
           }
           
           return Product.findByIdAndUpdate(
             item.productId,
             { $inc: { stock: -item.quantity } }
           );
         })
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