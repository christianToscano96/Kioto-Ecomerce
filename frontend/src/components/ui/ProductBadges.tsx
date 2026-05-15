interface ProductBadgesProps {
  isNew?: boolean;
  isLimited?: boolean;
  stock?: number;
}

export function ProductBadges({ isNew, isLimited, stock }: ProductBadgesProps) {
  if (!isNew && !isLimited && stock !== undefined && stock > 5) return null;

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
      {isNew && (
        <span className="bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded-md">
          Nuevo
        </span>
      )}
      {isLimited && (
        <span className="bg-terracota-600 text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded-md">
          Edición Limitada
        </span>
      )}
      {stock !== undefined && stock <= 5 && stock > 0 && (
        <span className="bg-verde-bosque-600 text-on-primary font-label text-[10px] uppercase tracking-widest px-2 py-1 rounded-md">
          Últimas unidades
        </span>
      )}
    </div>
  );
}