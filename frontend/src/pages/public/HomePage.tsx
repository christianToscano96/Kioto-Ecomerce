import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useProductsStore } from "@/store/products";
import { useCategoriesStore } from "@/store/categories";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCardGeneric } from "@/components/ui/ProductCardGeneric";
import comprandoVideo from '../../../assets/comprando.mp4';
import fleteVideo from '../../../assets/flete.mp4';
import kiotoVideo from '../../../assets/kioto.mp4';
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

        {/* Categories with Kioto Video - Hero Style */}
        <section className="bg-gradient-to-b from-surface-container to-surface py-10 border-b border-outline-variant/10 relative overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <video
              src={kiotoVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="max-w-screen-2xl mx-auto px-4 relative">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">
                Explorá por Categorías
              </h2>
              <p className="text-on-surface-variant text-sm">
                Encontrá lo que buscás en nuestras colecciones
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Video Player - Left Side */}
              <div className="flex-1 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto">
                  {/* Video with floating elements */}
                  <div className="aspect-[4/3] relative">
                    <video
                      src={kiotoVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Categories Grid - Right Side */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/products?category=${category.name}`}
                      className="group flex flex-col items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all duration-300 hover:shadow-md"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-container to-primary rounded-full flex items-center justify-center overflow-hidden shadow-md group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300">
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
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

{/* New Arrivals Grid */}
        <section className="max-w-screen-2xl mx-auto px-4 py-12 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                Nuevos Ingresos
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Descubre las últimas tendencias
              </p>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-primary font-label uppercase tracking-wider text-xs hover:underline"
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

        {/* Promotional Banner */}
        <section className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Video */}
            <div className="flex-1 rounded-xl overflow-hidden aspect-video">
              <video
                src={comprandoVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
            {/* Text Content */}
            <div className="flex-1 bg-surface-container rounded-xl p-6 flex items-center">
              <div className="max-w-md">
                <h2 className="font-serif text-2xl font-bold text-on-surface mb-3">
                  Colección Verano 2025
                </h2>
                <p className="text-on-surface-variant mb-4 text-sm">
                  Descubre las últimas tendencias en moda sostenible.
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-primary text-on-primary font-label uppercase tracking-widest text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Ver Colección
                </Link>
              </div>
            </div>

            
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

{/* Shipping Banner - Todo el País */}
        <section className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Text Content */}
            <div className="flex-1 bg-white/95 dark:bg-surface rounded-xl p-6 flex items-center border border-outline-variant/20 dark:border-outline-variant/10">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 bg-primary-container/20 rounded-full px-3 py-1 mb-3">
                  <span className="material-symbols-outlined text-base text-primary">
                    local_shipping
                  </span>
                  <span className="font-label uppercase tracking-wider text-xs text-primary font-medium">
                    Envíos a Todo el País
                  </span>
                </div>
                
                <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">
                  Recibe en Casa
                </h2>
                
                <p className="text-on-surface-variant mb-4 text-sm">
                  Envíos gratis en compras mayores a $50. 
                  Entrega en 24-48 horas en zonas urbanas.
                </p>
                
                <div className="space-y-2">
                  {[
                    { icon: 'check_circle', text: 'Seguimiento en tiempo real' },
                    { icon: 'check_circle', text: 'Empaque seguro' },
                    { icon: 'check_circle', text: 'Garantía de satisfacción' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-on-surface text-sm">
                      <span className="material-symbols-outlined text-primary text-sm">
                        {item.icon}
                      </span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="flex-1 rounded-xl overflow-hidden aspect-video">
              <video
                src={fleteVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

      
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
