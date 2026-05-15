interface ProductSkeletonProps {
  count?: number;
  variant?: "grid" | "list" | "compact";
}

/** Shimmer base reutilizble */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{
        backgroundColor: "var(--color-surface-container)",
        animationDelay: style?.animationDelay || "0ms",
        ...style,
      }}
    />
  );
}

/** Esqueleto de card de producto en grilla */
export function ProductSkeleton({ count = 6, variant = "grid" }: ProductSkeletonProps) {
  if (variant === "list") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 py-4 border-b border-outline-variant/30 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Imagen */}
            <div className="w-32 h-32 bg-surface-container rounded-lg flex-shrink-0" />
            {/* Contenido */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="h-5 bg-surface-container rounded w-3/4 mb-2" />
                <div className="h-4 bg-surface-container rounded w-full mb-1" />
                <div className="h-4 bg-surface-container rounded w-5/6" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-surface-container rounded w-1/4" />
                <div className="h-8 bg-surface-container rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Grid variant (default)
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="aspect-[3/4] bg-surface-container rounded-lg mb-4"></div>
          <div className="h-4 bg-surface-container rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-surface-container rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-surface-container rounded w-full"></div>
        </div>
      ))}
    </>
  );
}

/** Esqueleto de producto en card compacta (para sección de ofertas) */
export function ProductCompactSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center p-3 bg-surface-container/50 rounded-lg">
      <div className="aspect-square w-full bg-surface-container rounded mb-2" />
      <div className="h-3 bg-surface-container rounded w-1/2 mb-1" />
      <div className="h-2 bg-surface-container rounded w-2/3" />
    </div>
  );
}

/** Esqueleto de categoría */
export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div className="w-16 h-16 bg-surface-container rounded-full" />
      <div className="h-3 bg-surface-container rounded w-12" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative stitch-border-left pl-6 animate-pulse">
      <div className="block">
        <div className="aspect-[3/4] bg-surface-container rounded-lg mb-6 animate-pulse"></div>
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-surface-container rounded w-2/3"></div>
          <div className="h-5 bg-surface-container rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-surface-container rounded w-full mb-2"></div>
        <div className="h-10 bg-surface-container rounded w-full"></div>
      </div>
    </div>
  );
}
