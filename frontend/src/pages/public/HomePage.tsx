import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useProducts } from '@/lib/api';
import { PublicHeader } from '@/components/layout/PublicHeader';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-terracota-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export function HomePage() {
  const { data: products, isLoading, error } = useProducts();

  // Get first 6 products for featured section
  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-crema-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-crema-100 to-crema-50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-chocolate-900 mb-4">
                Earthbound Curator
              </h1>
              <p className="text-lg md:text-xl text-chocolate-600 mb-8 max-w-2xl mx-auto">
                Curated collection of handcrafted goods that celebrate the beauty of our natural world
              </p>
              <Link to="/products">
                <Button size="lg">Shop Collection</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">
                Featured Products
              </h2>
              <p className="text-chocolate-600">
                Discover our handpicked selection of artisan goods
              </p>
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

            {featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
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
                        <h3 className="font-serif font-semibold text-chocolate-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-terracota-600 font-medium">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}