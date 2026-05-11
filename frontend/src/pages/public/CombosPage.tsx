import { useEffect } from "react";
import { useCombosStore } from "@/store/combos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageContainer } from "@/components/ui/Container";
import { ComboCard } from "@/components/ui/ComboCard";

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {combos.map((combo) => (
                  <ComboCard key={combo._id} combo={combo} />
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