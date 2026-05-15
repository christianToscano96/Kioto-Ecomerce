import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductsStore } from "@/store/products";
import { useCategoriesStore } from "@/store/categories";
import { productsApi } from "@/lib/api";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { ProductCardUnified } from "@/components/ui/ProductCardUnified";
import { SidebarFilters } from "@/components/public/SidebarFilters";
import { Drawer } from "@/components/ui/Drawer";
import { useCartStore } from "@/store/cart";
import { PageContainer } from "@/components/ui/Container";
import {
  ActiveFilters,
  type ActiveFilter,
} from "@/components/ui/ActiveFilters";
import { useToast } from "@/components/ui/Toast";
import { SortDropdown, type SortOption } from "@/components/ui/SortDropdown";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { PriceRangeFilter } from "@/components/ui/PriceRangeFilter";
import { Filter, ArrowLeft } from "@/components/icons";
import { BackButton } from "@/components/ui/BackButton";

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

export function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 640 : false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { products, isLoading, error } = useProductsStore();
  const fetchProducts = useProductsStore.getState().fetchProducts;
  const addToCart = useCartStore.getState().addToCart;
  const { categories: allCategories, fetchCategories } = useCategoriesStore();
  const { addToast } = useToast();

  // Fetch categories and colors on mount
  useEffect(() => {
    fetchCategories();
    productsApi.getColors().then(setAvailableColors).catch(console.error);
  }, [fetchCategories]);

  // Detectar cambios de tamaño de ventana para forzar vista lista en móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Price bounds
  const minPrice = useMemo(
    () => products?.reduce((min, p) => Math.min(min, p.price), Infinity) || 0,
    [products],
  );
  const maxPrice = useMemo(
    () => products?.reduce((max, p) => Math.max(max, p.price), 0) || 60000,
    [products],
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (params.toString()) {
      setSearchParams(params);
    } else {
      setSearchParams({});
    }
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Build categories from store - all categories with product counts
  const categories = useMemo(() => {
    // Count products per category
    const productCounts = new Map<string, number>();
    products?.forEach((p) => {
      const catName =
        typeof p.category === "object" &&
        p.category !== null &&
        "name" in p.category
          ? p.category.name
          : p.category;
      if (catName) {
        productCounts.set(String(catName), (productCounts.get(String(catName)) || 0) + 1);
      }
    });

    // Map all categories from store with product counts
    return allCategories.map((cat) => ({
      name: cat.name,
      count: productCounts.get(cat.name) || 0,
      active: cat.name === selectedCategory,
    }));
  }, [products, selectedCategory, allCategories]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];

    // Category filter - handle both populated object and ObjectId
    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        console.log(p);
        const catName =
          typeof p.category === "object" &&
          p.category !== null &&
          "name" in p.category
            ? p.category.name
            : p.category;
        return String(catName) === selectedCategory;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query),
      );
    }

    // Size filter (assuming we have size info in product)
    if (selectedSize) {
      filtered = filtered.filter((p) => p.sizes?.includes(selectedSize));
    }

    // Color filter
    if (selectedColor) {
      filtered = filtered.filter((p) => p.colors?.includes(selectedColor));
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedSize,
    selectedColor,
    sortBy,
    priceRange,
  ]);

  // Infinite scroll
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredProducts.length
        ) {
          setVisibleCount((prev) =>
            Math.min(prev + 6, filteredProducts.length),
          );
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [filteredProducts.length, visibleCount]);

  const handleQuickAdd = async (productId: string) => {
    const product = products?.find((p) => p._id === productId);
    if (product) {
      try {
        await addToCart(product, 1);
        // Show toast
        addToast({
          type: 'success',
          title: '¡Agregado!',
          message: `${product.name} fue agregado al carrito`,
        });
      } catch (error) {
        console.error("Error al agregar al carrito:", error);
      }
    }
  };

  // Active filters for display
  const activeFilters: ActiveFilter[] = [
    ...(selectedCategory
      ? [{ id: "category", label: "Categoría", value: selectedCategory }]
      : []),
    ...(selectedSize
      ? [{ id: "size", label: "Talla", value: selectedSize }]
      : []),
    ...(selectedColor
      ? [{ id: "color", label: "Color", value: selectedColor }]
      : []),
  ];

  const removeFilter = (id: string) => {
    if (id === "category") setSelectedCategory(null);
    if (id === "size") setSelectedSize(null);
    if (id === "color") setSelectedColor(null);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSearchQuery("");
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(
      selectedCategory === categoryName ? null : categoryName,
    );
  };

  if (isLoading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-background">
          <PageContainer>
            <div className="min-h-[600px] flex items-center justify-center">
              <LoaderIcon />
            </div>
          </PageContainer>
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

  const effectiveVariant = isMobile ? "list" : view;

  return (
    <>
      <PublicHeader />

      <PageContainer>
      
        <header className="mb-2 md:mb-16 mt-2 md:mt-16">
            <div className="text-center mt-2">
                <BackButton label="Volver" showLabelOnMobile={true} />
            </div>
         
        </header>

        {/* Active Filters */}
        <ActiveFilters
          filters={activeFilters}
          onRemove={removeFilter}
          onClearAll={activeFilters.length > 1 ? clearAllFilters : undefined}
        />

<div className="flex flex-col lg:flex-row gap-8 md:gap-16">
        {/* Mobile Filter Button */}
          <div className="lg:hidden px-4">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border border-outline-variant/40 rounded-lg font-label text-xs uppercase tracking-widest hover:bg-surface-container min-h-[44px]"
            >
              <Filter size={18} />
              Filtrar productos
            </button>
          </div>

            {/* Filtros Laterales */}
            <div className="hidden lg:block">
            <SidebarFilters
              categories={categories}
              colors={availableColors}
              sizes={["XS", "S", "M", "L", "XL"]}
              selectedSize={selectedSize || "S"}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onCategoryClick={handleCategoryClick}
            />
            </div>

           {/* Drawer for mobile filters */}
           <Drawer
             isOpen={showFiltersDrawer}
             onClose={() => setShowFiltersDrawer(false)}
             title="Filtros"
           >
             <div className="space-y-6">
               <SidebarFilters
                 categories={categories}
                 colors={availableColors}
                 sizes={["XS", "S", "M", "L", "XL"]}
                 selectedSize={selectedSize || "S"}
                 selectedColor={selectedColor}
                 onSizeChange={setSelectedSize}
                 onColorChange={setSelectedColor}
                 onCategoryClick={handleCategoryClick}
               />
               <PriceRangeFilter
                 minPrice={minPrice}
                 maxPrice={maxPrice}
                 value={priceRange}
                 onChange={setPriceRange}
               />
             </div>
           </Drawer>

          {/* Grid de Productos */}
          <section className="flex-1 px-4 lg:px-0">
            {/* Top Bar with count, sort and view toggle */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-on-surface-variant font-body">
                  Mostrando {filteredProducts.length} producto
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-on-surface-variant font-body text-lg">
                  {searchQuery || selectedCategory
                    ? "Ningún producto coincide con tus filtros."
                    : "Aún no hay productos disponibles."}
                </p>
                {/* Clear filters button */}
                    {(searchQuery || selectedCategory || selectedSize || selectedColor) && (
                       <button
                         onClick={clearAllFilters}
                         className="mt-4 font-label text-sm uppercase tracking-widest text-primary hover:underline min-h-[44px]"
                       >
                         Ver todos los productos
                       </button>
                     )}
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 md:gap-y-16 md:gap-x-12"
                    : "space-y-6"
                }
              >

                {visibleProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCardUnified
                      product={product}
                      variant={effectiveVariant}
                      onQuickAdd={handleQuickAdd}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {visibleCount < filteredProducts.length && (
              <div ref={loadMoreRef} className="h-10" />
            )}
          </section>
        </div>
      </PageContainer>

      <Footer />
    </>
  );
}
