import { Routes, Route, Suspense, lazy } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/public/HomePage';
import { ProductsListPage } from '@/pages/public/ProductsListPage';
import { ProductDetailPage } from '@/pages/public/ProductDetailPage';
import { CartPage } from '@/pages/public/CartPage';
import { CheckoutPage } from '@/pages/public/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/public/CheckoutSuccessPage';
import { CheckoutCancelPage } from '@/pages/public/CheckoutCancelPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';

// Lazy load admin routes to reduce initial bundle size
const DashboardLayout = lazy(() => import('@/pages/admin/DashboardLayout'));
const ProductsList = lazy(() => import('@/pages/admin/ProductsList'));
const ProductForm = lazy(() => import('@/pages/admin/ProductForm'));
const CategoriesList = lazy(() => import('@/pages/admin/CategoriesList'));
const CategoryForm = lazy(() => import('@/pages/admin/CategoryForm'));
const OrdersList = lazy(() => import('@/pages/admin/OrdersList'));
const OrderDetailsPage = lazy(() => import('@/pages/admin/OrderDetailsPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));
const DashboardOverview = lazy(() => import('@/pages/admin/DashboardOverview'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full" />
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardLayout />
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardOverview />
                </Suspense>
              } />
              <Route path="products" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductsList />
                </Suspense>
              } />
              <Route path="products/new" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductForm />
                </Suspense>
              } />
              <Route path="products/:id/edit" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductForm />
                </Suspense>
              } />
              <Route path="categories" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CategoriesList />
                </Suspense>
              } />
              <Route path="categories/new" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CategoryForm />
                </Suspense>
              } />
              <Route path="categories/:id/edit" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CategoryForm />
                </Suspense>
              } />
              <Route path="orders" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <OrdersList />
                </Suspense>
              } />
              <Route path="orders/:id" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <OrderDetailsPage />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SettingsPage />
                </Suspense>
              } />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
        <ToastContainer />
      </div>
    );
  }

export default App;