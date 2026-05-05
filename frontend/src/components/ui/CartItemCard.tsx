import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import type { CartItem } from '../../../../shared/src/index';

interface CartItemCardProps {
  item: CartItem;
}

// Quantity Selector Component
const QuantitySelector = ({ 
  quantity, 
  onDecrease, 
  onIncrease,
  disabled,
}: { 
  quantity: number, 
  onDecrease: () => void, 
  onIncrease: () => void,
  disabled?: boolean,
}) => (
  <div className="flex items-center gap-4 mt-1">
    <button 
      onClick={onDecrease}
      disabled={disabled}
      className="material-symbols-outlined text-sm hover:text-primary transition-colors disabled:opacity-50"
    >
      remove
    </button>
    <span className="text-on-surface font-bold">{quantity}</span>
    <button 
      onClick={onIncrease}
      disabled={disabled}
      className="material-symbols-outlined text-sm hover:text-primary transition-colors disabled:opacity-50"
    >
      add
    </button>
  </div>
);

export function CartItemCard({ item }: CartItemCardProps) {
  const updateCartItem = useCartStore(state => state.updateCartItem);
  const removeCartItem = useCartStore(state => state.removeCartItem);
  const isSyncing = useCartStore(state => state.isSyncing);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the cart item ID (not product ID) - the _id from the cart item
  const cartItemId = (item as any)._id || item.productId;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateCartItem(cartItemId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await removeCartItem(cartItemId);
    } finally {
      setIsRemoving(false);
    }
  };

  // Get product info - backend populates 'productId' field
  const product = (item as any).productId || item.product;
  const name = product?.name || 'Product';
  const price = item.price || product?.price || 0;
  const images = product?.images;
  const image = images && images.length > 0 ? images[0] : null;
  const description = product?.description || '';

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-dashed border-outline-variant/40">
      {/* Product Image */}
      <div className="w-full md:w-56 aspect-[3/4] bg-surface-container overflow-hidden rounded-xl relative group">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant bg-gradient-to-br from-surface-container-high to-surface-container">
            <span className="material-symbols-outlined text-5xl opacity-30 mb-2">
              image_not_supported
            </span>
            <span className="text-xs uppercase tracking-wider opacity-50">Sin imagen</span>
          </div>
        )}
        {/* Image overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
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
               <div className="flex items-center gap-2">
                 {(item as any).color && (
                   <div 
                     className="w-4 h-4 rounded-full border border-outline-variant"
                     style={{ backgroundColor: (item as any).color.startsWith('#') ? (item as any).color : '#8B7355' }}
                   />
                 )}
                 <span className="text-on-surface font-bold">{(item as any).color || 'Natural'}</span>
               </div>
             </div>
            <div>
              <span className="block mb-1 text-[10px] opacity-60">Quantity</span>
              <QuantitySelector
                quantity={item.quantity}
                onDecrease={() => handleQuantityChange(item.quantity - 1)}
                onIncrease={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || isSyncing}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleRemove}
            disabled={isRemoving || isSyncing}
            className="font-label text-xs uppercase tracking-widest text-primary border-b border-dashed border-primary/40 pb-1 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRemoving && (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isRemoving ? 'Removing...' : 'Remove Item'}
          </button>
        </div>
      </div>
    </div>
  );
}