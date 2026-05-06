import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface ManualOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (order: any) => void;
}

export function ManualOrderModal({ open, onClose, onSubmit }: ManualOrderModalProps) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = () => {
    onSubmit({
      customerEmail,
      customerName,
      items: items.filter(i => i.productId),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-serif font-bold mb-4">Crear Pedido Manual</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email del Cliente"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
            />
            <Input
              label="Nombre del Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              Productos
            </label>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  placeholder="ID del producto"
                  value={item.productId}
                  onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Cant"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                  className="w-20"
                  min="1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addItem}>
              + Agregar Producto
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Crear Pedido</Button>
        </div>
      </div>
    </div>
  );
}