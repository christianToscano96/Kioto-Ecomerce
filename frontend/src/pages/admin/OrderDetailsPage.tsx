import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { useOrdersStore } from '@/store/orders';
import type { Order } from '../../../../shared/src';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

function getStatusBadgeVariant(status: Order['status']): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' {
  switch (status) {
    case 'pending': return 'warning';
    case 'paid': return 'success';
    case 'processing': return 'default';
    case 'shipped': return 'secondary';
    case 'delivered': return 'outline';
    case 'failed':
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
}

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrdersStore((state) => state.order);
  const isLoading = useOrdersStore((state) => state.isLoading);
  const fetchOrder = useOrdersStore((state) => state.fetchOrder);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id, fetchOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 bg-terracota-50 text-terracota-700 rounded-lg">
        Pedido no encontrado
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
<PageHeader
           title={`Pedido #${typeof order._id === 'object' ? order._id.toString().slice(-8) : order._id?.slice(-8) || 'N/A'}`}
           description="Detalle completo del pedido"
           eyebrow="Panel de Administración"
         />
        <Button variant="ghost" onClick={() => navigate('/admin/orders')}>
          Volver
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Información del cliente */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
          <h3 className="font-serif font-bold text-on-surface mb-3">Cliente</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-on-surface-variant">Nombre:</span> {order.shippingDetails?.name || 'Anónimo'}</p>
            <p><span className="text-on-surface-variant">Email:</span> {order.shippingDetails?.email || '-'}</p>
            <p><span className="text-on-surface-variant">Estado:</span> <Badge variant={getStatusBadgeVariant(order.status)} size="sm">{STATUS_LABELS[order.status]}</Badge></p>
            <p><span className="text-on-surface-variant">Fecha:</span> {new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        {/* Dirección de envío */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
          <h3 className="font-serif font-bold text-on-surface mb-3">Dirección</h3>
          <div className="text-sm space-y-1">
            <p>{order.shippingDetails?.address?.line1}</p>
            {order.shippingDetails?.address?.line2 && <p>{order.shippingDetails.address.line2}</p>}
            <p>
              {order.shippingDetails?.address?.city}, {order.shippingDetails?.address?.state} {order.shippingDetails?.address?.postal_code}
            </p>
            <p>{order.shippingDetails?.address?.country}</p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
          <h3 className="font-serif font-bold text-on-surface mb-3">Resumen</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal:</span>
              <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Envío:</span>
              <span>${order.shipping?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="border-t border-outline-variant/40 pt-2 flex justify-between font-semibold">
              <span className="text-on-surface">Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/40">
        <h3 className="font-serif font-bold text-on-surface mb-4">Productos</h3>
        <div className="space-y-3">
{order.items.map((item, idx) => {
             // Handle both populated product objects and raw productIds
             const productIdStr = typeof item.productId === 'object' 
               ? item.productId._id?.toString() || item.productId.toString()
               : item.productId.toString();
               
             return (
               <div key={idx} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                 <div>
                   <p className="font-medium text-on-surface">{typeof item.productId === 'object' ? item.productId.name : `Producto ${idx + 1}`}</p>
                   <p className="text-xs text-on-surface-variant">ID: {productIdStr.slice(-8)}</p>
                 </div>
                 <div className="text-right">
                   <p className="font-semibold">${item.price.toFixed(2)} x {item.quantity}</p>
                   <p className="text-xs text-on-surface-variant">${(item.price * item.quantity).toFixed(2)}</p>
                 </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}