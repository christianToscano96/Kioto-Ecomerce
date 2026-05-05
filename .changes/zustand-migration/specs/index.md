# Zustand Migration Specifications Index

## Overview
Complete rewrite of frontend state management using Zustand stores with async actions, optimistic updates, and proper error handling.

## Stores Summary

| Store | Status | Purpose |
|-------|--------|---------|
| `auth.store.ts` | UPDATE | User authentication, token refresh |
| `cart.store.ts` | UPDATE | Cart CRUD with optimistic updates |
| `products.store.ts` | NEW | Product management, admin CRUD |
| `orders.store.ts` | NEW | Order history, status updates |
| `ui.store.ts` | NEW | Modal state, preferences, loading |

## Cross-Store Integration Requirements

### REQ-INT-001: Cart and Auth Integration
**GIVEN** an anonymous user with items in cart
**WHEN** user logs in
**THEN**
- Cart items are merged with user's server cart
- `fetchCart()` is called after successful login
- Local cart state is replaced with server state

### REQ-INT-002: Auth and API Integration
**GIVEN** a refreshed access token
**WHEN** API call fails with 401
**THEN**
- `refreshAuthToken()` is called automatically
- Original request is retried with new token
- If refresh fails, user is logged out

### REQ-INT-003: Global Loading Coordination
**GIVEN** any store operation is in progress
**WHEN** multiple async actions are active
**THEN**
- `ui.store` global loading indicator shows if any operation is active
- Each store can set its own loading state for component-specific loaders

### REQ-INT-004: Error Handling Consistency
**GIVEN** any store operation fails
**WHEN** error is caught
**THEN**
- Error is set in relevant store state
- Toast notification is shown with error message
- Loading states are properly reset

## Shared Utilities

### Axios Instance
All stores use the shared `api` instance from `frontend/src/lib/api.ts`:
```typescript
import { api } from '@/lib/api';
```

### Toast Notifications
Each store should use a toast utility for notifications:
```typescript
import { toast } from '@/lib/toast'; // or use Sonner/react-hot-toast

// Success
toast.success('Item added to cart');

// Error
toast.error('Failed to add item');
```

## File Structure
```
frontend/src/store/
├── auth.store.ts      # Auth with refresh
├── cart.store.ts      # Cart with API sync
├── products.store.ts  # Product CRUD
├── orders.store.ts    # Order management
├── ui.store.ts        # UI state
└── index.ts           # Barrel exports
```

## Type Dependencies
All stores import types from `@shared/index`:
```typescript
import type { User, Product, CartItem, Order, OrderStatus } from '../../../shared/src/index';
```

## Testing Requirements
Each store should have accompanying test files:
- `auth.store.test.ts` - token operations, refresh logic
- `cart.store.test.ts` - optimistic updates, API sync
- `products.store.test.ts` - CRUD operations
- `orders.store.test.ts` - status updates
- `ui.store.test.ts` - modal and preference management