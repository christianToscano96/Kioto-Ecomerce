import { useOrdersStore } from '@/store/orders';

interface ShippingLabelModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: string | null;
}

export function ShippingLabelModal({ open, onClose, orderId }: ShippingLabelModalProps) {
  const orders = useOrdersStore((state) => state.orders);
  
  if (!open || !orderId) return null;
  
  const order = orders?.find(o => o._id === orderId);
  
  if (!order) return null;
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const labelHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Etiqueta de Envío - ${order._id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .label { border: 2px solid #000; padding: 20px; max-width: 400px; }
          .header { font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; }
          .thankyou { font-size: 14px; color: #666; margin-bottom: 15px; text-align: center; }
          .section { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="header">KIOTO</div>
          <div class="thankyou">¡Gracias por su compra! &lt;3</div>
          <div class="section"><strong>Pedido:</strong> #${order._id.slice(-8)}</div>
          <div class="section"><strong>Cliente:</strong><br>
            ${order.shippingDetails?.name || 'N/A'}<br>
            ${order.shippingDetails?.email || 'N/A'}
          </div>
          ${order.shippingDetails?.address ? `
          <div class="section"><strong>Dirección:</strong><br>
            ${order.shippingDetails.address.line1 || ''}<br>
            ${order.shippingDetails.address.city || ''}, ${order.shippingDetails.address.state || ''} ${order.shippingDetails.address.postal_code || ''}<br>
            ${order.shippingDetails.address.country || ''}
          </div>` : ''}
          <div class="section"><strong>Productos:</strong><br>
            ${order.items?.map(item => `${item.quantity}x Producto`).join('<br>') || 'N/A'}
          </div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;
    
    printWindow.document.write(labelHtml);
    printWindow.document.close();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2 text-center">KIOTO</h3>
        <p className="text-sm text-on-surface-variant mb-4 text-center">¡Gracias por su compra! {"<3"}</p>
        <div className="space-y-2 mb-4">
          <p><strong>Pedido:</strong> #{order._id.slice(-8)}</p>
          <p><strong>Cliente:</strong> {order.shippingDetails?.name}</p>
          <p><strong>Email:</strong> {order.shippingDetails?.email}</p>
          {order.shippingDetails?.address && (
            <p><strong>Dirección:</strong> {order.shippingDetails.address.line1}, {order.shippingDetails.address.city}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Imprimir Etiqueta
          </button>
        </div>
      </div>
    </div>
  );
}