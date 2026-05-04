# Design: Admin & Ecommerce MVP

## Technical Approach

**Monorepo architecture** with separate `/backend` (Express/MongoDB) and `/frontend` (React/Vite/Tailwind) packages. Backend exposes REST API, frontend consumes with JWT auth via HTTP-only cookies.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project Structure | Monorepo | Single repo simplifies shared types, deployment, and atomic commits across backend/frontend |
| Backend Framework | Express + Mongoose | Minimal boilerplate, proven for MVP speed |
| Frontend Framework | React 19 + Vite | Concurrent features, compiler optimization |
| State Management | Zustand 5 | Simpler than Redux, TypeScript-native, perfect for this scale |
| DB Sessions | MongoDB-backed | No Redis dependency needed for MVP; plan migration later |
| Token Storage | HTTP-only cookies | XSS-safe; 7-day expiry + refresh endpoint |
| Payment | Stripe Checkout | PCI compliance handled, webhook reliability |

## Data Flow

```
Public User: Product List → Product Detail → Cart → Stripe Checkout → Order Created
                      ↓              ↓           ↑          ↓
                 GET /public/   GET /public/  POST    Webhook:
                 products?id      products/:id  /cart    Complete

Admin User: Login → Dashboard → Products List → Create/Edit/Delete → API Updated
               ↓         ↓            ↓                  ↓
            POST /auth   GET /admin   GET /api/admin/   PUT /api/admin/
            /login   /products     /products          /products/:id
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/models/User.ts` | Create | User schema with role enum (admin/user), bcrypt password |
| `backend/src/models/Product.ts` | Create | Product schema with name, price, images, stock, published flag |
| `backend/src/models/Order.ts` | Create | Order schema with items array, status enum, payment intent ID |
| `backend/src/models/Cart.ts` | Create | Cart schema with sessionId reference, items array |
| `backend/src/routes/auth.ts` | Create | Registration, login, logout, refresh endpoints |
| `backend/src/routes/products.ts` | Create | Admin CRUD with JWTRoleMiddleware |
| `backend/src/routes/publicProducts.ts` | Create | Public read-only endpoints |
| `backend/src/routes/cart.ts` | Create | Session-based cart operations |
| `backend/src/routes/checkout.ts` | Create | Stripe session creation, webhook handler |
| `backend/src/middleware/auth.ts` | Create | JWT verification, role-based authorization |
| `backend/src/middleware/validate.ts` | Create | Zod request validation |
| `frontend/src/App.tsx` | Create | React Router v6 with public/admin routes |
| `frontend/src/pages/admin/Dashboard.tsx` | Create | Admin layout with sidebar navigation |
| `frontend/src/pages/admin/Products.tsx` | Create | Product list with edit/delete actions |
| `frontend/src/pages/admin/ProductForm.tsx` | Create | Create/edit product form |
| `frontend/src/pages/public/Home.tsx` | Create | Featured products hero |
| `frontend/src/pages/public/Products.tsx` | Create | Product grid with search |
| `frontend/src/pages/public/ProductDetail.tsx` | Create | Product detail with add-to-cart |
| `frontend/src/pages/public/Cart.tsx` | Create | Cart review with quantity updates |
| `frontend/src/pages/public/Checkout.tsx` | Create | Stripe Checkout redirect |
| `frontend/src/store/auth.ts` | Create | Zustand store for user/profile |
| `frontend/src/store/cart.ts` | Create | Zustand store for cart state |
| `frontend/src/components/ui/Button.tsx` | Create | Earthbound Curator styled button |
| `frontend/src/components/ui/Card.tsx` | Create | Earthbound Curator styled card |
| `frontend/src/lib/stripe/client.ts` | Create | Stripe client initialization |
| `frontend/tailwind.config.js` | Create | Earthbound Curator color tokens and typography |

## Interfaces / Contracts

```typescript
// User Schema
interface User {
  _id: ObjectId;
  email: string;
  password: string; // bcrypt hash
  role: 'admin' | 'user';
  createdAt: Date;
}

// Product Schema
interface Product {
  _id: ObjectId;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  published: boolean;
  createdAt: Date;
}

// Cart Item
interface CartItem {
  productId: ObjectId;
  quantity: number;
  price: number;
}

// Order Schema
interface Order {
  _id: ObjectId;
  userId?: ObjectId;
  sessionId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed';
  stripePaymentIntentId: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Auth middleware, validation | Jest with mocked req/res |
| Integration | API routes with MongoDB | Supertest + mongodb-memory-server |
| E2E | Admin CRUD, public flow | Playwright: login, create product, buy product |
| Component | UI with a11y | React Testing Library + axe |

## Stripe Integration

1. **Client**: `loadStripe` with publishable key, redirect to Stripe Checkout
2. **Server**: Create Checkout Session with line items from cart
3. **Webhook**: `/api/checkout/webhook` handles `checkout.session.completed` → create order, clear cart
4. **Success/Cancel**: Redirect to `/checkout/success` or `/checkout/cancel`

## Security Considerations

- **JWT**: HS256 algorithm, 7-day expiry, HTTP-only cookies, refresh endpoint
- **CORS**: Configured for frontend origin only
- **Validation**: Zod schemas on all request bodies
- **Rate Limiting**: express-rate-limit on auth endpoints
- **Input Sanitization**: express-mongo-sanitize, prevent NoSQL injection