import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useProductsStore } from '@/store/products';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { ProductItem } from '@/components/ui/ProductItem';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export function HomePage() {
  const { products, isLoading, error, fetchProducts } = useProductsStore();
  const featuredProducts = products?.slice(0, 3) || [];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <Header />
      <main className="pt-16"> {/* Account for fixed header */}
        {/* Hero Section - Earthbound Curator Style */}
        <section className="min-h-[921px] flex items-center px-8 md:px-20 overflow-hidden bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10 order-2 md:order-1">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-body">
                Edición Limitada
              </span>
              <h1 className="text-6xl md:text-8xl font-serif text-on-surface leading-tight mb-6 tracking-tight">
                Esenciales <br/> <span className="italic">Hechos a Mano</span> <br/> para Vivir
              </h1>
              <p className="text-xl text-on-surface-variant max-w-md mb-10 leading-relaxed font-light">
                Objetos que honran tanto la artesanía como el paso del tiempo. Hechos con materiales naturales que envejecen con belleza.
              </p>
              <Link to="/products">
                <Button className="bg-primary text-on-primary px-10 py-4 rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.98]">
                  Descubrir la Colección
                </Button>
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transform rotate-2">
                <img 
                  src="https://placehold.co/800x1000/fdfae9/1c1c12?text=Hero+Image" 
                  alt="Artisan crafted objects on natural linen background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-surface-container-highest rounded-lg -z-10 opacity-50"></div>
            </div>
          </div>
        </section>

        {/* Product Grid Section - Selected Essentials */}
        <section className="max-w-screen-2xl mx-auto px-8 py-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-4xl font-serif text-on-surface mb-4">Esenciales Seleccionados</h2>
              <p className="text-on-surface-variant max-w-sm">
                Siluetas curadas diseñadas para una vida en armonía con las estaciones.
              </p>
            </div>
            <Link to="/products" className="text-primary border-b border-dashed border-outline-variant pb-1 text-xs uppercase tracking-widest hover:border-primary transition-all">
              Ver Colección
            </Link>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderIcon />
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
                <ProductItem key={product._id} {...product} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Section - Asymmetric Editorial */}
        <section className="bg-surface-container py-32 px-8">
          <div className="max-w-screen-2xl mx-auto grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 relative">
              <img
                src="https://placehold.co/800x600/fdfae9/1c1c12?text=Artisan+Portrait"
                alt="Artisan working with natural materials"
                className="w-full h-[600px] object-cover rounded-xl shadow-lg"
              />
              <div className="absolute -top-6 -right-6 md:w-64 p-8 bg-background shadow-2xl rounded-lg hidden md:block">
                <span className="font-serif text-3xl italic text-primary">"Fashion is the skin we choose for our souls."</span>
              </div>
            </div>
            <div className="md:col-span-5 md:pl-12">
              <h2 className="text-5xl font-serif text-on-surface mb-8 leading-tight">El Arte de la Quietud</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Nuestra colección es un diálogo entre la artesanía humana y los materiales crudos que nos brinda la tierra. Cada puntada es intencional, cada tela es obtenida de forma ética.
              </p>
              <div className="border-l-2 border-primary pl-6 py-2">
                <p className="text-sm font-bold uppercase tracking-widest mb-2">Promesa Sostenible</p>
                <p className="text-sm text-on-surface-variant italic">100% Cadena de suministro trazable desde la tierra hasta el estante.</p>
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