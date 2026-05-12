import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import { verifyPaymentStatus, getPayment } from '../services/galio';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../services/email';

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
    // GalioPay sends 'approved' or 'ok' for successful payments
    if (status === 'approved' || status === 'ok') {
      order.status = 'paid';
      await order.save();
      
      // Send order confirmation emails
      sendOrderConfirmationEmail(order, order._id.toString())
        .then(() => console.log(`[EMAIL] Customer confirmation sent for order ${order._id}`))
        .catch((err) => console.error(`[EMAIL-ERROR] Customer confirmation failed for order ${order._id}:`, err));
      sendAdminNotificationEmail(order, order._id.toString(), order.shippingDetails?.name || 'Cliente')
        .then(() => console.log(`[EMAIL] Admin notification sent for order ${order._id}`))
        .catch((err) => console.error(`[EMAIL-ERROR] Admin notification failed for order ${order._id}:`, err));
      
      // Deduct stock now that payment is confirmed
      await deductStockForOrder(order);
      return res.json({ success: true });
    }

    // Otherwise verify with GalioPay API
    if (paymentId) {
      const payment = await getPayment(paymentId);
      // GalioPay API returns 'approved' for successful payments
      if ((payment.status === 'approved' || payment.status === 'ok') && order.status === 'pending') {
        order.status = 'paid';
        await order.save();
        
// Send order confirmation emails
         sendOrderConfirmationEmail(order, order._id.toString())
           .then(() => console.log(`[EMAIL] Customer confirmation sent for order ${order._id}`))
           .catch((err) => console.error(`[EMAIL-ERROR] Customer confirmation failed for order ${order._id}:`, err));
         sendAdminNotificationEmail(order, order._id.toString(), order.shippingDetails?.name || 'Cliente')
           .then(() => console.log(`[EMAIL] Admin notification sent for order ${order._id}`))
           .catch((err) => console.error(`[EMAIL-ERROR] Admin notification failed for order ${order._id}:`, err));
        
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