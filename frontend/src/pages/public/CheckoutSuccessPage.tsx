import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const CheckIcon = () => (
  <svg className="h-16 w-16 text-terracota-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-crema-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <CheckIcon />
        </div>
        <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">
          Thank you for your order!
        </h1>
        <p className="text-chocolate-600 mb-8">
          Your payment was successful. We've received your order and will process it shortly.
          You'll receive a confirmation email with your order details.
        </p>
        <div className="space-y-4">
          <Link to="/products">
            <Button size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}