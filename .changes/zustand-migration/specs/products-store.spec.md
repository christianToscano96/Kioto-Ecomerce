# Products Store Specification

## Overview
New products store for product management with admin CRUD operations.

## State
```typescript
interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    published?: boolean;
    minPrice?: number;
    maxPrice?: number;
  };
  sortBy: 'name' | 'price' | 'createdAt';
  sortOrder: 'asc' | 'desc';
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
interface ProductsActions {
  // Public actions
  fetchProducts: () => Promise<void>;
  fetchProduct: (idOrSlug: string) => Promise<Product | null>;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<ProductsState['filters']>) => void;
  setSortBy: (sortBy: ProductsState['sortBy']) => void;
  setSortOrder: (order: ProductsState['sortOrder']) => void;

  // Admin actions
  fetchAdminProducts: (page?: number, limit?: number) => Promise<void>;
  createProduct: (data: CreateProductInput) => Promise<Product | null>;
  updateProduct: (id: string, data: UpdateProductInput) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Utils
  clearError: () => void;
  reset: () => void;
}
```

## Requirements

### REQ-001: fetchProducts - Load public product list
**GIVEN** a user browsing products
**WHEN** `fetchProducts()` is called
**THEN**
- Set `isLoading` to true
- Apply current filters, search query, and sort settings
- Make GET request to `/api/public/products`
- On success: replace `products` array, update pagination info
- On failure: set `error` with message
- Set `isLoading` to false

**GIVEN** search query is set
**WHEN** `fetchProducts()` is called
**THEN** request includes `q` parameter with search query

### REQ-002: fetchProduct - Load single product by ID or slug
**GIVEN** a user viewing a product page
**WHEN** `fetchProduct(idOrSlug)` is called
**THEN**
- Set `isLoading` to true
- Try fetching as slug first: `/api/public/products/slug/${idOrSlug}`
- On 404, try as ID: `/api/public/products/${idOrSlug}`
- On success: set `currentProduct`
- On failure: set `error` with message
- Set `isLoading` to false

### REQ-003: fetchAdminProducts - Load admin product list
**GIVEN** an admin user accessing the admin panel
**WHEN** `fetchAdminProducts(page?, limit?)` is called
**THEN**
- Set `isLoading` to true
- Make GET request to `/api/products` with pagination params
- On success: replace `products` array, update pagination from response headers
- On failure (403): set error "Unauthorized", user should not have access
- On failure (401): redirect to login
- On other failures: set error with message
- Set `isLoading` to false

### REQ-004: createProduct - Create new product (admin)
**GIVEN** an admin user with valid product data
**WHEN** `createProduct(data)` is called
**THEN**
- Set `isLoading` to true
- Make POST request to `/api/products` with product data
- On success: prepend new product to `products` array, show success toast
- On validation error (400): set error with field-specific messages
- On failure: set error with message, show error toast
- Set `isLoading` to false

### REQ-005: updateProduct - Update existing product (admin)
**GIVEN** an admin user modifying a product
**WHEN** `updateProduct(id, data)` is called
**THEN**
- Set `isLoading` to true
- Store current state for rollback
- Optimistically update product in local array
- Make PUT request to `/api/products/${id}`
- On success: confirm update, show success toast "Product updated"
- On failure: rollback to previous state, show error toast
- Set `isLoading` to false

### REQ-006: deleteProduct - Delete product (admin)
**GIVEN** an admin user confirming product deletion
**WHEN** `deleteProduct(id)` is called
**THEN**
- Set `isLoading` to true
- Store current state for rollback
- Optimistically remove product from local array
- Make DELETE request to `/api/products/${id}`
- On success: remove from products array, show success toast "Product deleted"
- On failure: restore product, show error toast
- Set `isLoading` to false

### REQ-007: Filtering and search
**GIVEN** filter criteria are set
**WHEN** `fetchProducts()` is called
**THEN**
- Filter by `published` status if specified
- Filter by `minPrice` and `maxPrice` ranges if specified
- Apply search query to product name/description
- Request includes sort parameters

### REQ-008: Sorting
**GIVEN** `sortBy` and `sortOrder` are set
**WHEN** `fetchProducts()` or `fetchAdminProducts()` is called
**THEN**
- Request includes `sortBy` and `sortOrder` parameters
- Default sort: `createdAt` descending
- Supported fields: `name`, `price`, `createdAt`

## Selectors
```typescript
export const useProducts = () => useProductsStore((state) => state.products);
export const useCurrentProduct = () => useProductsStore((state) => state.currentProduct);
export const useProductsLoading = () => useProductsStore((state) => state.isLoading);
export const useProductsError = () => useProductsStore((state) => state.error);
export const useProductsPagination = () => useProductsStore((state) => state.pagination);

// Filter/sort selectors
export const useProductSearchQuery = () => useProductsStore((state) => state.searchQuery);
export const useProductFilters = () => useProductsStore((state) => state.filters);
export const useProductSort = () => useProductsStore((state) => ({
  sortBy: state.sortBy,
  sortOrder: state.sortOrder,
}));
```