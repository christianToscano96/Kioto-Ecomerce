import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-crema-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-serif font-bold text-chocolate-900 mb-4">404</h1>
        <p className="text-xl text-chocolate-600 mb-8">Page not found</p>
        <p className="text-chocolate-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}