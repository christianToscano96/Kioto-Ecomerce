import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useProducts } from '@/lib/api';
import { PublicHeader } from '@/components/layout/PublicHeader';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-terracota-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5 text-chocolate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export function ProductsListPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { data: products, isLoading, error } = useProducts();

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

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-crema-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">
              Products
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderIcon />
            </div>
          )}

          {error && (
            <div className="p-4 bg-terracota-50 text-terracota-700 rounded-lg text-center">
              Error loading products. Please try again.
            </div>
          )}

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-chocolate-600">
                {searchQuery ? 'No products match your search.' : 'No products available yet.'}
              </p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <>
              <p className="text-sm text-chocolate-500 mb-4">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product._id} variant="elevated" className="overflow-hidden">
                    <Link to={`/products/${product._id}`}>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-chocolate-100 flex items-center justify-center">
                          <span className="text-chocolate-400">No image</span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-serif font-semibold text-chocolate-900 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-chocolate-600 text-sm mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-terracota-600 font-medium text-lg">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}