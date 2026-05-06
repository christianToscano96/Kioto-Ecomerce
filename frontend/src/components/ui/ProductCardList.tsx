import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const availableColors = product.colors || ["#000000"];

  const handleAddToCart = () => {
    if (onQuickAdd && product._id) {
      onQuickAdd(product._id);
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                Sin imagen
              </div>
            )}
            <ProductBadges isNew stock={product.stock} />
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
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-verde-bosque-600 font-medium">
                  ¡Últimas {product.stock} unidades!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-terracota-600 font-medium">
                  Agotado
                </p>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCartPanel(!showCartPanel)}
                disabled={product.stock === 0}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  product.stock === 0
                    ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                <CartIcon />
              </button>

              {/* Quick Add Panel */}
              {showCartPanel && product.stock > 0 && (
                <>
                  <div className="absolute bottom-full right-0 mb-2 bg-surface-container-low rounded-lg shadow-lg p-3 w-64 z-20">
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
                        className="bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded"
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