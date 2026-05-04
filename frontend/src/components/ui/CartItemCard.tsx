import { useUpdateCartItem, useRemoveFromCart } from '@/lib/api';
import type { CartItem } from '../../../../shared/src/index';

interface CartItemCardProps {
  item: CartItem;
}

// Quantity Selector Component
const QuantitySelector = ({ 
  quantity, 
  onDecrease, 
  onIncrease 
}: { 
  quantity: number, 
  onDecrease: () => void, 
  onIncrease: () => void 
}) => (
  <div className="flex items-center gap-4 mt-1">
    <button 
      onClick={onDecrease}
      className="material-symbols-outlined text-sm hover:text-primary transition-colors"
    >
      remove
    </button>
    <span className="text-on-surface font-bold">{quantity}</span>
    <button 
      onClick={onIncrease}
      className="material-symbols-outlined text-sm hover:text-primary transition-colors"
    >
      add
    </button>
  </div>
);

export function CartItemCard({ item }: CartItemCardProps) {
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveFromCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem.mutateAsync({ 
      itemId: item.productId, 
      quantity: newQuantity 
    });
  };

  const handleRemove = async () => {
    await removeCartItem.mutateAsync(item.productId);
  };

  // Get product info with fallbacks
  const product = item.product;
  const name = product?.name || 'Product';
  const price = item.price || product?.price || 0;
  const image = product?.images?.[0];
  const description = product?.description || '';

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-dashed border-outline-variant/40">
      {/* Product Image */}
      <div className="w-full md:w-48 aspect-[3/4] bg-surface-container overflow-hidden rounded-lg">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            No image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-serif">{name}</h3>
            <p className="text-xl font-serif text-primary">${price.toFixed(2)}</p>
          </div>
          
          {description && (
            <p className="text-on-surface-variant mb-6 leading-relaxed max-w-md">
              {description}
            </p>
          )}

          {/* Size/Color/Quantity Row */}
          <div className="flex gap-12 font-label text-xs uppercase tracking-widest text-on-surface-variant">
            <div>
              <span className="block mb-1 text-[10px] opacity-60">Size</span>
              <span className="text-on-surface font-bold">
                {(item as any).size || 'M'}
              </span>
            </div>
            <div>
              <span className="block mb-1 text-[10px] opacity-60">Color</span>
              <span className="text-on-surface font-bold">Natural</span>
            </div>
            <div>
              <span className="block mb-1 text-[10px] opacity-60">Quantity</span>
              <QuantitySelector
                quantity={item.quantity}
                onDecrease={() => handleQuantityChange(item.quantity - 1)}
                onIncrease={() => handleQuantityChange(item.quantity + 1)}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleRemove}
            className="font-label text-xs uppercase tracking-widest text-primary border-b border-dashed border-primary/40 pb-1 hover:border-primary transition-all"
          >
            Remove Item
          </button>
        </div>
      </div>
    </div>
  );
}