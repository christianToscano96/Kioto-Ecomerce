import { Eye, Plus, Grid, X, Minus, Search, User, Loader2 } from '@/components/icons';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCartItems,
  useCartTotal,
  useCartItemCount,
  useCartIsLoading,
} from "@/store/cart";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import {
  Stepper,
  FormSection,
  FloatingLabelInput,
  SecurityBadge,
  PrimaryButton,
} from "@/components/checkout/CheckoutFormComponents";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { api } from "@/lib/api";
import { showToast } from "@/components/ui/Toast";
import { BackButton } from '@/components/ui/BackButton';

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartItems();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();
  const cartLoading = useCartIsLoading();

  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");

  // Calculate shipping based on postal code (Y4512 = free local shipping)
  const calculateShipping = (postalCode: string): number => {
    if (postalCode === 'Y4512') return 0;
    const numericCode = parseInt(postalCode.replace(/\D/g, ''), 10);
    if (isNaN(numericCode)) return 15;
    if (numericCode >= 1000 && numericCode <= 2000) return 5;
    if (numericCode >= 3000 && numericCode <= 5000) return 10;
    return 15;
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  // Calculate shipping and total based on postal code
  const shipping = calculateShipping(formData.address.postal_code);
  const total = cartTotal + shipping;

  // Load terms from settings
  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.policies?.terms) {
        setStoreTerms(res.data.policies.terms);
      }
    }).catch(() => {});
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [paymentMethod] = useState<"transfer">("transfer"); // Only Galio Pay transfer
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [storeTerms, setStoreTerms] = useState<string>("");
  const [showTerms, setShowTerms] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'creating' | 'redirecting'>('idle');

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    if (step === "shipping") setStep("payment");
    else if (step === "payment") setStep("review");
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === "payment") setStep("shipping");
    else if (step === "review") setStep("payment");
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('creating');
    setError(null);

    try {
      const response = await api.post("/checkout", {
        shippingDetails: formData,
      });

      const data = response.data;

      // Check if response indicates success
      if (response.status !== 200) {
        throw new Error(data.error || "Error al crear sesión de checkout");
      }

      // GalioPay checkout - redirect to payment page
      if (data.success) {
        showToast({ type: 'success', title: 'Orden creada correctamente' });
        
        if (data.paymentUrl) {
          setSubmitStatus('redirecting');
          window.location.href = data.paymentUrl;
        } else {
          // GalioPay link being created - redirect to success page with orderId
          // Payment URL will be available via webhook
          navigate(`/checkout/success?orderId=${data.orderId}`);
        }
      } else {
        // Backend returned success: false
        throw new Error(data.error || 'No se pudo crear la orden');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Ocurrió un error";
      setError(errorMsg);
      showToast({ type: 'error', title: errorMsg });
      setSubmitStatus('idle');
    }
  };

  // Stepper steps - dynamic based on current step
  const steps = [
    { number: "01", label: "Envío", active: step === "shipping" },
    { number: "02", label: "Pago", active: step === "payment" },
    { number: "03", label: "Revisión", active: step === "review" },
  ];

  if (cartLoading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center py-16">
            <h1 className="text-3xl font-serif font-bold text-on-surface mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-on-surface-variant mb-8">
              Agrega artículos antes de finalizar la compra.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="font-label uppercase tracking-widest px-8 py-3 bg-primary text-on-primary hover:bg-primary-container transition-colors"
            >
              Ver Productos
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Checkout Process Indicator */}
        <div className="mb-16 mt-8 animate-fade-in">
            <div className="text-center mt-6">
              <BackButton label="Volver" showLabelOnMobile={true} page='checkout' />
            </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-12">
            Finalizar Compra
          </h1>
          <div style={{ animationDelay: '100ms' }}>
            <Stepper steps={steps} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Forms Column */}
          <div className="lg:col-span-7 space-y-12">
            {/* Step 1: Shipping Form */}
            {step === "shipping" && (
              <form onSubmit={(e) => e.preventDefault()} className="animate-fade-in">
                <FormSection title="Información de Contacto">
                  <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <FloatingLabelInput
                      label="Correo Electrónico"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </FormSection>

                <FormSection title="Dirección de Envío" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <FloatingLabelInput
                      label="Nombre Completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    <div className="md:col-span-2">
                      <FloatingLabelInput
                        label="Dirección"
                        placeholder="Calle 123"
                        value={formData.address.line1}
                        onChange={(e) => handleInputChange("address.line1", e.target.value)}
                      />
                    </div>
                    <FloatingLabelInput
                      label="Ciudad"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange("address.city", e.target.value)}
                    />
                    <FloatingLabelInput
                      label="Código Postal"
                      value={formData.address.postal_code}
                      onChange={(e) => handleInputChange("address.postal_code", e.target.value)}
                    />
                    <FloatingLabelInput
                      label="Provincia/Estado"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange("address.state", e.target.value)}
                    />
                  </div>
                </FormSection>

                <section className="pt-8 flex gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="px-6 py-3 border border-outline-variant  hover:bg-surface-container transition-colors"
                  >
                    Volver al Carrito
                  </button>
                  <PrimaryButton type="button" onClick={handleNext}>
                    Continuar al Pago
                  </PrimaryButton>
                </section>
              </form>
            )}

            {/* Step 2: Payment Method - Galio Pay Only */}
            {step === "payment" && (
              <form onSubmit={(e) => e.preventDefault()} className="animate-fade-in">
                <FormSection title="Método de Pago">
                  <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="p-6 border border-primary rounded-lg bg-primary-container/10">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl text-primary">account_balance</span>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-on-surface">Transferencia Bancaria</h3>
                          <p className="text-sm text-on-surface-variant">
                            Pago seguro vía GalioPay. Recibirás las instrucciones al confirmar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>

                <section className="pt-8 flex gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-outline-variant hover:bg-surface-container transition-colors"
                  >
                    Volver
                  </button>
                  <PrimaryButton type="button" onClick={handleNext}>
                    Revisar Pedido
                  </PrimaryButton>
                </section>
              </form>
            )}

            {/* Step 3: Review */}
            {step === "review" && (
              <form onSubmit={handleSubmit} className="animate-fade-in">
                <FormSection title="Resumen del Pedido">
                  <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between py-2 border-b border-outline-variant">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-outline-variant">
                      <span>Envío</span>
                      <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </FormSection>

                {/* Terms Agreement */}
                <div className="mt-6 p-4 bg-surface-container rounded-lg border border-outline-variant/30 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-outline focus:ring-2 focus:ring-primary"
                      required
                    />
                    <span className="text-sm text-on-surface">
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-primary hover:underline font-medium"
                      >
                        Términos y Condiciones
                      </button>
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4 animate-fade-in" style={{ animationDelay: '250ms' }}>
                    {error}
                  </div>
                )}

                <section className="pt-8 flex gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-outline-variant  hover:bg-surface-container transition-colors"
                  >
                    Volver
                  </button>
                  <PrimaryButton type="submit" disabled={submitStatus !== 'idle' || !termsAccepted}>
                    {submitStatus === 'creating' ? "Creando orden..." : submitStatus === 'redirecting' ? "Redirigiendo a GalioPay..." : "Confirmar Pedido"}
                  </PrimaryButton>
                </section>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <OrderSummary items={items} subtotal={cartTotal} shipping={shipping} total={total} />
        </div>

<SecurityBadge message="Tu conexión está encriptada y tus datos son manejados con cuidado artesanal." />
       </main>

{/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Términos y Condiciones</h2>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-on-surface hover:text-primary"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-on-surface">
                {storeTerms ? (
                  <p className="whitespace-pre-wrap animate-fade-in" style={{ animationDelay: '100ms' }}>{storeTerms}</p>
                ) : (
                  <p>Términos y condiciones no configurados.</p>
                )}
              </div>
              <div className="mt-6 flex justify-end animate-fade-in" style={{ animationDelay: '200ms' }}>
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

       <Footer />
    </>
  );
}
