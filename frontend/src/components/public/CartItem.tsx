import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2 } from '@/components/icons';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '../../../../shared/src/index';

interface CartItemProps {
  item: CartItemType & { product?: { name: string; images?: string[] } };
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const productName = item.product?.name || 'Product';
  const productImage = item.product?.images?.[0];

  return (
    <tr className="border-b border-chocolate-100 last:border-0">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-arena-100 rounded border border-arena-200 flex-shrink-0 overflow-hidden">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-chocolate-400 text-xs">
                No image
              </div>
            )}
          </div>
          <span className="font-medium text-chocolate-900">{productName}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="text-terracota-600 font-medium">{formatPrice(item.price)}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-center">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.productId, parseInt(e.target.value) || 1)}
            className="w-16 text-center"
          />
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="font-medium text-chocolate-900">
          {formatPrice(item.price * item.quantity)}
        </span>
      </td>
      <td className="py-4 px-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="text-chocolate-400 hover:text-terracota-600"
          aria-label="Remove item"
        >
          <Trash2 />
        </Button>
      </td>
    </tr>
  );
}