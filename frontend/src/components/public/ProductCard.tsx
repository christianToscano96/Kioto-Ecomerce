import { Link } from 'react-router-dom';
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
    <div className="group relative stitch-border-left pl-6">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[3/4] bg-surface-container overflow-hidden mb-6 rounded-lg">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              No image
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl text-on-surface">{product.name}</h3>
          <span className="font-serif text-primary">${product.price.toFixed(2)}</span>
        </div>

        <p className="text-on-surface-variant font-body text-sm mb-6 line-clamp-2">
          {product.description}
        </p>

        <button
          onClick={handleQuickAdd}
          className="w-full bg-primary text-on-primary font-label text-sm uppercase tracking-widest py-3 rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Quick Add
        </button>
      </Link>
    </div>
  );
}