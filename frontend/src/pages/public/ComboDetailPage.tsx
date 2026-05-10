import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCombosStore } from "@/store/combos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageContainer } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function ComboDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { combo, isLoading, fetchCombo, combos, fetchPublicCombos } = useCombosStore();

  useEffect(() => {
    if (id) fetchCombo(id);
  }, [id, fetchCombo]);

  if (isLoading || !combo) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-10 w-10 border-3 border-primary border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  const { name, description, products, discount, originalPrice, comboPrice } = combo;

  return (
    <>
      <Header />
      <main>
        <PageContainer>
          <div className="py-8 max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
              <Link to="/" className="hover:text-primary">Inicio</Link>
              <span>/</span>
              <Link to="/combos" className="hover:text-primary">Combos</Link>
              <span>/</span>
              <span className="text-on-surface">{name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images Collage */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {products?.slice(0, 4).map((p, i) => {
                    const product = typeof p === 'string' ? null : p;
                    return product?.images?.[0] ? (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Combo Info */}
              <div className="space-y-6">
                <div>
                  <div className="inline-block bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                    -{discount}% AHORRO
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-on-surface mb-2">
                    {name}
                  </h1>
                  <p className="text-on-surface-variant">
                    {description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-bold text-primary">
                      ${comboPrice.toLocaleString()}
                    </span>
                    <span className="text-lg line-through text-on-surface-variant">
                      ${originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Ahorras ${(originalPrice - comboPrice).toLocaleString()}
                  </p>
                </div>

                <div className="border-t border-outline-variant/20 pt-4">
                  <h3 className="font-semibold text-on-surface mb-3">
                    Productos incluidos ({products?.length})
                  </h3>
                  <div className="space-y-2">
                    {products?.map((p, i) => {
                      const product = typeof p === 'string' ? null : p;
                      return product ? (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center">
                              <span className="material-symbols-outlined text-on-surface-variant">
                                inventory_2
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-on-surface-variant">
                              ${product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    toast.success("Combo agregado al carrito");
                  }}
                  size="lg"
                  className="w-full"
                >
                  Agregar Combo al Carrito
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}