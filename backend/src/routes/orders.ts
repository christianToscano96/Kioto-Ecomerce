import { Router } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { resendOrderConfirmationEmail } from '../services/email';

const router = Router();

// Get all orders (admin only) - supports date filtering
router.get('/', async (req, res) => {
  try {
    const { days, from, to } = req.query;
    const query: Record<string, unknown> = {};

    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));
      query.createdAt = { $gte: daysAgo };
    } else if (from || to) {
      const dateQuery: Record<string, Date> = {};
      if (from) dateQuery.$gte = new Date(from as string);
      if (to) {
        const endDate = new Date(to as string);
        endDate.setHours(23, 59, 59, 999);
        dateQuery.$lte = endDate;
      }
      if (Object.keys(dateQuery).length > 0) {
        query.createdAt = dateQuery;
      }
    }

    const orders = await Order.find(query)
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Resend order confirmation email
router.post('/:id/resend-email', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId', 'name price');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await resendOrderConfirmationEmail(order, (order._id as any).toString());
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({ error: 'Failed to resend email' });
  }
});

// Create manual order (admin only)
router.post('/manual', async (req, res) => {
  try {
    const { customerEmail, customerName, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Get product prices and validate stock
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      total += product.price * item.quantity;

      // Deduct stock
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({
      items: orderItems,
      total,
      status: 'paid',
      shippingDetails: {
        name: customerName,
        email: customerEmail,
        address: {},
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Manual order error:', error);
    res.status(500).json({ error: 'Failed to create manual order' });
  }
});

export default router;