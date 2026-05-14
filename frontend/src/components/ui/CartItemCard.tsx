import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@shared/index";
import { showToast } from "@/components/ui/Toast";
import { Plus, Minus, ImageOff, Loader2 } from '@/components/icons';

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
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center gap-1">
    <button
      onClick={onDecrease}
      disabled={disabled}
      className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-xs hover:text-primary transition-colors disabled:opacity-50 rounded border border-outline-variant min-h-[44px] min-w-[44px]"
      aria-label="Disminuir cantidad"
    >
      <Minus size={14} />
    </button>
    <span className="text-on-surface font-bold text-xs sm:text-sm min-w-[1.5ch] text-center">{quantity}</span>
    <button
      onClick={onIncrease}
      disabled={disabled}
      className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-xs hover:text-primary transition-colors disabled:opacity-50 rounded border border-outline-variant min-h-[44px] min-w-[44px]"
      aria-label="Aumentar cantidad"
    >
      <Plus size={14} />
    </button>
  </div>
);

export function CartItemCard({ item }: CartItemCardProps) {
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const isSyncing = useCartStore((state) => state.isSyncing);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the cart item ID (not product ID) - the _id from the cart item
  const cartItemId = (item as any)._id || item.productId;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateCartItem(cartItemId, newQuantity);
      showToast({ type: 'success', title: 'Cantidad actualizada' });
    } catch {
      showToast({ type: 'error', title: 'Error al actualizar cantidad' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await removeCartItem(cartItemId);
      showToast({ type: 'success', title: 'Producto eliminado del carrito' });
    } catch {
      showToast({ type: 'error', title: 'Error al eliminar producto' });
    } finally {
      setIsRemoving(false);
    }
  };

// Get product info - backend now populates 'product' field
   const product = item.product;
   const name = product?.name || "Product";
   const price = item.price || product?.price || 0;
   const images = product?.images;
   const image = images && images.length > 0 ? images[0] : null;
   const description = product?.description || "";

  return (
    <div className="flex flex-row md:flex-row gap-3 sm:gap-6 pb-6 sm:pb-8 border-b border-dashed border-outline-variant/40">
      {/* Product Image */}
      <div className="w-20 md:w-36 aspect-square bg-surface-container overflow-hidden rounded-lg relative shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant bg-gradient-to-br from-surface-container-high to-surface-container">
            <ImageOff size={24} className="opacity-30" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm sm:text-xl font-serif leading-tight line-clamp-1">{name}</h3>
            <p className="text-sm sm:text-xl font-serif text-primary ml-2 shrink-0">
              ${price.toFixed(2)}
            </p>
          </div>

          {/* Size/Color/Quantity Row - Horizontal on mobile */}
          <div className="flex items-center gap-3 sm:gap-6 font-label text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant mt-1 sm:mt-2">
            <div>
              <span className="block mb-0.5 opacity-60 hidden sm:block">Size</span>
              <span className="text-on-surface font-bold">{(item as any).size || "M"}</span>
            </div>
            <div className="flex items-center gap-1">
              {(item as any).color && (
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-outline-variant"
                  style={{
                    backgroundColor: (item as any).color.startsWith("#")
                      ? (item as any).color
                      : "#8B7355",
                  }}
                />
              )}
              <span className="text-on-surface font-bold">{(item as any).color || "Natural"}</span>
            </div>
            <div className="sm:ml-auto">
              <QuantitySelector
                quantity={item.quantity}
                onDecrease={() => handleQuantityChange(item.quantity - 1)}
                onIncrease={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || isSyncing}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 sm:mt-4">
          <button
            onClick={handleRemove}
            disabled={isRemoving || isSyncing}
            className="font-label text-[10px] sm:text-xs uppercase tracking-widest text-primary border-b border-dashed border-primary/40 pb-0.5 hover:border-primary transition-all disabled:opacity-50 min-h-[44px]"
          >
            {isRemoving && <Loader2 size={10} className="animate-spin inline mr-1" />}
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
