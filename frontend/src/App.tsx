import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/pages/admin/DashboardLayout';
import { ProductsList } from '@/pages/admin/ProductsList';
import { ProductForm } from '@/pages/admin/ProductForm';
import { CategoriesList } from '@/pages/admin/CategoriesList';
import { CategoryForm } from '@/pages/admin/CategoryForm';
import { OrdersList } from '@/pages/admin/OrdersList';
import { OrderDetailsPage } from '@/pages/admin/OrderDetailsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { HomePage } from '@/pages/public/HomePage';
import { ProductsListPage } from '@/pages/public/ProductsListPage';
import { ProductDetailPage } from '@/pages/public/ProductDetailPage';
import { CartPage } from '@/pages/public/CartPage';
import { CheckoutPage } from '@/pages/public/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/public/CheckoutSuccessPage';
import { CheckoutCancelPage } from '@/pages/public/CheckoutCancelPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { DashboardOverview } from '@/pages/admin/DashboardOverview';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';

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
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="categories" element={<CategoriesList />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/:id/edit" element={<CategoryForm />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="orders/:id" element={<OrderDetailsPage />} />
              <Route path="settings" element={<SettingsPage />} />
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