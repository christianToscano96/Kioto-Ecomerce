export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-dashed border-outline-variant/40">
      <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
        Filtros activos:
      </span>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container text-on-surface text-xs font-label uppercase tracking-wider rounded-full"
          >
            <span className="font-bold">{filter.label}:</span>
            <span>{filter.value}</span>
            <button
              onClick={() => onRemove(filter.id)}
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label={`Quitar filtro ${filter.label}`}
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </span>
        ))}
      </div>

      {onClearAll && (
        <button
          onClick={onClearAll}
          className="font-label text-xs uppercase tracking-widest text-primary hover:underline"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}