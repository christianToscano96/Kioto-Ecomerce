import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useProductsStore } from "@/store/products";
import { useCategoriesStore } from "@/store/categories";
import { useCartStore } from "@/store/cart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageContainer } from "@/components/ui/Container";
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
  const addToCart = useCartStore((state) => state.addToCart);

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
      

        {/* Welcome Banner - Feminine Elegant Style */}
        <PageContainer>
          <section className="bg-surface py-16 border-b border-outline-variant/10">
            <div className="flex flex-col lg:flex-row gap-12 items-center justify-beteween">
              {/* Left Content */}
              <div className="flex-1 max-w-xl">
                {/* Soft Badge */}
                <div className="inline-flex items-center gap-2 bg-primary-container/30 text-primary font-medium text-xs px-4 py-2 rounded-full mb-6 animate-fade-in">
                  <span className="material-symbols-outlined text-primary text-sm">favorite</span>
                  Colección Primavera 2025
                </div>
                
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-on-surface mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                  Tu Momento, <span className="text-primary">Tu Estilo</span>
                </h1>
                
                <p className="text-on-surface-variant text-base md:text-lg mb-8 max-w-md animate-fade-in" style={{ animationDelay: '200ms' }}>
                  Prendas únicas para realzar tu esencia. Calidad premium y detalles que amas.
                </p>
                
                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-medium text-sm px-8 py-3.5 rounded-full hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
                  >
                    Ver Catálogo
                  </Link>
                </div>
              </div>
              
              {/* Right Video */}
              <div className="flex-1 relative w-full max-w-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="relative rounded-2xl overflow-hidden max-w-lg">
                  <div className="aspect-video">
                    <video
                      src={kiotoVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
  {/* Flash Sale Banner - Shein Style */}
        <section className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 overflow-hidden">
          <PageContainer>
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 animate-pulse">
                <FlashIcon />
                <span>Oferta Flash: 50% OFF en productos seleccionados</span>
              </div>
              <span className="hidden sm:inline">|</span>
              <span>Envío gratis en pedidos +$60.000</span>
              <span className="hidden sm:inline">|</span>
              <span>Promos Imperdibles</span>
            </div>
          </PageContainer>
        </section>
          {/* Categories Section */}
          <section className="bg-surface py-10 border-b border-outline-variant/10 animate-on-scroll">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">
                Explorá por Categorías
              </h2>
              <p className="text-on-surface-variant text-sm">
                Encontrá lo que buscás en nuestras colecciones
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center stagger-children">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category.name}`}
                  className="group flex flex-col items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all duration-300 hover:shadow-md flex-shrink-0"
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
          </section>

          {/* Sale Banner */}
          {saleProducts.length > 0 && (
            <section className="bg-gradient-to-r from-amber-500 to-amber-400 text-white py-8 animate-on-scroll">
              <div className="text-center mb-6">
                <h2 className="font-serif text-3xl font-bold mb-2">
                  ¡Ofertas del Día!
                </h2>
                <p className="font-body">
                  Descuentos exclusivos por tiempo limitado
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 stagger-children">
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
            </section>
          )}

          {/* New Arrivals Grid */}
          <section className="py-12 relative animate-on-scroll">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
              {newProducts.map((product) => (
                <ProductCardGeneric
                  key={product._id}
                  product={product}
                  onQuickAdd={(_productId, options) => addToCart(product, options?.quantity || 1, options?.size)}
                />
              ))}
            </div>
          </section>

          {/* Promotional Banner */}
          <section className="py-8 animate-on-scroll">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Video */}
              <div className="flex-1 rounded-xl overflow-hidden aspect-video">
                <video
                  src={comprandoVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
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

          {/* Shipping Banner - Todo el País */}
          <section className="py-8 animate-on-scroll">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Text Content */}
              <div className="flex-1 bg-surface-container rounded-xl p-6 flex items-center">
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
                  
                  <div className="space-y-2 stagger-children">
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
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        </PageContainer>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}