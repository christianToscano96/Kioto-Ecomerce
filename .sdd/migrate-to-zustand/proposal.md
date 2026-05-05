# Proposal: Migrate from React Query + Zustand Hybrid to Pure Zustand

## Intent

Unify state management by replacing React Query with Zustand across the entire application. Current hybrid approach has auth/cart in Zustand and products/orders in React Query, creating inconsistency and two sources of truth. Single Zustand store per domain simplifies mental model and removes dependency on React Query.

## Scope

### In Scope
- **Auth store**: Add async login/register/logout with fetch logic
- **Cart store**: Replace useCart hooks with Zustand async actions
- **Products store**: New Zustand store with list/get/create/update/delete
- **Orders store**: New Zustand store with admin order listing
- **UI state**: Loading/error states in each store
- **main.tsx**: Remove QueryClientProvider wrapper

### Out of Scope
- Keeping React Query as optional dependency
- Partial migration (e.g., keeping React Query for some domains)
- Refactoring component logic beyond hook replacements

## Capabilities

### New Capabilities
- `products-state`: Client-side product management with async fetch/mutate
- `orders-state`: Admin order listing with caching

### Modified Capabilities
- `auth-state`: Add async operations to existing auth store
- `cart-state`: Replace React Query integration with embedded fetch logic

## Approach

1. Extend `src/store/auth.ts` with async login/register/logout actions using API
2. Extend `src/store/cart.ts` with fetchCart, addToCart, updateCartItem, removeFromCart, clearCart actions
3. Create `src/store/products.ts` with fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct
4. Create `src/store/orders.ts` with fetchOrders
5. Update all components using `useProducts`, `useAdminProducts`, etc. to use new Zustand hooks
6. Remove `@tanstack/react-query` from package.json

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/api.ts` | Modified | Remove useQuery/useMutation hooks |
| `src/store/auth.ts` | Modified | Add async actions |
| `src/store/cart.ts` | Modified | Add async actions |
| `src/store/products.ts` | New | New store for product state |
| `src/store/orders.ts` | New | New store for order state |
| `src/main.tsx` | Modified | Remove QueryClientProvider |
| `src/pages/admin/ProductsList.tsx` | Modified | Use new Zustand hooks |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stale cache after mutations | Med | Invalidate on mutate, add cache timestamps |
| Loading state inconsistencies | Low | Pattern: every async action sets loading true/false |
| Component refactoring errors | Med | Test each page after migration |

## Rollback Plan

Revert commit removes new stores and restores QueryClientProvider wrapper. Run `npm install @tanstack/react-query` to restore dependency.