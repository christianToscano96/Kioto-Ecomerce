import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductsStore } from "@/store/products";
import { useCategoriesStore } from "@/store/categories";
import { useUiStore } from "@/store/ui";
import { productsApi } from "@/lib/api";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { ProductCardUnified } from "@/components/ui/ProductCardUnified";
import { BottomSheet } from "@/components/ui/BottomSheet";
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
import { Filter, ArrowLeft, Minus, Plus } from "@/components/icons";
import { BackButton } from "@/components/ui/BackButton";
import type { Product } from "../../../../shared/src";

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
  // Filtros de la lista de productos (independientes del Quick Add panel)
  const [filterSize, setFilterSize] = useState<string | null>(null);
  const [filterColor, setFilterColor] = useState<string | null>(null);
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
  const {
    quickAddPanel,
    openQuickAdd,
    closeQuickAdd,
    setQuickAddSize,
    setQuickAddColor,
    setQuickAddQuantity,
    resetQuickAdd,
  } = useUiStore();
  const { addToast } = useToast();
  const { categories: allCategories, fetchCategories } = useCategoriesStore();

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

    // Size filter
    if (filterSize) {
      filtered = filtered.filter((p) => p.sizes?.includes(filterSize));
    }

    // Color filter
    if (filterColor) {
      filtered = filtered.filter((p) => p.colors?.includes(filterColor));
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
    filterSize,
    filterColor,
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

  const handleQuickAdd = (productId: string) => {
    openQuickAdd(productId);
  };

  // Agregar al carrito desde el BottomSheet
  const handleQuickAddSubmit = async () => {
    if (!quickAddPanel.productId) return;
    const product = products?.find((p) => p._id === quickAddPanel.productId);
    if (!product) return;

    try {
      await addToCart(
        product,
        quickAddPanel.quantity,
        quickAddPanel.selectedSize || undefined,
        quickAddPanel.selectedColor || undefined,
      );
      addToast({
        type: 'success',
        title: '¡Agregado!',
        message: `${product.name} fue agregado al carrito`,
      });
      resetQuickAdd();
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo agregar al carrito',
      });
    }
  };

   // Active filters for display
  const activeFilters: ActiveFilter[] = [
    ...(selectedCategory
      ? [{ id: "category", label: "Categoría", value: selectedCategory }]
      : []),
    ...(filterSize
      ? [{ id: "size", label: "Talla", value: filterSize }]
      : []),
    ...(filterColor
      ? [{ id: "color", label: "Color", value: filterColor }]
      : []),
  ];

  const removeFilter = (id: string) => {
    if (id === "category") setSelectedCategory(null);
    if (id === "size") setFilterSize(null);
    if (id === "color") setFilterColor(null);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setFilterSize(null);
    setFilterColor(null);
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

  const effectiveVariant = view;

  return (
    <>
      <PublicHeader />

      <PageContainer>
      
            <div className="text-center mt-8">
                <BackButton label="Volver" showLabelOnMobile={true} />
            </div>

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
              selectedSize={filterSize || undefined}
              selectedColor={filterColor}
              onSizeChange={(size) => setFilterSize(size || null)}
              onColorChange={setFilterColor}
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
                  selectedSize={filterSize || undefined}
                  selectedColor={filterColor}
                  onSizeChange={(size) => setFilterSize(size || null)}
                  onColorChange={setFilterColor}
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
                     {(searchQuery || selectedCategory || filterSize || filterColor) && (
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
                      ? "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 stagger-children"
                      : "flex flex-col gap-5"
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
                      isMobile={isMobile}
                      onOpenQuickAdd={() => openQuickAdd(product._id)}
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

      {/* ══ BottomSheet de Quick Add (mobile, fuera de la card) ══ */}
      {quickAddPanel.productId && (() => {
        const product = products?.find((p) => p._id === quickAddPanel.productId);
        if (!product) return null;
        return (
          <BottomSheet
            isOpen={true}
            onClose={resetQuickAdd}
            title={`${product.name} — $${product.price.toFixed(2)}`}
            maxHeight="90%"
            closable
          >
            <div className="space-y-4 py-2">
              {/* Talla */}
              {((product.variants?.map(v => v.size) || product.sizes || []).length > 0) && (
                <div>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">
                    Talla
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(product.variants?.map(v => v.size) || product.sizes || []).map((size) => {
                      const sizeStock = product.variants?.find(v => v.size === size)?.stock ?? 0;
                      const isOut = sizeStock === 0;
                      return (
                        <button
                          key={size}
                          onClick={() => { if (!isOut) setQuickAddSize(size); }}
                          disabled={isOut}
                          className={`min-w-[36px] h-8 px-2 text-xs rounded-[4px] border transition-all font-medium ${
                            quickAddPanel.selectedSize === size
                              ? "bg-primary text-on-primary border-primary"
                              : isOut
                              ? "border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed opacity-50"
                              : "border-outline-variant active:scale-95"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color */}
              {(product.colors?.length ?? 0) > 0 && (
                <div>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">
                    Color
                  </p>
                  <div className="flex gap-2">
                    {product.colors?.map((color, idx) => (
                      <button
                        key={color}
                        onClick={() => setQuickAddColor(color)}
                        className={`w-8 h-8 rounded-full border transition-all active:scale-90 ${
                          quickAddPanel.selectedColor === color || (!quickAddPanel.selectedColor && idx === 0)
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-outline-variant"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad + Botón */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuickAddQuantity(Math.max(1, quickAddPanel.quantity - 1))}
                    disabled={quickAddPanel.quantity <= 1}
                    className="w-9 h-9 rounded-[4px] border border-outline-variant flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center tabular-nums">
                    {quickAddPanel.quantity}
                  </span>
                  <button
                    onClick={() => setQuickAddQuantity(Math.min(product.totalStock || product.stock || 99, quickAddPanel.quantity + 1))}
                    disabled={quickAddPanel.quantity >= (product.totalStock || product.stock || 99)}
                    className="w-9 h-9 rounded-[4px] border border-outline-variant flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleQuickAddSubmit}
                  disabled={(product.variants?.length ?? 0) > 0 && !quickAddPanel.selectedSize}
                  className="bg-primary text-on-primary font-label text-xs uppercase tracking-wider px-5 py-2.5 rounded-[4px] disabled:opacity-40 active:scale-95 transition-all"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </BottomSheet>
        );
      })()}

      <Footer />
    </>
  );
}
