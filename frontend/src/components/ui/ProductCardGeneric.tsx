import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductBadges } from "./ProductBadges";
import type { Product } from "../../../../shared/src";

interface ProductCardGenericProps {
  product: Product;
  onQuickAdd?: (
    productId: string,
    options?: { size?: string; color?: string; quantity?: number },
  ) => void;
  showQuickActions?: boolean;
}

const EyeIcon = () => (
  <span className="material-symbols-outlined text-sm">visibility</span>
);

const CartIcon = () => (
  <span className="material-symbols-outlined text-sm">shopping_bag</span>
);

const ChevronLeft = () => (
  <span className="material-symbols-outlined text-lg">chevron_left</span>
);

const ChevronRight = () => (
  <span className="material-symbols-outlined text-lg">chevron_right</span>
);

const MinusIcon = () => (
  <span className="material-symbols-outlined text-sm">remove</span>
);

const PlusIcon = () => (
  <span className="material-symbols-outlined text-sm">add</span>
);

export function ProductCardGeneric({
  product,
  onQuickAdd,
  showQuickActions = true,
}: ProductCardGenericProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const images = product.images || [];
  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const availableColors = product.colors || ["#000000"];

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

  const handleAddToCart = () => {
    if (onQuickAdd && product._id) {
      onQuickAdd(product._id, {
        size: selectedSize || availableSizes[0],
        color: selectedColor || availableColors[0],
        quantity,
      });
    }
  };

  return (
    <div className="group relative bg-surface-container-low rounded-lg overflow-hidden">
      {/* Image Container */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[3/4] bg-surface-container rounded-lg overflow-hidden relative">
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              Sin imagen
            </div>
          )}

          {/* Badges */}
          <ProductBadges isNew stock={product.stock} />

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
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
          {showQuickActions && (
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
      {showCartPanel && (
        <>
          <div className="absolute bottom-14 left-2 right-2 bg-surface-container-low rounded-lg shadow-lg p-3 z-20 mb-5">
            {/* Size Selection */}
            <div className="mb-3">
              <p className="font-label text-[10px] uppercase tracking-wider text-on-surface mb-1">
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
                    className={`w-7 h-6 text-[10px] rounded border transition-all ${
                      selectedSize === size
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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
                  className="w-6 h-6 rounded border border-outline-variant flex items-center justify-center"
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
                }}
                className="bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded"
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
