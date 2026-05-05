# Orders Store Specification

## Overview
New orders store for order management with admin status updates.

## State
```typescript
interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: OrderStatus | 'all';
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## Actions
```typescript
interface OrdersActions {
  // Public actions
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<Order | null>;

  // Admin actions
  fetchAdminOrders: (status?: OrderStatus, page?: number) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;

  // Utils
  setStatusFilter: (status: OrdersState['statusFilter']) => void;
  clearError: () => void;
  reset: () => void;
}
```

## Requirements

### REQ-001: fetchOrders - Load user's order history
**GIVEN** an authenticated user
**WHEN** `fetchOrders()` is called
**THEN**
- Set `isLoading` to true
- Make GET request to `/api/orders`
- On success: replace `orders` array, update pagination
- On failure (401): user should be logged out, redirect to login
- On other failures: set error with message
- Set `isLoading` to false

### REQ-002: fetchOrder - Load single order details
**GIVEN** an authenticated user with an order ID
**WHEN** `fetchOrder(id)` is called
**THEN**
- Set `isLoading` to true
- Make GET request to `/api/orders/${id}`
- On success: set `currentOrder`
- On failure (404): set error "Order not found"
- On failure (403): set error "Access denied"
- On failure (401): redirect to login
- Set `isLoading` to false

### REQ-003: fetchAdminOrders - Load all orders (admin)
**GIVEN** an admin user accessing the admin panel
**WHEN** `fetchAdminOrders(status?, page?)` is called
**THEN**
- Set `isLoading` to true
- Build query params with status filter and pagination
- Make GET request to `/api/orders/admin` (or `/api/orders` for admin)
- On success: replace `orders` array, update pagination info
- On failure (403): set error "Unauthorized", not an admin
- On failure (401): redirect to login
- Set `isLoading` to false

### REQ-004: updateOrderStatus - Update order status (admin)
**GIVEN** an admin user changing order status
**WHEN** `updateOrderStatus(id, status)` is called
**THEN**
- Set `isLoading` to true
- Store current state for rollback
- Optimistically update local order status
- Make PATCH/PUT request to `/api/orders/${id}/status` with `{ status }`
- On success: confirm status change, show success toast "Order status updated"
- On failure: rollback to previous status, show error toast
- Set `isLoading` to false

**GIVEN** status transition is valid
**WHEN** `status` is provided
**THEN**
- Valid transitions: pending → processing, paid → processing/shipped, processing → shipped, shipped → delivered
- Invalid transitions: cancelled → any, delivered → any (should be rejected)

### REQ-005: Status filtering
**GIVEN** admin wants to filter orders by status
**WHEN** `setStatusFilter(status)` is called
**THEN**
- Update `statusFilter` in state
- When `fetchAdminOrders()` is next called, include filter in request
- 'all' value returns orders with any status

### REQ-006: Error handling with toasts
**GIVEN** any order operation fails
**WHEN** the error is caught
**THEN**
- Error message is set in state
- Toast notification displays the error
- Loading state is reset to false

## Selectors
```typescript
export const useOrders = () => useOrdersStore((state) => state.orders);
export const useCurrentOrder = () => useOrdersStore((state) => state.currentOrder);
export const useOrdersLoading = () => useOrdersStore((state) => state.isLoading);
export const useOrdersError = () => useOrdersStore((state) => state.error);
export const useOrdersPagination = () => useOrdersStore((state) => state.pagination);
export const useOrdersStatusFilter = () => useOrdersStore((state) => state.statusFilter);

// Computed selectors
export const useOrdersByStatus = (status: OrderStatus) =>
  useOrdersStore((state) => state.orders.filter((o) => o.status === status));

export const useOrdersTotalValue = () =>
  useOrdersStore((state) =>
    state.orders.reduce((sum, order) => sum + order.total, 0)
  );
```