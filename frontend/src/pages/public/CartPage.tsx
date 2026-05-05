import { Link } from "react-router-dom";
import {
  useCartItems,
  useCartTotal,
  useCartItemCount,
  useCartIsLoading,
  useCartError,
  useCartStore,
} from "@/store/cart";
import { useState } from "react";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

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

export function CartPage() {
  const items = useCartItems();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();
  const isLoading = useCartIsLoading();
  const error = useCartError();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, []); // Empty deps - fetch only on mount

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

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="p-4 bg-primary-container text-on-primary rounded-lg text-center">
            Error al cargar el carrito. Por favor, intenta de nuevo.
          </div>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-8 py-16">
          <header className="mb-12">
            <h1 className="font-serif text-5xl font-bold tracking-tight mb-2">
              Shopping Bag
            </h1>
            <p className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant">
              Tu curation está vacía
            </p>
          </header>
          <div className="text-center py-16">
            <p className="text-on-surface-variant mb-8">
              Descubre nuestra colección curada de objetos artesanales.
            </p>
            <Link to="/products">
              <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label font-bold uppercase tracking-widest hover:bg-primary-container transition-colors">
                Ver Productos
              </button>
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-8 py-16">
        <header className="mb-12">
          <h1 className="font-serif text-5xl font-bold tracking-tight mb-2">
            Shopping Bag
          </h1>
          <p className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {cartItemCount} {cartItemCount === 1 ? "artículo" : "artículos"} en
            tu curation
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-12">
{items.map((item) => {
               const key = (item as any)._id || item.productId;
               return <CartItemCard key={key} item={item} />;
             })}
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-4 mt-16 lg:mt-0">
            <div className="bg-surface-container-low p-8 rounded-xl border-l border-outline-variant/40">
              <h2 className="font-serif text-2xl font-bold mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-serif text-on-surface">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="font-serif text-on-surface">
                    Calculado en el siguiente paso
                  </span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Tax</span>
                  <span className="font-serif text-on-surface">$0.00</span>
                </div>
                <div className="pt-4 border-t border-dashed border-outline-variant/40 flex justify-between items-center">
                  <span className="font-label text-xs uppercase tracking-widest font-bold">
                    Total
                  </span>
                  <span className="font-serif text-3xl font-bold text-primary">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-primary text-on-primary py-5 rounded-lg font-label text-sm uppercase tracking-[0.2em] font-bold hover:bg-primary-container transition-colors shadow-sm">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => {
                    if (confirm("¿Vaciar el carrito?")) {
                      useCartStore.getState().clearCart();
                    }
                  }}
                  className="font-label text-xs uppercase tracking-widest text-terracota-600 border-b border-dashed border-terracota-600/40 pb-1 hover:border-terracota-600 transition-all"
                >
                  Vaciar Carrito
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-xl">
                    local_shipping
                  </span>
                  <p className="font-body text-xs text-on-surface-variant">
                    Envío neutro en carbono complementario en pedidos sobre
                    $300.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-xl">
                    verified
                  </span>
                  <p className="font-body text-xs text-on-surface-variant">
                    Fabricado éticamente con garantía de reparación de por vida.
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mt-6 px-4">
              <details className="group">
                <summary className="list-none flex items-center justify-between cursor-pointer font-label text-xs uppercase tracking-widest text-on-surface-variant group-open:mb-4">
                  <span>¿Tienes un código promocional?</span>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 text-sm font-body px-0 py-2"
                    placeholder="Ingresa código"
                    type="text"
                  />
                  <button className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                    Aplicar
                  </button>
                </div>
              </details>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
