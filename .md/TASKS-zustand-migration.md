# Zustand Migration Implementation Tasks

## 1. Store Creation/Updates

### 1.1 Cart Store Enhancement
**File:** `frontend/src/store/cart.ts`
- [ ] Remove placeholder hooks `useCartQuery` and `useAddToCartQuery`
- [ ] Add async action methods that call API directly:
  - `fetchCart()` - calls `cartApi.get()` and syncs state
  - `addToCart(productId, quantity, size?)` - calls `cartApi.addItem()` and updates local state
  - `updateCartItem(itemId, quantity)` - calls `cartApi.updateItem()` and updates local state  
  - `removeFromCart(itemId)` - calls `cartApi.removeItem()` and updates local state
  - `clearCart()` - calls `cartApi.clear()` and clears local state
- [ ] Add `isSyncing` state for async operations
- [ ] Add proper error handling with `error` state

### 1.2 Products Store (New)
**File:** `frontend/src/store/products.ts` (create new)
- [ ] Create `useProductsStore` with:
  - `products: Product[]` state
  - `isLoading: boolean` state
  - `error: string | null` state
  - Actions: `fetchProducts()`, `fetchProduct(id)`, `createProduct()`, `updateProduct()`, `deleteProduct()`
- [ ] Add selectors: `useProducts()`, `useProduct(id)`, `useProductsLoading`, `useProductsError`
- [ ] Export from `frontend/src/store/index.ts`

### 1.3 Orders Store (New)
**File:** `frontend/src/store/orders.ts` (create new)
- [ ] Create `useOrdersStore` with:
  - `orders: Order[]` state
  - `isLoading: boolean` state
  - `error: string | null` state
  - Action: `fetchOrders()`
- [ ] Add selectors: `useOrders()`, `useOrdersLoading`, `useOrdersError`
- [ ] Export from `frontend/src/store/index.ts`

### 1.4 UI Store (New)
**File:** `frontend/src/store/ui.ts` (create new)
- [ ] Create `useUiStore` with:
  - `isMobileMenuOpen: boolean`
  - `isSearchOpen: boolean`
  - `notifications: Array<{id, message, type}>`
  - Actions: `setMobileMenuOpen()`, `setSearchOpen()`, `addNotification()`, `removeNotification()`
- [ ] Export from `frontend/src/store/index.ts`

## 2. Component Migration

### 2.1 CartPage Component
**File:** `frontend/src/pages/public/CartPage.tsx`
- [ ] Replace `import { useCart, useCartTotal, useCartItemCount } from '@/hooks/useCart'`
- [ ] With `import { useCartItems, useCartTotal, useCartItemCount } from '@/store/cart'`
- [ ] Remove `isLoading` and `error` from `useCart()` - use local store state instead
- [ ] Add cart mutation handler using `useCartStore.setState` or new actions

### 2.2 Header Component
**File:** `frontend/src/components/layout/Header.tsx`
- [ ] Replace `import { useCartItemCount } from "@/hooks/useCart"`
- [ ] With `import { useCartItemCount } from '@/store/cart'`
- [ ] Verify cart badge displays correctly

### 2.3 CheckoutPage Component
**File:** `frontend/src/pages/public/CheckoutPage.tsx`
- [ ] Replace `import { useCart, useCartTotal, useCartItemCount } from '@/lib/api'`
- [ ] With `import { useCartItems, useCartTotal, useCartItemCount } from '@/store/cart'`
- [ ] Update cart loading state check (use `useCartItemCount()` which returns 0 for empty)

### 2.4 ProductDetailPage Component
**File:** `frontend/src/pages/public/ProductDetailPage.tsx`
- [ ] Replace `import { useProduct, useProducts } from "@/lib/api"`
- [ ] With `import { useProduct, useProducts } from '@/store/products'`
- [ ] Replace `import { useAddToCart } from "@/hooks/useCart"`
- [ ] Use store action for add to cart
- [ ] Update mutation state handling (replace `isPending` check)

### 2.5 ProductsList Admin Component
**File:** `frontend/src/pages/admin/ProductsList.tsx`
- [ ] Replace `import { useAdminProducts, useDeleteProduct } from "@/lib/api"`
- [ ] With imports from `@/store/products`
- [ ] Update loading/error handling to use Zustand state

### 2.6 OrdersList Admin Component
**File:** `frontend/src/pages/admin/OrdersList.tsx`
- [ ] Replace `import { useAdminOrders } from "@/lib/api"`
- [ ] With `import { useOrders } from '@/store/orders'`
- [ ] Update loading/error handling to use Zustand state

### 2.7 ProductForm Admin Component
**File:** `frontend/src/pages/admin/ProductForm.tsx`
- [ ] Replace `import { useAdminProducts, useCreateProduct, useUpdateProduct } from '@/lib/api'`
- [ ] With imports from `@/store/products`
- [ ] Update mutation handling - replace `createMutation.mutateAsync` and `updateMutation.mutateAsync` with store actions
- [ ] Update `isPending` checks to use new loading state pattern

### 2.8 ProductsListPage Component  
**File:** `frontend/src/pages/public/ProductsListPage.tsx`
- [ ] Replace `import { useProducts } from '@/lib/api'`
- [ ] With `import { useProducts } from '@/store/products'` (for public-facing store list)
- [ ] Update loading/error handling to use Zustand state

### 2.9 HomePage Component
**File:** `frontend/src/pages/public/HomePage.tsx`
- [ ] Replace `import { useProducts } from '@/lib/api'`
- [ ] With `import { useProducts } from '@/store/products'`
- [ ] Update loading/error handling to use Zustand state

## 3. Cleanup

### 3.1 Remove useCart Hook
**File:** `frontend/src/hooks/useCart.ts`
- [ ] Delete entire file after verifying no imports remain

### 3.2 Clean up api.ts React Query Hooks
**File:** `frontend/src/lib/api.ts`
- [ ] Remove `useCart`, `useCartTotal`, `useCartItemCount` exports (lines 118-124, 253-261)
- [ ] Remove `useAdminOrders` export (lines 245-250)
- [ ] Remove cart-related React Query hooks from api.ts:
  - `useAddToCart` (lines 148-157)
  - `useUpdateCartItem` (lines 159-169)
  - `useRemoveFromCart` (lines 171-180)
  - `useClearCart` (lines 182-191)
  - `useDeleteProduct` (lines 193-202)
  - `useAdminProducts` (lines 205-210)
  - `useCreateProduct` (lines 212-221)
  - `useUpdateProduct` (lines 223-233)
- [ ] Keep only API functions (`cartApi`, `productsApi`, `adminProductsApi`, `ordersApi`)
- [ ] Keep auth hooks (`useCurrentUser`, `useLogin`, `useRegister`) - these stay with React Query

### 3.3 Update Store Index
**File:** `frontend/src/store/index.ts`
- [ ] Add exports for products store
- [ ] Add exports for orders store
- [ ] Add exports for ui store

### 3.4 Remove React Query Dependencies (Optional)
**File:** `frontend/package.json`
- [ ] Consider keeping `@tanstack/react-query` since auth hooks (`useLogin`, `useRegister`, `useCurrentUser`) will continue using React Query
- [ ] Keep `QueryClientProvider` in `frontend/src/main.tsx` for auth hooks
- [ ] Only remove if fully migrating auth hooks to Zustand