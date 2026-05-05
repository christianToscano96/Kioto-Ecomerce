import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCartIsSyncing, useCartStore } from "@/store/cart";
import { useProductsStore, useProductsError } from "@/store/products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import type { Product } from "../../../../shared/src/index";

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

// Size Selector Component
const SizeSelector = ({
  sizes,
  selectedSize,
  onSelectSize,
}: {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}) => (
  <div>
    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-label">
      Seleccionar Talla
    </span>
    <div className="flex gap-4 mt-4">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelectSize(size)}
          className={`w-12 h-12 flex items-center justify-center border transition-colors text-sm font-medium ${
            selectedSize === size
              ? "border-2 border-primary text-primary"
              : "border border-outline-variant hover:border-primary"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

// Accordion Section Component
const AccordionSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <details className="group py-6 border-b border-dashed border-outline-variant/40">
    <summary className="flex justify-between items-center cursor-pointer list-none">
      <span className="text-sm font-bold uppercase tracking-widest font-label">
        {title}
      </span>
      <span className="material-symbols-outlined transition-transform group-open:rotate-180">
        expand_more
      </span>
    </summary>
    <div className="mt-4 text-sm text-on-surface-variant leading-relaxed space-y-2">
      {children}
    </div>
  </details>
);

// Related Product Card Component
const RelatedProductCard = ({ product }: { product: Product }) => (
  <div className="min-w-[280px] bg-surface-container-highest p-4 snap-start group">
    <div className="aspect-[3/4] overflow-hidden mb-4 rounded">
      <img
        src={
          product.images?.[0] ||
          "https://placehold.co/400x500/fdfae9/99452c?text=Product"
        }
        alt={product.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
      />
    </div>
    <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1 font-label">
      Earthbound Essentials
    </p>
    <h3 className="text-lg font-serif">{product.name}</h3>
    <p className="text-sm mt-1 text-on-surface-variant font-serif">
      ${product.price.toFixed(2)}
    </p>
  </div>
);

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const product = useProductsStore((state) => state.product);
  const isLoading = useProductsStore((state) => state.isLoading);
  const fetchProduct = useProductsStore((state) => state.fetchProduct);
  const productsError = useProductsError();
  const { products: allProducts } = useProductsStore();
  const { addToCart, isSyncing } = useCartStore();

  // Fetch product when id changes
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  // Fetch related products on mount
  useEffect(() => {
    useProductsStore.getState().fetchProducts();
  }, []);

  // Default sizes if not provided by product
  const sizes = product?.sizes || ["S", "M", "L"];

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;
    try {
      await addToCart(product, 1, selectedSize);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[600px] bg-background">
          <LoaderIcon />
        </div>
      </>
    );
  }

  if (productsError || !product) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="p-4 bg-primary-container text-on-primary rounded-lg text-center">
            Producto no encontrado o error al cargar.
          </div>
        </div>
      </>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://placehold.co/800x1000/fdfae9/1c1c12?text=Product"];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-8 py-12 mt-12">
        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Product Image Section */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Image */}
            <div className="relative bg-surface-container-low overflow-hidden rounded-lg">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`bg-surface-container rounded-lg overflow-hidden h-64 transition-all ${
                      selectedImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-5 border-l border-dashed border-outline-variant/40 pl-8 lg:pl-16">
            {/* Breadcrumbs */}
            <nav className="mb-8">
              <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-label">
                Colecciones / Knitwear
              </span>
            </nav>

            {/* Product Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-on-surface mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-serif text-primary mb-8">
              ${product.price.toFixed(2)}
            </p>

            {/* Product Description */}
            <div className="space-y-6 mb-12">
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {product.description ||
                  "Cosecha de altas montañas donde el aire es puro. Esta prenda es una conversación entre la tierra y quien la lleva."}
              </p>
              <p className="text-on-surface-variant italic border-l-2 border-primary/20 pl-4">
                "Una pieza que no solo se lleva, sino que se vive."
              </p>
            </div>

            {/* Selectors & Add to Cart */}
            <div className="space-y-8 mb-12">
              <SizeSelector
                sizes={sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isSyncing}
                className="w-full bg-primary-container text-on-primary-container py-5 rounded-lg font-bold uppercase tracking-widest font-label hover:bg-primary transition-all duration-300 shadow-md disabled:opacity-50"
              >
                {isSyncing
                  ? "Añadiendo..."
                  : "Añadir al Carrito"}
              </button>
            </div>

            {/* Accordions */}
            <div className="space-y-0 border-t border-dashed border-outline-variant/40">
              <AccordionSection title="Material & Cuidado">
                <p>
                  {product.materials ||
                    "100% Wool orgánico. Lavar a mano con agua fría y jabón neutro. Secar a la sombra."}
                </p>
              </AccordionSection>

              <AccordionSection title="Información de Envío">
                <p>
                  Entrega estándar en 5-7 días hábiles. Nuestro embalaje es 100%
                  libre de plástico.
                </p>
              </AccordionSection>
            </div>
          </div>
        </div>

        {/* Complete the Look Section */}
        {allProducts && allProducts.length > 1 && (
          <section className="mt-32">
            <h2 className="text-3xl font-serif mb-12 italic">
              Completa el Look
            </h2>
            <div className="bg-surface-container-low p-8 rounded-xl overflow-x-auto flex gap-8 snap-x">
              {allProducts.slice(0, 3).map((relatedProduct) => (
                <RelatedProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
