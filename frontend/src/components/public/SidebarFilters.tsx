import { useState } from 'react';

interface SidebarFiltersProps {
  categories?: Array<{ name: string; count: number; active?: boolean }>;
  colors?: string[];
  sizes?: string[];
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  onCategoryClick?: (categoryName: string) => void;
}

const earthToneColors = [
  '#99452c', // primary (Terracota)
  '#735a3a', // tertiary (Brown)
  '#dbc1ba', // outline-variant (Light Brown)
  '#1c1c12', // on-background (Dark Brown)
  '#fdfae9', // background (Cream)
];

export function SidebarFilters({
  categories = [],
  colors = earthToneColors,
  sizes = ['XS', 'S', 'M', 'L', 'XL'],
  selectedSize = 'S',
  onSizeChange,
  onCategoryClick,
}: SidebarFiltersProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="space-y-12 sticky top-32">
        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="font-serif text-xl mb-6 text-on-surface italic">Categoría</h3>
            <ul className="space-y-4 font-label text-sm tracking-wide uppercase text-on-surface-variant">
              {categories.map((category) => (
                <li
                  key={category.name}
                  onClick={() => onCategoryClick?.(category.name)}
                  className={`flex justify-between items-center group cursor-pointer ${
                    category.active ? 'text-primary font-bold' : ''
                  }`}
                >
                  <span className="group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  <span className="text-[10px] text-outline opacity-60">({category.count})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Color Filter */}
        <div className="border-t border-dashed border-outline-variant/40 pt-10">
          <h3 className="font-serif text-xl mb-6 text-on-surface italic">Tonos Terrosos</h3>
          <div className="grid grid-cols-5 gap-3">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setActiveColor(color)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  activeColor === color
                    ? 'ring-2 ring-offset-2 ring-primary border border-white/20'
                    : 'border border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Filtrar por color ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="border-t border-dashed border-outline-variant/40 pt-10">
          <h3 className="font-serif text-xl mb-6 text-on-surface italic">Tallas</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange?.(size)}
                className={`px-3 py-1 text-xs border font-label transition-colors ${
                  selectedSize === size
                    ? 'border-primary text-primary font-bold'
                    : 'border-outline-variant/40 hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}