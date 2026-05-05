import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductsStore } from "@/store/products";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/public/ProductCard";
import { SidebarFilters } from "@/components/public/SidebarFilters";
import { useCartStore } from "@/store/cart";
import { PageContainer } from "@/components/ui/Container";

const LoaderIcon = () => (
  <svg
    className="animate-spin h-8 w-8 text-primary"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
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
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSize, setSelectedSize] = useState("S");
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
        p.slug.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  const handleQuickAdd = async (productId: string) => {
    const product = products?.find((p) => p._id === productId);
    if (product) {
      try {
        await addToCart(product, 1);
      } catch (error) {
        console.error("Error al agregar al carrito:", error);
      }
    }
  };

  // Categorías (en producción vendrían del API)
  const categories = [
    { name: "Suéteres", count: 12 },
    { name: "Pantalones de Lino", count: 8, active: true },
    { name: "Accesorios", count: 24 },
    { name: "Ropa de Exterior", count: 6 },
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
            Error al cargar los productos. Por favor, intenta nuevamente.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{stitchBorderStyle}</style>
      <PublicHeader />

      <PageContainer>
        {/* Encabezado Narrativo */}
        <header className="mb-16 mt-16">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4 block">
            Selección de Temporada
          </span>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-on-surface">
            Nuevas Llegadas
          </h1>
          <p className="mt-6 text-on-surface-variant max-w-2xl font-body text-lg leading-relaxed">
            Una colección de esenciales terrenales, hechos con fibras orgánicas
            y teñidos con la calidez de la tierra. Cada pieza es un testimonio
            del toque artesanal.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filtros Laterales */}
          <SidebarFilters
            categories={categories}
            sizes={["XS", "S", "M", "L", "XL"]}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />

          {/* Grid de Productos */}
          <section className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-on-surface-variant">
                  {searchQuery
                    ? "Ningún producto coincide con tu búsqueda."
                    : "Aún no hay productos disponibles."}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-on-surface-variant mb-4">
                  Mostrando {filteredProducts.length} producto
                  {filteredProducts.length !== 1 ? "s" : ""}
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

                {/* Botón Ver Más */}
                <div className="mt-20 flex justify-center">
                  <button className="font-label text-sm uppercase tracking-[0.2em] px-12 py-4 border border-outline-variant hover:border-primary transition-colors text-on-surface group">
                    Ver Más
                    <span className="inline-block transition-transform group-hover:translate-y-1">
                      ↓
                    </span>
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </PageContainer>

      <Footer />
    </>
  );
}
