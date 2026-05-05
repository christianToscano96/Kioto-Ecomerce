# Cart Store Specification

## Overview
Enhanced cart store with async API synchronization and optimistic updates.

## Existing State (from cart.ts)
```typescript
interface CartState {
  items: CartItem[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}
```

## New State
```typescript
interface CartState {
  items: CartItem[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: Date | null;
}
```

## New Actions
```typescript
interface CartActions {
  // Existing actions
  addItem: (item: CartItem) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setSessionId: (sessionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // NEW async actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, size?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
```

## Requirements

### REQ-001: fetchCart - Load cart from server
**GIVEN** a user with an active session
**WHEN** `fetchCart()` is called
**THEN** 
- Set `isLoading` to true
- Make GET request to `/api/cart`
- On success: replace local items with server items, set `lastSyncedAt` to now
- On failure: set `error` with message, keep existing items
- Set `isLoading` to false

### REQ-002: addToCart - Add item with optimistic update
**GIVEN** a user viewing their cart
**WHEN** `addToCart(productId, quantity, size?)` is called
**THEN**
- Optimistically add item to local state immediately
- Make POST request to `/api/cart/items`
- On success: sync with server response (replace items), show success toast "Item added to cart"
- On failure: rollback to previous state, show error toast with message
- Set `isLoading` appropriately

### REQ-003: updateCartItem - Update quantity with optimistic update
**GIVEN** a user with items in cart
**WHEN** `updateCartItem(itemId, quantity)` is called
**THEN**
- Store previous state for rollback
- Optimistically update the item quantity locally
- Make PUT request to `/api/cart/items/${itemId}`
- On success: sync with server response, show success toast "Cart updated"
- On failure: rollback to previous state, show error toast with message
- If quantity <= 0, treat as remove operation

### REQ-004: removeFromCart - Remove item with optimistic update
**GIVEN** a user with items in cart
**WHEN** `removeFromCart(itemId)` is called
**THEN**
- Store previous state for rollback
- Optimistically remove item from local state
- Make DELETE request to `/api/cart/items/${itemId}`
- On success: remove item confirmed, show success toast "Item removed from cart"
- On failure: restore item to previous state, show error toast with message

### REQ-005: clearCart - Clear all items
**GIVEN** a user with items in cart
**WHEN** `clearCart()` is called
**THEN**
- Store previous state for rollback
- Optimistically clear all items locally
- Make DELETE request to `/api/cart`
- On success: cart is empty, show success toast "Cart cleared"
- On failure: restore previous items, show error toast with message

### REQ-006: Persist middleware
**GIVEN** user refreshes the page
**WHEN** the store reinitializes
**THEN**
- `items` and `sessionId` are restored from localStorage
- `isLoading`, `error`, `lastSyncedAt` are NOT persisted
- After rehydration, `fetchCart()` is triggered if sessionId exists

### REQ-007: Error handling with toasts
**GIVEN** any async cart operation fails
**WHEN** the error is caught
**THEN**
- Error message is set in state
- Toast notification displays the error message
- Loading state is reset to false

## Selectors (new and updated)
```typescript
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => 
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)
);
export const useCartItemCount = () => useCartStore((state) => 
  state.items.reduce((count, item) => count + item.quantity, 0)
);
export const useCartSessionId = () => useCartStore((state) => state.sessionId);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);
export const useCartLastSynced = () => useCartStore((state) => state.lastSyncedAt);
```