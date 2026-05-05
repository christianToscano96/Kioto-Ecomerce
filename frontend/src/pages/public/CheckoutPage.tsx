import { useState } from "react";
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
import { stripe } from "@/lib/stripe";

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

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartItems();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();
  const cartLoading = useCartIsLoading();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          shippingDetails: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sesión de checkout");
      }

      if (data.sessionId) {
        await stripe.redirectToCheckout(data.sessionId);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
      setIsSubmitting(false);
    }
  };

  // Stepper steps
  const steps = [
    { number: "01", label: "Envío", active: true },
    { number: "02", label: "Pago", active: false },
    { number: "03", label: "Revisión", active: false },
  ];

  if (cartLoading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoaderIcon />
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
        <div className="mb-16 mt-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-12">
            Finalizar Compra
          </h1>
          <Stepper steps={steps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Forms Column */}
          <div className="lg:col-span-7 space-y-12">
            <form onSubmit={handleSubmit}>
              <FormSection
                title="Información de Contacto"
                loginLink={{ text: "INICIAR SESIÓN", onClick: () => {} }}
              >
                <div className="space-y-6">
                  <FloatingLabelInput
                    label="Correo Electrónico"
                    type="email"
                    placeholder="curador@terrenal.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </FormSection>

              <FormSection title="Dirección de Envío">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FloatingLabelInput
                    label="Nombre"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      label="Dirección Completa"
                      placeholder="Calle 123 Artística"
                      value={formData.address.line1}
                      onChange={(e) =>
                        handleInputChange("address.line1", e.target.value)
                      }
                    />
                  </div>
                  <FloatingLabelInput
                    label="Ciudad"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleInputChange("address.city", e.target.value)
                    }
                  />
                  <FloatingLabelInput
                    label="Código Postal"
                    value={formData.address.postal_code}
                    onChange={(e) =>
                      handleInputChange("address.postal_code", e.target.value)
                    }
                  />
                </div>
              </FormSection>

              <section className="pt-8">
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Procesando..." : "Continuar al Pago"}
                </PrimaryButton>
              </section>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <OrderSummary items={items} subtotal={cartTotal} total={cartTotal} />
        </div>

        <SecurityBadge message="Tu conexión está encriptada y tus datos son manejados con cuidado artesanal." />
      </main>

      <Footer />
    </>
  );
}
