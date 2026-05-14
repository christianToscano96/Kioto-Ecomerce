import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart } from '@/components/icons';

interface ProductItemProps {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  stock?: number;
}

export function ProductItem({ _id, name, price, images, description, stock = 0 }: ProductItemProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['S', 'M', 'L'];

  return (
    <Link to={`/products/${_id}`} className="group block">
      <div className="h-full bg-[#F1EDD6] rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl border-l border-dashed border-[#dbc1ba]">
        {/* Product Image - 65% of card */}
        <div className="aspect-[4/3] overflow-hidden relative">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="text-on-surface-variant text-sm">No image</span>
            </div>
          )}
          {/* Wishlist button - micro interaction */}
          <button
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-1.5 rounded-full text-on-surface hover:text-primary transition-colors"
            aria-label="Add to wishlist"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart size={16} />
          </button>
        </div>
        
        {/* Product Info - 35% of card */}
        <div className="p-5 space-y-3">
          {/* Product name - Noto Serif, chocolate brown */}
          <h3 className="text-xl font-serif text-[#3D1C16] group-hover:text-primary transition-colors">{name}</h3>
          
          {/* Material/Metadata - Manrope, reduced opacity */}
          {description && (
            <p className="text-xs text-on-surface-variant/60 font-body line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Price - Terracota accent */}
          <p className="text-lg font-serif text-[#E27D60]">${price.toFixed(2)}</p>
          
          {/* Size selector - immediate selection UX */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-label">
              Seleccionar Talla
            </span>
            <div className="flex gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`w-8 h-8 border rounded text-xs transition-colors ${
                    selectedSize === size
                      ? 'border-[#99452c] bg-[#ffdbd1] text-[#3b0900] font-bold'
                      : 'border-[#dbc1ba] text-on-surface hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* CTA Button - Terracota solid with cream text */}
          <button 
            disabled={stock === 0}
            onClick={(e) => e.stopPropagation()}
            className={`w-full bg-[#E27D60] text-[#F9F6E5] py-2.5 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-[#99452c] transition-colors shadow-lg shadow-[#E27D60]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </Link>
  );
}