interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
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