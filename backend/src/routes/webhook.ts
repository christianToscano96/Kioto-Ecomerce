import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import { verifyPaymentStatus, getPayment } from '../services/galio';

const router = Router();

/**
 * Webhook endpoint for GalioPay notifications
 * POST /api/webhooks/galio
 */
router.post('/galio', async (req, res) => {
  try {
    console.log('=== GalioPay Webhook ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { paymentId, referenceId, status } = req.body;
    console.log('Parsed - referenceId:', referenceId, 'status:', status);

    // Convert referenceId to ObjectId if valid
    let orderQuery: any = {};
    if (referenceId && mongoose.Types.ObjectId.isValid(referenceId)) {
      orderQuery = { _id: referenceId };
    } else if (paymentId) {
      orderQuery = { galioPaymentId: paymentId };
    }

    console.log('Order query:', orderQuery);
    const order = await Order.findOne(orderQuery);
    console.log('Order found:', order ? order._id : 'NOT FOUND', 'Current status:', order?.status);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Mark order as paid and deduct stock
    if (status === 'approved') {
      order.status = 'paid';
      await order.save();
      
      // Deduct stock now that payment is confirmed
      await deductStockForOrder(order);
      return res.json({ success: true });
    }

    // Otherwise verify with GalioPay API
    if (paymentId) {
      const payment = await getPayment(paymentId);
      if (payment.status === 'approved' && order.status === 'pending') {
        order.status = 'paid';
        await order.save();
        
        // Deduct stock now that payment is confirmed
        await deductStockForOrder(order);
      } else if (payment.status === 'refunded') {
        order.status = 'cancelled';
        await order.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Galio webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function deductStockForOrder(order: any) {
  try {
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      const itemSize = (item as any).size;
      
      if (!product) continue;
      
      // Deduct from variant if size specified
      if (product.variants && product.variants.length > 0 && itemSize) {
        const variantIndex = product.variants.findIndex((v: any) => v.size === itemSize);
        if (variantIndex >= 0) {
          product.variants[variantIndex].stock -= item.quantity;
          await product.save();
          continue;
        }
      }
      
      // Otherwise deduct from base stock
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }
  } catch (error) {
    console.error('Error deducting stock:', error);
  }
}

export default router;