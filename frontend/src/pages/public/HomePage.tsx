import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useProductsStore } from "@/store/products";
import { useCategoriesStore } from "@/store/categories";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCardGeneric } from "@/components/ui/ProductCardGeneric";

const FlashIcon = () => (
  <span className="material-symbols-outlined text-lg">bolt</span>
);

export function HomePage() {
  const { products, isLoading, fetchProducts } = useProductsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const newProducts = products?.slice(0, 10) || [];
  const saleProducts = products?.filter((p) => p.price < 50).slice(0, 6) || [];

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-10 w-10 border-3 border-primary border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <main>
        {/* Flash Sale Banner - Shein Style */}
        <section className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 overflow-hidden">
          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 animate-pulse">
              <FlashIcon />
              <span>Oferta Flash: 50% OFF en productos seleccionados</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <span>Envío gratis en pedidos +$300</span>
            <span className="hidden sm:inline">|</span>
            <span>Devolución gratis 60 días</span>
          </div>
        </section>

        {/* Categories Row - Shein Style */}
        <section className="bg-surface-container py-6 border-b border-outline-variant/20">
          <div className="max-w-screen-2xl mx-auto px-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-2">
              Categorías
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category.name}`}
                  className="flex-shrink-0 group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-container to-primary rounded-full flex items-center justify-center overflow-hidden">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-2xl text-on-primary">
                          category
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors text-center max-w-[80px] truncate">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals Grid */}
        <section className="max-w-screen-2xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-on-surface">
              Nuevos Ingresos
            </h2>
            <Link
              to="/products"
              className="text-sm font-label uppercase tracking-widest text-primary hover:underline"
            >
              Ver todo
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newProducts.map((product, index) => (
              <ProductCardGeneric
                key={product._id}
                product={product}
                onQuickAdd={() => {}}
              />
            ))}
          </div>
        </section>

        {/* Sale Banner */}
        {saleProducts.length > 0 && (
          <section className="bg-gradient-to-r from-amber-500 to-amber-400 text-white py-8">
            <div className="max-w-screen-2xl mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="font-serif text-3xl font-bold mb-2">
                  ¡Ofertas del Día!
                </h2>
                <p className="font-body">
                  Descuentos exclusivos por tiempo limitado
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {saleProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
                  >
                    <div className="aspect-square bg-white/20 rounded mb-2 overflow-hidden">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-xs font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs line-through opacity-70">
                      ${(product.price * 1.5).toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quick Stats Bar */}
        <section className="bg-surface py-8 border-t border-outline-variant/20">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-serif text-2xl font-bold text-primary">
                  24h
                </p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Envío rápido
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-primary">
                  100%
                </p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Satisfacción
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-primary">
                  60 días
                </p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Devoluciones
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
