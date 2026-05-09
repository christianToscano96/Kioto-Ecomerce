import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cart";
import { useToast } from "./Toast";
import { ProductBadges } from "./ProductBadges";
import type { Product } from "../../../../shared/src";

interface ProductCardListProps {
  product: Product;
  onQuickAdd?: (productId: string) => void;
}

const CartIcon = () => (
  <span className="material-symbols-outlined text-sm">
    shopping_bag
  </span>
);

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

export function ProductCardList({ product, onQuickAdd }: ProductCardListProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToast } = useToast();
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const availableSizes = product.variants?.map(v => v.size) || product.sizes || [];
  const availableColors = product.colors || [];
  
  // Calculate total stock from variants or base stock
  const totalStock = product.variants?.length > 0
    ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
    : product.stock;

  // Determine if product has sizes
  const hasSizes = availableSizes.length > 0;

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
    <div className="group bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/40 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
<Link to={`/products/${product._id}`} className="block sm:w-48 flex-shrink-0">
           <div className="aspect-[3/4] sm:aspect-square bg-surface-container rounded-lg overflow-hidden relative">
             {product.images?.[0] ? (
<img
                  src={product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    totalStock === 0 ? "grayscale opacity-60" : ""
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                  Sin imagen
                </div>
              )}
              <ProductBadges isNew={false} stock={totalStock} />
              {/* Sold Out Overlay */}
              {totalStock === 0 && (
               <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                 <span className="font-label text-xs uppercase tracking-widest text-white bg-error/90 px-3 py-1.5 rounded">
                   Agotado
                 </span>
               </div>
             )}
           </div>
         </Link>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex-1">
            <Link to={`/products/${product._id}`}>
              <h3 className="font-serif text-xl font-bold text-on-surface mb-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-on-surface-variant font-body text-sm mb-4 line-clamp-3">
              {product.description}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="font-serif text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              {totalStock <= 5 && totalStock > 0 && (
                <p className="text-xs text-verde-bosque-600 font-medium">
                  ¡Últimas {totalStock} unidades!
                </p>
              )}
              {totalStock === 0 && (
                <p className="text-xs text-terracota-600 font-medium">
                  Agotado
                </p>
              )}
            </div>

            <div className="relative">
              {/* Quick Add Panel */}
              {showCartPanel && totalStock > 0 && (
                <>
                  <div className="absolute bottom-full right-0 mb-2 bg-surface-container-low rounded-lg shadow-lg p-3 w-64 z-20">
                    {/* Size Selection - only show if product has sizes */}
                    {availableSizes.length > 0 && (
                      <div className="mb-3">
                        <p className="font-label text-[10px] uppercase tracking-wider text-on-surface mb-2">
                          Talla
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSize(size);
                              }}
                              className={`w-8 h-7 text-[10px] rounded border transition-all ${
                                selectedSize === size
                                  ? "bg-primary text-on-primary border-primary"
                                  : "border-outline-variant"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuantity(Math.max(1, quantity - 1));
                          }}
                          className="w-6 h-6 rounded border border-outline-variant flex items-center justify-center"
                        >
                          <MinusIcon />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuantity(Math.min(10, quantity + 1));
                          }}
                          className="w-6 h-6 rounded border border-outline-variant flex items-center justify-center"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart();
                          setShowCartPanel(false);
                        }}
                        disabled={availableSizes.length > 0 && !selectedSize}
                        className="bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded disabled:opacity-50"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowCartPanel(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}