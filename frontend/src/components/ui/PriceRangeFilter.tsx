interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeFilter({ 
  minPrice, 
  maxPrice, 
  value, 
  onChange 
}: PriceRangeFilterProps) {
  const [min, max] = value;

  return (
    <div className="border-t border-dashed border-outline-variant/40 pt-10">
      <h3 className="font-serif text-xl mb-6 text-on-surface italic">Rango de Precio</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-body">
          <span className="text-on-surface-variant">${min}</span>
          <span className="text-on-surface-variant">${max}</span>
        </div>
        
        <div className="flex gap-4">
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={min}
            onChange={(e) => onChange([Math.min(Number(e.target.value), max - 1), max])}
            className="w-full px-3 py-2 bg-surface-container text-on-surface text-sm font-body rounded-lg border border-outline-variant/40 focus:border-primary"
            placeholder="Min"
          />
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={max}
            onChange={(e) => onChange([min, Math.max(Number(e.target.value), min + 1)])}
            className="w-full px-3 py-2 bg-surface-container text-on-surface text-sm font-body rounded-lg border border-outline-variant/40 focus:border-primary"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}