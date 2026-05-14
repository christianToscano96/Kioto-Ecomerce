import type { Product } from "@shared/index";

interface StockInfo {
  totalStock: number;
  variantStock: Record<string, number>;
  getVariantStock: (size?: string) => number;
  hasVariants: boolean;
}

/**
 * Hook to calculate product stock from variants or base stock
 * Eliminates duplicated stock calculation logic across components
 */
export function useProductStock(product: Product | null | undefined): StockInfo {
  const totalStock = product?.variants && product.variants.length > 0
    ? product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
    : product?.stock ?? 0;

  const variantStock = product?.variants?.reduce((acc: Record<string, number>, v: any) => {
    acc[v.size] = v.stock ?? 0;
    return acc;
  }, {}) ?? {};

  const getVariantStock = (size?: string) => {
    if (!size) return 0;
    if (!product?.variants) return totalStock;
    const variant = product.variants.find((v: any) => v.size === size);
    return variant?.stock ?? 0;
  };

  return {
    totalStock,
    variantStock,
    getVariantStock,
    hasVariants: Boolean(product?.variants && product.variants.length > 0),
  };
}