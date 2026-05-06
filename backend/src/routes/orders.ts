import { Router } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

const router = Router();

// Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
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

// Create manual order (admin only)
router.post('/manual', async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { customerEmail, customerName, items } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Items are required' });
    }

    // Get product prices and validate stock
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
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
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    const order = await Order.create([{
      items: orderItems,
      total,
      status: 'paid',
      shippingDetails: {
        name: customerName,
        email: customerEmail,
        address: {},
      },
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Manual order error:', error);
    res.status(500).json({ error: 'Failed to create manual order' });
  }
});

export default router;