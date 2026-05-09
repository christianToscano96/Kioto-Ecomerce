import { Router } from 'express';
import Order from '../models/Order';
import { verifyPaymentStatus } from '../services/galio';

const router = Router();

/**
 * Webhook endpoint for GalioPay notifications
 * POST /api/webhooks/galio
 */
router.post('/galio', async (req, res) => {
  try {
    const { paymentId, referenceId, status } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    // Find order by galioPaymentId or referenceId
    const order = await Order.findOne({
      $or: [{ galioPaymentId: paymentId }, { _id: referenceId }],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify payment status with GalioPay API
    const verifiedStatus = await verifyPaymentStatus(order);

    // Update order status
    if (verifiedStatus === 'approved' && order.status === 'pending') {
      order.status = 'paid';
      await order.save();
    } else if (verifiedStatus === 'refunded') {
      order.status = 'cancelled';
      await order.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Galio webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;