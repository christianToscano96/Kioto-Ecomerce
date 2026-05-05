import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductsStore } from '@/store/products';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/public/ProductCard';
import { SidebarFilters } from '@/components/public/SidebarFilters';
import { useCartStore } from '@/store/cart';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Style for stitch border
const stitchBorderStyle = `
  .stitch-border-left {
    border-left: 1px dashed rgba(219, 193, 186, 0.4);
  }
`;

export function ProductsListPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSize, setSelectedSize] = useState('S');
  const { products, isLoading, error } = useProductsStore();
  const fetchProducts = useProductsStore.getState().fetchProducts;
  const addToCart = useCartStore.getState().addToCart;

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleQuickAdd = async (productId: string) => {
    const product = products?.find((p) => p._id === productId);
    if (product) {
      try {
        await addToCart(product, 1);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  // Categories data (would come from API in real app)
  const categories = [
    { name: 'Sweaters', count: 12 },
    { name: 'Linen Pants', count: 8, active: true },
    { name: 'Accessories', count: 24 },
    { name: 'Outerwear', count: 6 },
  ];

  if (isLoading) {
    return (
      <>
        <style>{stitchBorderStyle}</style>
        <PublicHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoaderIcon />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="p-4 bg-primary-container text-on-primary rounded-lg text-center max-w-md">
            Error loading products. Please try again.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{stitchBorderStyle}</style>
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Narrative Header */}
        <header className="mb-16">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4 block">
            Seasonal Selection
          </span>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-on-surface">
            New Arrivals
          </h1>
          <p className="mt-6 text-on-surface-variant max-w-2xl font-body text-lg leading-relaxed">
            A collection of earthbound essentials, crafted from organic fibers and dyed with the warmth of the soil. Each piece is a testament to the artisan's touch.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <SidebarFilters
            categories={categories}
            sizes={['XS', 'S', 'M', 'L', 'XL']}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />

          {/* Product Grid */}
          <section className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-on-surface-variant">
                  {searchQuery ? 'No products match your search.' : 'No products available yet.'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-on-surface-variant mb-4">
                  Showing {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? 's' : ''}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-12">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>

                {/* Show More Button */}
                <div className="mt-20 flex justify-center">
                  <button className="font-label text-sm uppercase tracking-[0.2em] px-12 py-4 border border-outline-variant hover:border-primary transition-colors text-on-surface group">
                    Show More
                    <span className="inline-block transition-transform group-hover:translate-y-1">
                      ↓
                    </span>
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}