import React from "react";

interface ComboStackProps {
  images: string[];
  totalItems?: number;
  size?: "sm" | "md" | "lg";
}

export function ComboStack({ images, totalItems, size = "md" }: ComboStackProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const stackOffset = {
    sm: "ml-[-8px]",
    md: "ml-[-12px]",
    lg: "ml-[-16px]",
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-surface-container border-2 border-dashed border-outline-variant/30 flex items-center justify-center`}>
        <span className="material-symbols-outlined text-on-surface-variant">
          inventory_2
        </span>
      </div>
    );
  }

  const displayCount = Math.min(images.length, 4);

  return (
    <div className="relative" style={{ width: sizeClasses[size].split(' ')[0], height: sizeClasses[size].split(' ')[1] }}>
      {images.slice(0, displayCount).map((image, index) => {
        const rotation = (index - Math.floor(displayCount / 2)) * 8;
        const zIndex = displayCount - index;
        const offset = index * 4;

        return (
          <div
            key={index}
            className={`absolute rounded-lg overflow-hidden border-2 border-white shadow-lg ${sizeClasses[size]}`}
            style={{
              transform: `rotate(${rotation}deg) translateX(${offset}px)`,
              zIndex,
              left: 0,
              top: 0,
            }}
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      {totalItems && images.length > displayCount && (
        <div
          className={`absolute rounded-lg bg-on-surface/80 flex items-center justify-center text-on-primary text-xs font-bold ${sizeClasses[size]}`}
          style={{
            transform: `rotate(0deg) translateX(${displayCount * 4}px)`,
            zIndex: 0,
            left: 0,
            top: 0,
          }}
        >
          +{totalItems - displayCount}
        </div>
      )}
    </div>
  );
}