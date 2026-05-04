import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '../../../../shared/src/index';

interface CartItemProps {
  item: CartItemType & { product?: { name: string; images?: string[] } };
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

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
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
}