# Implementation Tasks: Admin Ecommerce MVP

## Batch 1: Project Scaffolding & Infrastructure

### Backend Foundation
- [x] Initialize Express backend with TypeScript configuration
- [x] Configure MongoDB connection with Mongoose
- [x] Set up environment variables (.env.example with all required keys)
- [x] Configure CORS for frontend origin
- [x] Add security middleware: helmet, mongo-sanitize, rate-limit
- [x] Create Express app boilerplate with error handling middleware
- [ ] Set up structured logging (pino or winston)

### Frontend Foundation
- [x] Initialize React Vite frontend with TypeScript
- [x] Configure Tailwind CSS with content paths
- [x] Set up React Router v6 with route structure
- [x] Create basic Vite config for path aliases
- [ ] Add ESLint/Prettier configuration

### Shared Setup
- [x] Create monorepo root package.json with workspace config
- [x] Define shared TypeScript types package structure
- [x] Set up development scripts (concurrently, nodemon)

---

## Batch 2: Backend Models & Database

### User Model
- [x] Create User schema (email, password hash, role enum)
- [x] Add bcrypt password hashing middleware (pre-save hook)
- [x] Create user index on email field (unique)
- [x] Add methods: comparePassword, generateAuthToken

### Product Model
- [x] Create Product schema (name, slug, price, images, description, stock, published)
- [x] Add slug auto-generation from name
- [x] Create text index on name and description for search
- [x] Add virtual for image URLs

### Order Model
- [x] Create Order schema (items, total, status, stripePaymentIntentId)
- [x] Add status enum: pending, paid, failed
- [x] Create index on userId and status

### Cart Model
- [x] Create Cart schema (sessionId, items array with productId, quantity, price)
- [x] Create index on sessionId

---

## Batch 3: Backend Auth System

### Auth Middleware
- [x] Create JWT utilities (generate, verify, decode)
- [x] Implement authenticate middleware (verify token, attach user to req)
- [x] Implement authorize middleware (check role)
- [x] Configure HTTP-only cookie settings for JWT

### Auth Routes
- [x] POST /api/auth/register - user registration with validation
- [x] POST /api/auth/login - login with credentials, set cookie
- [x] POST /api/auth/logout - clear cookie
- [x] POST /api/auth/refresh - refresh JWT token

### Validation
- [x] Create Zod schemas for register/login requests
- [x] Add validation middleware wrapper

---

## Batch 4: Backend Product Routes

### Admin Product Routes
- [x] GET /api/products - list all products (admin only)
- [x] POST /api/products - create product (admin only)
- [x] PUT /api/products/:id - update product (admin only)
- [x] DELETE /api/products/:id - delete product (admin only)
- [x] Add Zod validation for product create/update

### Public Product Routes
- [x] GET /api/public/products - list published products
- [x] GET /api/public/products/:id - get single product
- [x] GET /api/public/products?search=term - search products
- [x] Add slug-based product lookup

---

## Batch 5: Backend Cart & Checkout

### Cart Routes
- [x] POST /api/cart/items - add item to cart
- [x] GET /api/cart - get cart contents
- [x] PUT /api/cart/items/:id - update item quantity
- [x] DELETE /api/cart/items/:id - remove item from cart
- [x] Validate stock availability on add

### Checkout Routes
- [x] POST /api/checkout - create Stripe Checkout session
- [x] POST /api/checkout/webhook - handle Stripe events
- [x] Webhook creates order on successful payment
- [x] Clear cart after successful payment

---

## Batch 6: Frontend Design System

### Tailwind Configuration
- [x] Add Earthbound Curator color tokens to tailwind.config.js
- [x] Configure custom fonts (Noto Serif for headlines, Manrope for body)
- [ ] Set up typography plugin with brand scales

### UI Components
- [x] Create Button component (primary, secondary, ghost variants)
- [x] Create Card component with hover states
- [x] Create Input component with error states
- [x] Create Badge component

### Layout Components
- [x] Create AdminSidebar with navigation links
- [x] Create PublicHeader for public site navigation

---

## Batch 7: Frontend State Management

### Zustand Stores
- [x] Create auth store (user, profile, isAuthenticated, login/logout)
- [x] Create cart store (items, addItem, updateItem, removeItem, clear)
- [x] Add persistence for cart store (sessionStorage)

### API Layer
- [x] Create axios instance with credentials: include
- [x] Add interceptors for auth errors
- [x] Create typed API hooks for each resource

---

## Batch 8: Frontend Admin Dashboard

### Pages
- [x] Create /admin route with Dashboard layout
- [x] Create Products list page with table
- [x] Create ProductForm page (create/edit)
- [x] Add delete confirmation modal

### Components
- [x] Products table with edit/delete actions
- [x] Form fields: name, price, images (URL array), description, stock, published checkbox
- [x] Image preview component
- [x] Form validation with error display

---

## Batch 9: Frontend Public Storefront

### Pages
- [x] Create / route - Home page with featured products
- [x] Create /products route - Product listing with search
- [x] Create /products/:id route - Product detail page
- [x] Create /cart route - Cart review and modification
- [x] Create /checkout route - Stripe Checkout redirect
- [x] Create /checkout/success and /checkout/cancel

### Components
- [x] ProductCard component with add-to-cart
- [x] Search input with debounce
- [x] Pagination component
- [x] Cart item component with quantity selector
- [x] Checkout form with shipping fields

---

## Batch 10: Stripe Integration

### Backend
- [x] Configure Stripe SDK with secret key
- [x] Set up webhook endpoint with signature verification
- [x] Create checkout session with line items from cart
- [x] Handle webhook events (payment success, failure)
- [x] Update order status based on webhook

### Frontend
- [x] Configure Stripe.js with publishable key
- [x] Create checkout button that calls backend
- [x] Handle redirect back from Stripe
- [x] Display success/cancel pages

---

## Batch 11: Testing Setup

### Backend Tests
- [x] Configure Jest with TypeScript preset
- [x] Set up mongodb-memory-server for integration tests
- [x] Write unit tests for auth middleware
- [ ] Write integration tests for product routes
- [ ] Write webhook tests with mocked Stripe events

### Frontend Tests
- [x] Configure React Testing Library (Vitest)
- [ ] Write component tests for UI components
- [ ] Write store tests for Zustand stores

### E2E Tests
- [x] Configure Playwright with test directory
- [ ] Write test: admin login and product CRUD
- [ ] Write test: public user browse to checkout flow
- [ ] Add accessibility checks with axe-core

---

## Success Criteria Checklist

- [ ] Admin can create/edit/delete products via dashboard
- [ ] Public can browse products and add to cart
- [ ] Checkout completes with Stripe test cards
- [ ] JWT auth protects admin routes
- [ ] Earthbound Curator design system implemented across all components