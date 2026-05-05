import { Link } from 'react-router-dom';
import { Button } from './Button';
import { useState } from 'react';

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  stock?: number;
  sizes?: string[];
}

export function ProductCard({ 
  _id, 
  name, 
  price, 
  images, 
  description, 
  stock = 0,
  sizes = ['S', 'M', 'L']
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImageIndex] = useState(0);

  return (
    <div className="group bg-surface-container rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl border-l border-dashed border-outline-variant">
      {/* Product Image - 70% of card */}
      <div className="aspect-[3/4] overflow-hidden relative">
        {images && images.length > 0 ? (
          <img
            src={images[selectedImageIndex]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <span className="text-on-surface-variant">No image</span>
          </div>
        )}
        {/* IN STOCK badge */}
        {stock > 0 && (
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest">
            In Stock
          </div>
        )}
        {/* Favorite button - outline chocolate */}
        <button 
          className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-2 rounded-full text-on-surface hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">favorite</span>
        </button>
      </div>
      
      {/* Product Info - 30% of card */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-serif text-on-surface mb-1">{name}</h3>
            {description && (
              <p className="text-sm text-on-surface-variant/60 font-body">
                {description}
              </p>
            )}
          </div>
          <span className="font-serif text-lg text-primary ml-4">${price.toFixed(2)}</span>
        </div>
        
        {/* Size Selector */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-on-surface-variant/60 font-label">
            Select Size
          </span>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 border rounded-lg text-xs transition-colors ${
                  selectedSize === size
                    ? 'border-primary bg-primary-fixed text-on-primary-container font-bold'
                    : 'border-outline-variant hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          disabled={stock === 0}
          className={`w-full py-3 rounded-lg font-bold tracking-widest uppercase text-xs transition-all shadow-lg active:scale-[0.98] ${
            stock > 0
              ? 'bg-primary text-on-primary hover:bg-primary-container'
              : 'bg-on-surface/20 text-on-surface-variant cursor-not-allowed'
          }`}
        >
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}