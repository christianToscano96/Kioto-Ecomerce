# Proposal: Admin & Ecommerce MVP

## Intent

Deliver a production-ready MERN ecommerce platform with admin dashboard and public storefront. This MVP establishes the core business foundation: product management, shopping flow, and payment processing.

## Scope

### In Scope
- **Backend**: JWT auth (admin/user roles), Product CRUD, Public product API, Session cart, Stripe integration
- **Frontend**: Admin dashboard with sidebar, Product management screens, Public storefront pages, Earthbound Curator design system
- **Shared**: MongoDB models (User, Product, Order, Cart), API documentation

### Out of Scope
- Order management dashboard
- Customer insights/analytics
- Advanced search/filtering
- Product variants/options
- User reviews/ratings
- Email notifications

## Capabilities

### New Capabilities
- `admin-auth`: JWT-based authentication with role-based access control
- `product-management`: Product CRUD operations for admins
- `public-catalog`: Public product listing and detail APIs
- `shopping-cart`: Session-based cart operations
- `payment-processing`: Stripe checkout integration
- `admin-dashboard`: Admin panel UI with navigation
- `ecommerce-storefront`: Public ecommerce pages
- `earthbound-design-system`: Design tokens, components, typography

### Modified Capabilities
- None (first vertical, all capabilities new)

## Approach

1. **Week 1**: Backend foundation — auth system, MongoDB models, Product CRUD, basic cart API
2. **Week 2**: Payment integration, Admin dashboard layout, Product management UI
3. **Week 3**: Public storefront pages, design system implementation, testing, documentation

Tech stack: Express routes with middleware, React Router v6, Context API for auth state, Tailwind CSS with custom Earthbound Curator theme.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/models/` | New | User, Product, Order, Cart schemas |
| `backend/src/routes/` | New | Auth, products, cart, checkout endpoints |
| `backend/src/middleware/` | New | JWT verification, role-based auth |
| `frontend/src/pages/admin/` | New | Dashboard, products CRUD pages |
| `frontend/src/pages/public/` | New | Home, products, product detail, cart, checkout |
| `frontend/src/components/ui/` | New | Earthbound Curator design system |
| `frontend/src/lib/stripe/` | New | Stripe client integration |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stripe webhook failures | Medium | Implement retry logic, fallback to manual order creation |
| Session-based cart limitations | Medium | Document constraint, plan Redis migration later |
| JWT token storage security | Low | HTTP-only cookies, short expiry with refresh |

## Rollback Plan

Backend: `git revert` to last stable commit, database migrations are additive only (no destructive changes). Frontend: Rollback via git history, no persisted client state.

## Dependencies

- Stripe account with API keys
- MongoDB Atlas or local instance
- Node.js 18+ runtime

## Success Criteria

- [ ] Admin can create/edit/delete products via dashboard
- [ ] Public can browse products and add to cart
- [ ] Checkout completes with Stripe test cards
- [ ] JWT auth protects admin routes
- [ ] Earthbound Curator design system implemented across all components