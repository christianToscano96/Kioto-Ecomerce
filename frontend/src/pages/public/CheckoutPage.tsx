import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCart, useCartTotal, useCartItemCount } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { stripe } from '@/lib/stripe';

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-terracota-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
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
      // Create Stripe checkout session via API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          shippingDetails: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout using Stripe.js
      if (data.sessionId) {
        await stripe.redirectToCheckout(data.sessionId);
      } else if (data.url) {
        // Fallback: direct redirect if sessionId not provided
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-crema-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderIcon />
            </div>
          </div>
        </div>
      </>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-crema-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">Your Cart is Empty</h1>
              <p className="text-chocolate-600 mb-8">Add items to your cart before checking out.</p>
              <Button onClick={() => navigate('/products')}>Shop Products</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-crema-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-xl font-serif font-semibold text-chocolate-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-terracota-50 text-terracota-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        type="email"
                        label="Email Address"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-chocolate-800 mb-3">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Address Line 1"
                          required
                          value={formData.address.line1}
                          onChange={(e) => handleInputChange('address.line1', e.target.value)}
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Address Line 2 (Optional)"
                          value={formData.address.line2}
                          onChange={(e) => handleInputChange('address.line2', e.target.value)}
                          placeholder="Apt, suite, etc."
                        />
                      </div>
                      <div>
                        <Input
                          label="City"
                          required
                          value={formData.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          label="State / Province"
                          required
                          value={formData.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          label="Postal Code"
                          required
                          value={formData.address.postal_code}
                          onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          label="Country"
                          required
                          value={formData.address.country}
                          onChange={(e) => handleInputChange('address.country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? 'Processing...' : `Complete Order (${formatPrice(cartTotal)})`}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <h2 className="text-xl font-serif font-semibold text-chocolate-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-chocolate-600">Items ({cartItemCount})</span>
                    <span className="text-chocolate-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="border-t border-dashed border-chocolate-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-chocolate-900">Total</span>
                      <span className="text-terracota-600">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-chocolate-500">
                  You will be redirected to Stripe to complete your payment securely.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}