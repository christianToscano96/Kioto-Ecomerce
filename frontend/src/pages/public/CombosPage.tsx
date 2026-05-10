import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCombosStore } from "@/store/combos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageContainer } from "@/components/ui/Container";

export function CombosPage() {
  const { combos, isLoading, fetchPublicCombos } = useCombosStore();

  useEffect(() => {
    fetchPublicCombos();
  }, [fetchPublicCombos]);

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
        <PageContainer>
          <div className="py-8">
            <h1 className="font-serif text-3xl font-bold text-on-surface mb-2">
              Combos Especiales
            </h1>
            <p className="text-on-surface-variant mb-8">
              Ahorrá con nuestras combinaciones exclusivas
            </p>

            {combos.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                  inventory_2
                </span>
                <p className="text-on-surface-variant">
                  No hay combos disponibles en este momento
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combos.map((combo) => (
                  <Link
                    key={combo._id}
                    to={`/combos/${combo._id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant/20"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {combo.products?.[0] && typeof combo.products[0] !== 'string' && combo.products[0].images?.[0] ? (
                        <img
                          src={combo.products[0].images[0]}
                          alt={combo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                            inventory_2
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-full">
                        -{combo.discount}%
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {combo.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">
                        {combo.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          ${combo.comboPrice.toLocaleString()}
                        </span>
                        <span className="text-xs line-through text-on-surface-variant">
                          ${combo.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                        {combo.products?.slice(0, 4).map((p, i) => {
                          const product = typeof p === 'string' ? null : p;
                          return product?.images?.[0] ? (
                            <div key={i} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow">
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : null;
                        })}
                        {combo.products && combo.products.length > 4 && (
                          <span className="text-xs text-on-surface-variant">
                            +{combo.products.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </PageContainer>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}