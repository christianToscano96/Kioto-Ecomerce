import { Link } from "react-router-dom";
import { useProductsStore } from "@/store/products";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCard } from "@/components/home/ProductCardHome";
import { SectionHeader } from "@/components/home/SectionHeader";
import { EditorialSection } from "@/components/home/EditorialSection";

export function HomePage() {
  const { products, isLoading, error, fetchProducts } = useProductsStore();
  const featuredProducts = products?.slice(0, 3) || [];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <Header />

      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Product Grid Section */}
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
<SectionHeader
          title="Esenciales Seleccionados"
          description="Siluetas curadas diseñadas para una vida en armonía con las estaciones."
        />

          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-primary-container text-on-primary rounded-lg text-center max-w-md mx-auto">
              Error al cargar productos. Por favor, intenta de nuevo.
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Editorial Section */}
        <EditorialSection
          image="https://images.unsplash.com/photo-1532452109234-9fc7e8c3c0b5?w=1200&q=80"
          imageAlt="Artistic fashion portrait with natural fabrics"
          title="El Arte de la Quietud"
          quote="La moda es la piel que elegimos para nuestras almas."
        >
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            Nuestra colección es un diálogo entre la artesanía humana y los
            materiales crudos que nos brinda la tierra. Cada puntada es
            intencional, cada tela es obtenida de forma ética, y cada diseño
            está hecho para durar más allá de la moda.
          </p>
          <div className="border-l-2 border-primary pl-6 py-2">
            <p className="text-sm font-bold uppercase tracking-widest mb-2">
              Promesa Sostenible
            </p>
            <p className="text-sm text-on-surface-variant italic">
              100% Cadena de suministro trazable desde la tierra hasta el
              estante.
            </p>
          </div>
        </EditorialSection>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
