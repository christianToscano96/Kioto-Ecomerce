import type { ProductVariant } from "../../../../shared/src";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  variants?: ProductVariant[];
}

export function SizeSelector({ sizes, selectedSize, onSelectSize, variants }: SizeSelectorProps) {
  // Get stock for a specific size
  const getSizeStock = (size: string) => {
    if (!variants) return 0;
    const variant = variants.find(v => v.size === size);
    return variant?.stock ?? 0;
  };

  return (
    <div className="mb-8">
      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-label">
        Seleccionar Talla
      </span>
      <div className="flex flex-wrap gap-3 mt-4">
        {sizes.map((size) => {
          const stock = getSizeStock(size);
          const isOutOfStock = stock === 0;
          
          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onSelectSize(size)}
              disabled={isOutOfStock}
              className={`relative px-4 py-2 border transition-all ${
                selectedSize === size
                  ? "border-primary bg-primary-container text-on-primary-container"
                  : isOutOfStock
                  ? "border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed opacity-50"
                  : "border-outline-variant hover:border-primary"
              }`}
            >
              <span className="font-serif text-sm">{size}</span>
              {stock > 0 && stock <= 3 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-terracota-500 rounded-full" 
                  title={`¡Últimas ${stock} unidades!`} />
              )}
              {stock === 0 && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-error">Agotado</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Stock indicator for selected size */}
      {selectedSize && (
        <div className="mt-3 text-xs">
          {(() => {
            const stock = getSizeStock(selectedSize);
            if (stock === 0) return <span className="text-error">Agotado</span>;
            if (stock <= 2) return <span className="text-terracota-600">¡Últimas {stock} unidades!</span>;
            return <span className="text-on-surface-variant">{stock} unidades disponibles</span>;
          })()}
        </div>
      )}
    </div>
  );
}