import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart";
import { useToast } from "./Toast";
import { ProductBadges } from "./ProductBadges";
import { OptimizedImage } from "./OptimizedImage";
import type { Product } from "../../../../shared/src";

interface ProductCardGenericProps {
  product: Product;
  onQuickAdd?: (productId: string, options?: { size?: string; color?: string; quantity?: number }) => void;
  showQuickActions?: boolean;
}

const MinusIcon = () => (
  <span className="material-symbols-outlined text-sm">
    remove
  </span>
);

const PlusIcon = () => (
  <span className="material-symbols-outlined text-sm">
    add
  </span>
);

const EyeIcon = () => (
  <span className="material-symbols-outlined text-sm">
    visibility
  </span>
);

const CartIcon = () => (
  <span className="material-symbols-outlined text-sm">
    shopping_bag
  </span>
);

function ProductCardGenericComponent({
  product,
  onQuickAdd,
  showQuickActions = true,
}: ProductCardGenericProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  
const images = product.images || [];
   const availableSizes = product?.variants?.map(v => v.size) || product?.sizes || [];
   const availableColors = product?.colors || [];
   
   // Get stock for a specific size
   const getSizeStock = (size: string) => {
     if (!product?.variants) return 0;
     const variant = product.variants.find(v => v.size === size);
     return variant?.stock ?? 0;
   };
   
// Calculate total stock from variants or base stock
    const totalStock = product?.variants && product.variants.length > 0
      ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
      : product?.stock ?? 0;
    
    // Get stock for selected size or total
    const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : 0;
    const availableStock = product?.variants && product.variants.length > 0 
      ? (selectedSize ? selectedSizeStock : 0) 
      : totalStock;

   // Determine if product has sizes
    const hasSizes = availableSizes.length > 0;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

const handleAddToCart = async () => {
    // Check if size is required but not selected
    if (hasSizes && !selectedSize) {
      return;
    }
    
    try {
      await addToCart(product, quantity, selectedSize, selectedColor);
      addToast({
        type: 'success',
        title: '¡Agregado!',
        message: `${product.name} fue agregado al carrito`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo agregar al carrito',
      });
    }
  };

  return (
    <div className="group relative bg-surface-container-low rounded-lg overflow-hidden">
      {/* Image Container */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[3/4] bg-surface-container rounded-lg overflow-hidden relative">
{images.length > 0 ? (
              <OptimizedImage
                src={images[currentImageIndex]}
                alt={product.name}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                  totalStock === 0 ? "grayscale opacity-70" : ""
                }`}
              />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              Sin imagen
            </div>
          )}

{/* Badges */}
            <ProductBadges isNew stock={totalStock} />

            {/* Sold Out Overlay */}
            {totalStock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="font-label text-xs uppercase tracking-widest text-white bg-error/90 px-3 py-1.5 rounded">
                  Agotado
                </span>
              </div>
            )}

            {/* Image Navigation Arrows */}
            {images.length > 1 && totalStock > 0 && (
             <>
               <button
                 onClick={prevImage}
                 className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <span className="material-symbols-outlined text-sm">chevron_left</span>
               </button>
               <button
                 onClick={nextImage}
                 className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <span className="material-symbols-outlined text-sm">chevron_right</span>
               </button>
             </>
           )}

            {/* Image Indicators */}
            {images.length > 1 && totalStock > 0 && (
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
               {images.map((_, idx) => (
                 <button
                   key={idx}
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     setCurrentImageIndex(idx);
                   }}
                   className={`w-1.5 h-1.5 rounded-full transition-all ${
                     idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                   }`}
                 />
               ))}
             </div>
           )}

            {/* Quick Actions */}
            {showQuickActions && totalStock > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to={`/products/${product._id}`}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-surface-container transition-colors"
                title="Ver detalles"
              >
                <EyeIcon />
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCartPanel(!showCartPanel);
                }}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-surface-container transition-colors"
                title="Agregar al carrito"
              >
                <CartIcon />
              </button>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-body text-sm font-medium text-on-surface line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="font-serif text-primary font-bold">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>

{/* Expanded Cart Panel - Bottom overlay */}
       {showCartPanel && totalStock > 0 && (
         <>
           <div className="absolute bottom-14 left-2 right-2 bg-surface-container-low rounded-lg shadow-lg p-3 z-20 mb-5">
{/* Size Selection - only show if product has sizes */}
              {availableSizes.length > 0 && (
                <div className="mb-3">
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface mb-1">
                    Talla
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {availableSizes.map((size) => {
                      const sizeStock = getSizeStock(size);
                      const isOutOfStock = sizeStock === 0;
                      return (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isOutOfStock) setSelectedSize(size);
                          }}
                          disabled={isOutOfStock}
                          className={`w-7 h-6 text-[10px] rounded border transition-all relative ${
                            selectedSize === size
                              ? "bg-primary text-on-primary border-primary"
                              : isOutOfStock
                              ? "border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed opacity-50"
                              : "border-outline-variant hover:border-primary"
                          }`}
                        >
                          {size}
                          {isOutOfStock && (
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-error rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

             {/* Color Selection */}
             {availableColors.length > 0 && (
               <div className="mb-3">
                 <p className="font-label text-[10px] uppercase tracking-wider text-on-surface mb-1">
                   Color
                 </p>
                 <div className="flex gap-1">
                   {availableColors.map((color, idx) => (
                     <button
                       key={color}
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         setSelectedColor(color);
                       }}
                       className={`w-5 h-5 rounded-full border transition-all ${
                         selectedColor === color || (!selectedColor && idx === 0)
                           ? "border-primary"
                           : "border-outline-variant"
                       }`}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                 </div>
               </div>
             )}

{/* Quantity and Add Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    disabled={availableStock === 0}
                    className="w-6 h-6 rounded border border-outline-variant flex items-center justify-center disabled:opacity-50"
                  >
                    <MinusIcon />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuantity(Math.min(availableStock, quantity + 1));
                    }}
                    disabled={quantity >= availableStock || availableStock === 0}
                    className="w-6 h-6 rounded border border-outline-variant flex items-center justify-center disabled:opacity-50"
                  >
                    <PlusIcon />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={availableSizes.length > 0 && !selectedSize}
                  className="bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded disabled:opacity-50"
                >
                  Agregar
                </button>
              </div>
           </div>

{/* Overlay to close panel */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowCartPanel(false)}
            />
          </>
        )}
      </div>
    );
  }

export const ProductCardGeneric = memo(ProductCardGenericComponent, (prev, next) => 
  prev.product._id === next.product._id &&
  prev.product.price === next.product.price &&
  prev.product.name === next.product.name &&
  prev.product.images?.join() === next.product.images?.join() &&
  prev.showQuickActions === next.showQuickActions
);
