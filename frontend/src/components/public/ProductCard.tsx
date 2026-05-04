import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Product } from '../../../../shared/src/index';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

export function ProductCard({ product, onAddToCart, showAddToCart = true }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  return (
    <Card variant="elevated" className="overflow-hidden flex flex-col h-full">
      <Link to={`/products/${product._id}`} className="flex-1 flex flex-col">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-chocolate-100 flex items-center justify-center">
            <span className="text-chocolate-400">No image</span>
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif font-semibold text-chocolate-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-chocolate-600 text-sm mb-2 line-clamp-2 flex-1">
            {product.description}
          </p>
          <p className="text-terracota-600 font-medium text-lg">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      {showAddToCart && onAddToCart && (
        <div className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full" size="sm">
            Add to Cart
          </Button>
        </div>
      )}
    </Card>
  );
}