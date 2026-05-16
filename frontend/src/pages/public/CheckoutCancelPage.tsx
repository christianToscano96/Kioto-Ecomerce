import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { X } from '@/components/icons';

export function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-crema-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <X className="h-16 w-16 text-terracota-600" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-chocolate-600 mb-8">
          Your payment was cancelled. Your cart has been saved, so you can complete your purchase
          anytime.
        </p>
        <div className="space-y-4">
          <Link to="/cart">
            <Button size="lg" className="w-full">
              Return to Cart
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}