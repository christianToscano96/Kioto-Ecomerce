import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ComboProductsDrawer } from "./ComboProductsDrawer";

interface ComboCardProps {
  combo: {
    _id: string;
    name: string;
    description?: string;
    products: Array<{ 
      _id: string; 
      name: string; 
      price: number; 
      images: string[] 
    } | string>;
    discount: number;
    originalPrice: number;
    comboPrice: number;
    createdAt?: Date | string;
  };
  size?: "sm" | "md";
}

export function ComboCard({ combo, size = "md" }: ComboCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const sizeConfig = {
    sm: { cardWidth: "w-80", imageHeight: "h-64", titleSize: "text-xl" },
    md: { cardWidth: "w-[350px]", imageHeight: "h-80", titleSize: "text-2xl" },
  };

  const images = combo.products?.slice(0, 5).map(p => 
    typeof p === 'string' ? '' : p.images?.[0]
  ).filter(Boolean) as string[];

  const config = sizeConfig[size];

  // Check if combo is new (< 7 days)
  const isNew = combo.createdAt && 
    (new Date().getTime() - new Date(combo.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  // Auto-rotate through images
  useEffect(() => {
    if (images && images.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images, isHovered]);

  return (
    <>
      <div
        className={`group block bg-white rounded-3xl shadow-lg overflow-hidden ${config.cardWidth} transition-all duration-300 hover:shadow-2xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/combos/${combo._id}`}
          className="block"
          aria-label={`Ver combo ${combo.name}`}
        >
          {/* LARGE IMAGE CAROUSEL */}
          <div className={`relative ${config.imageHeight} overflow-hidden`}>
            {images?.map((image, index) => {
              const isActive = index === activeIndex;
              const rotation = isActive ? 0 : (index - activeIndex) * 25;
              const zIndex = isActive ? 10 : images.length - Math.abs(index - activeIndex);

              return (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-700 rounded-3xl overflow-hidden"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${isActive ? 1 : 0.8})`,
                    opacity: isActive ? 1 : 0,
                    zIndex,
                  }}
                >
                  <img
                    src={image}
                    alt={`Producto ${index + 1} del combo`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Image counter badge */}
                  <div className="absolute top-4 right-4 bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                    {index + 1}/{images.length}
                  </div>
                </div>
              );
            })}

            {/* Discount badge */}
            <div className="absolute top-4 left-4 bg-primary text-on-primary text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              -{combo.discount}%
            </div>

            {/* New badge */}
            {isNew && (
              <div className="absolute top-4 left-20 bg-accent text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                ¡Nuevo!
              </div>
            )}

            {/* Carousel dots - overlay on image */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images?.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  aria-label={`Imagen ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* INFORMATION BOX - NOT ABSOLUTE, PART OF LAYOUT */}
          <div className="p-6 bg-gradient-to-b from-white to-surface-container">
            <div className="flex items-start justify-between mb-3">
              <h3 className={`font-serif font-bold text-on-surface ${config.titleSize} group-hover:text-primary transition-colors`}>
                {combo.name}
              </h3>
            </div>
            
            <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
              {combo.description}
            </p>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className={`font-serif font-bold text-primary ${size === 'sm' ? 'text-2xl' : 'text-3xl'}`}>
                ${combo.comboPrice.toLocaleString()}
              </span>
              <span className={`text-sm line-through text-on-surface-variant`}>
                ${combo.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs bg-primary-container text-primary px-2 py-1 rounded-full">
                Ahorras ${(combo.originalPrice - combo.comboPrice).toLocaleString()}
              </span>
            </div>

            {/* Products count and action */}
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant">
                  {combo.products?.length} productos incluidos
                </span>
              </div>
              
              <button
                className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDrawerOpen(true);
                }}
              >
                Ver productos
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Products Drawer */}
      <ComboProductsDrawer
        combo={combo}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}