import type { Product } from '../../../../shared/src/index';

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (productId: string) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickAdd?.(product._id);
  };

  return (
    <div className="group bg-surface-container rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl border-l-2 border-dashed border-outline-variant">
      <div className="aspect-[3/4] overflow-hidden relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
            Sin imagen
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button className="bg-surface/80 backdrop-blur-md p-2 rounded-full text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">favorite</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-serif text-on-surface">{product.name}</h3>
            <p className="text-on-surface-variant text-sm font-light mt-1">
              {product.description || 'Descripción del producto'}
            </p>
          </div>
          <span className="font-serif text-lg text-primary">${product.price.toFixed(2)}</span>
        </div>

        <div className="space-y-3">
          <span className="label-md text-[10px] uppercase tracking-widest text-on-surface-variant">
            Seleccionar Talla
          </span>
          <div className="flex gap-3">
            {['S', 'M', 'L'].map((size) => (
              <button
                key={size}
                className="w-10 h-10 border border-outline-variant rounded-lg text-xs hover:border-primary transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-full bg-[#e27d60] text-white py-4 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-primary transition-colors shadow-lg shadow-[#e27d60]/20 active:scale-[0.98]"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}