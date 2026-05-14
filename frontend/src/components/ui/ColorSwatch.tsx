import type { ReactNode } from 'react';

interface ColorSwatchProps {
  colors: string[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export function ColorSwatch({ colors, selectedColor, onSelectColor }: ColorSwatchProps) {
  return (
    <div className="mt-8">
      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-label">
        Seleccionar Color
      </span>
      <div className="flex gap-3 mt-4">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`w-11 h-11 rounded-full border-2 transition-all min-h-[44px] min-w-[44px] ${
              selectedColor === color
                ? "border-primary scale-110"
                : "border-outline-variant hover:border-primary hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}