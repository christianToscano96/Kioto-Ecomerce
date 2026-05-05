## Exploration: Category Management System

### Current State

The project is an e-commerce admin system with:
- **Backend**: Express.js + MongoDB (Mongoose) with existing Product, User, Order, Cart models
- **Frontend**: React + Zustand for state management with established patterns
- **API**: RESTful endpoints under `/api/` with auth middleware
- **Models**: Located in `backend/src/models/` following a consistent schema pattern
- **Routes**: Organized by resource in `backend/src/routes/`
- **Frontend**: Admin pages in `frontend/src/pages/admin/` with a `ProductsList` pattern

There is NO category model or category-related code currently in the codebase.

### Affected Areas

- **`backend/src/models/Category.ts`** — NEW file needed (Category model)
- **`backend/src/models/Product.ts`** — needs `categoryId` field added
- **`backend/src/schemas/category.ts`** — NEW file (Zod validation schemas)
- **`backend/src/schemas/product.ts`** — needs update for categoryId
- **`backend/src/routes/categories.ts`** — NEW file (CRUD routes)
- **`backend/src/index.ts`** — needs `/api/categories` route registration
- **`frontend/src/lib/api.ts`** — needs `adminCategoriesApi`
- **`frontend/src/store/categories.ts`** — NEW file (Zustand store)
- **`frontend/src/store/index.ts`** — needs category exports
- **`frontend/src/pages/admin/CategoriesList.tsx`** — NEW file
- **`frontend/src/pages/admin/CategoryForm.tsx`** — NEW file
- **`frontend/src/pages/admin/ProductForm.tsx`** — needs category selector
- **`shared/src/index.ts`** — needs Category interface

### Approaches

**Approach 1: Simple Reference by ID (Recommended)**
- Category stored as `categoryId` reference in Product
- Simple string field in shared types
- Category routes with full CRUD

Pros:
- Minimal changes to existing Product model
- Clean separation of concerns
- Easy to query and filter products by category

Cons:
- Requires lookup to get category name (N+1 concern)
- No embedded category info in product responses

Effort: Medium

**Approach 2: Embedded Category Name**
- Store both `categoryId` and `categoryName` in Product
- Denormalized for faster queries

Pros:
- No join/lookup needed for product list views
- Better performance for read-heavy operations

Cons:
- Data duplication
- Need to handle category name updates across products

Effort: Medium-High

**Approach 3: Virtual Populate**
- Use Mongoose virtual populate to always include category
- Leverages Mongoose's population feature

Pros:
- Always have category data available
- Single source of truth

Cons:
- More complex implementation
- Potential performance impact on large collections

Effort: High

### Recommendation

**Approach 1: Simple Reference by ID** - This aligns with:
1. The existing codebase patterns (Products, Orders, Users all use references)
2. The principle of single source of truth
3. Simpler implementation with fewer edge cases
4. The project already uses Zustand stores per domain (products, orders, cart)

Key considerations:
- Use slug for URL-friendly category references (not just ObjectId)
- Categories should have image field for visual identification
- Category selector in ProductForm should be a dropdown with search

### Risks

- **Migration consideration**: Existing products won't have categoryId - need to handle gracefully (optional field)
- **Slug uniqueness**: Category slugs must be unique like product slugs
- **Frontend state sync**: After creating a category, ProductForm dropdown needs refresh
- **Circular dependency**: Avoid importing Category model in Product schema validation

### Ready for Proposal

Yes - the scope is clear and approach is recommended. The orchestrator should proceed with the proposal phase using the Simple Reference approach.