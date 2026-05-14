import { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  priority?: boolean;
}

// Helper to use Vercel Image Optimization
const getOptimizedImageUrl = (
  src: string, 
  width?: number, 
  quality = 75
): string => {
  // If already using Vercel image optimization path
  if (src.startsWith('/_vercel/image')) return src;
  
  // For local assets, return as-is (Vercel will optimize at build)
  if (src.startsWith('/') || src.startsWith('./')) return src;
  
  // For remote URLs, use Vercel image optimizer in production
  if (import.meta.env.PROD && !src.startsWith('http')) return src;
  
  // External URLs - skip Vercel optimization for Cloudinary (already optimized)
  if (src.startsWith('http')) {
    // Skip optimization for Cloudinary URLs (they're already optimized)
    if (src.includes('cloudinary.com')) return src;
    
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    return `/_vercel/image?url=${encodeURIComponent(src)}&${params.toString()}`;
  }
  
  return src;
};

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  quality = 75,
  priority = false,
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const optimizedSrc = getOptimizedImageUrl(src, width, quality);

  if (hasError) {
    return (
      <div className={`bg-surface-container flex items-center justify-center ${className}`}>
        <span className="text-on-surface-variant text-xs">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}