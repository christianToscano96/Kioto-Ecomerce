# Admin Authentication & Authorization

## Purpose

JWT-based authentication with role-based access control for admin and customer users. Provides secure login, token management, and protected route access.

## Requirements

### Requirement: User Registration

The system MUST allow new users to register with email and password. Passwords MUST be hashed before storage.

#### Scenario: Register new user successfully

- GIVEN valid email and password are provided
- WHEN the registration endpoint is called
- THEN a new user account is created
- AND the password is hashed using bcrypt
- AND a JWT token is returned

#### Scenario: Reject duplicate email

- GIVEN an email already exists in the database
- WHEN registration is attempted with that email
- THEN the request fails with 409 Conflict
- AND error message indicates email is already registered

### Requirement: User Login

The system MUST authenticate users via email and password, returning a JWT token.

#### Scenario: Login with valid credentials

- GIVEN a registered user with verified password
- WHEN credentials are submitted to login endpoint
- THEN JWT token is returned with role claim
- AND token includes user ID and expiration

#### Scenario: Login fails with invalid credentials

- GIVEN incorrect email or password
- WHEN login is attempted
- THEN 401 Unauthorized is returned
- AND no token is issued

### Requirement: JWT Token Verification

The system MUST validate JWT tokens on protected routes.

#### Scenario: Access protected route with valid token

- GIVEN a valid JWT token in Authorization header
- WHEN accessing a protected endpoint
- THEN request proceeds with user context attached

#### Scenario: Access protected route without token

- GIVEN no token provided
- WHEN accessing a protected endpoint
- THEN 401 Unauthorized is returned

### Requirement: Admin Role Authorization

The system MUST restrict admin-only endpoints to users with admin role.

#### Scenario: Access admin route as admin user

- GIVEN JWT token with admin role claim
- WHEN accessing admin endpoint
- THEN access is granted

#### Scenario: Deny access to admin route as regular user

- GIVEN JWT token with user role claim
- WHEN accessing admin endpoint
- THEN 403 Forbidden is returned

# Product Management

## Purpose

Admin CRUD operations for product catalog. Enables administrators to create, read, update, and delete products that appear in the storefront.

## Requirements

### Requirement: Create Product

The system MUST allow admins to create new products with required fields.

#### Scenario: Admin creates product successfully

- GIVEN authenticated admin user
- WHEN POST request to /api/products with valid product data
- THEN product is created with unique ID and timestamps
- AND response returns 201 Created with product data

#### Scenario: Reject invalid product data

- GIVEN missing required fields (name, price, or images)
- WHEN create product is attempted
- THEN 400 Bad Request is returned with validation errors

### Requirement: List All Products

The system MUST return a paginated list of all products for admin management.

#### Scenario: Admin lists products

- GIVEN authenticated admin user
- WHEN GET request to /api/products
- THEN returns paginated list of all products
- AND includes product count and pagination metadata

### Requirement: Update Product

The system MUST allow admins to update existing product fields.

#### Scenario: Admin updates product

- GIVEN authenticated admin and existing product ID
- WHEN PUT request to /api/products/:id with updated data
- THEN product is updated
- AND 200 OK returns updated product

#### Scenario: Update non-existent product

- GIVEN product ID that does not exist
- WHEN update is attempted
- THEN 404 Not Found is returned

### Requirement: Delete Product

The system MUST allow admins to remove products from the catalog.

#### Scenario: Admin deletes product

- GIVEN authenticated admin and existing product ID
- WHEN DELETE request to /api/products/:id
- THEN product is removed from database
- AND 204 No Content is returned

# Public Product Catalog

## Purpose

Public-facing API for browsing products. Provides listing, search, and detail endpoints accessible without authentication.

## Requirements

### Requirement: List Products

The system MUST return products for public browsing with optional filtering.

#### Scenario: List all products

- GIVEN no filters applied
- WHEN GET request to /api/public/products
- THEN returns array of published products
- AND each product excludes admin-only fields

#### Scenario: Search products by name

- GIVEN search query parameter
- WHEN GET request with q parameter
- THEN returns products matching search term
- AND results are case-insensitive partial matches

### Requirement: Get Product Details

The system MUST return detailed information for a single product.

#### Scenario: Get published product detail

- GIVEN published product ID
- WHEN GET request to /api/public/products/:id
- THEN returns full product details
- AND response is 200 OK

#### Scenario: Product not found

- GIVEN non-existent product ID
- WHEN detail request is made
- THEN 404 Not Found is returned

# Shopping Cart

## Purpose

Session-based shopping cart management for customers. Enables adding, updating, and removing items with Redis-backed persistence.

## Requirements

### Requirement: Add Item to Cart

The system MUST add products to the customer's cart session.

#### Scenario: Add item to cart

- GIVEN valid session ID and product ID
- WHEN POST to /api/cart/items with quantity
- THEN item is added to cart
- AND response returns updated cart

#### Scenario: Add more than available stock

- GIVEN requested quantity exceeds product stock
- WHEN add to cart is attempted
- THEN 400 Bad Request is returned with error

### Requirement: Update Cart Item

The system MUST allow customers to change item quantities.

#### Scenario: Update item quantity

- GIVEN existing cart item
- WHEN PUT to /api/cart/items/:id with new quantity
- THEN cart item quantity is updated
- AND response returns updated cart

### Requirement: Remove Cart Item

The system MUST allow customers to remove items from cart.

#### Scenario: Remove item from cart

- GIVEN existing cart item
- WHEN DELETE to /api/cart/items/:id
- THEN item is removed from cart
- AND response returns updated cart

### Requirement: View Cart

The system MUST return current cart contents.

#### Scenario: View cart contents

- GIVEN active cart session
- WHEN GET to /api/cart
- THEN returns all cart items with product details
- AND includes calculated subtotal

# Checkout & Payments

## Purpose

Stripe integration for processing customer payments and creating orders.

## Requirements

### Requirement: Create Checkout Session

The system MUST create a Stripe Checkout session for cart items.

#### Scenario: Successful checkout session creation

- GIVEN valid cart with items
- WHEN POST to /api/checkout with shipping details
- THEN Stripe session is created
- AND client secret is returned for frontend

#### Scenario: Checkout with empty cart

- GIVEN cart with no items
- WHEN checkout is attempted
- THEN 400 Bad Request is returned

### Requirement: Handle Payment Success

The system MUST process successful payments and create orders.

#### Scenario: Successful payment webhook

- GIVEN Stripe webhook for completed payment
- WHEN webhook endpoint receives event
- THEN order is created with paid status
- AND cart is cleared
- AND success response is returned

### Requirement: Handle Payment Cancellation

The system MUST handle cancelled payments gracefully.

#### Scenario: Payment cancelled

- GIVEN payment cancellation
- WHEN webhook receives cancellation event
- THEN no order is created
- AND appropriate response is returned

# Admin Dashboard UI

## Purpose

Admin panel interface with sidebar navigation and product management screens.

## Requirements

### Requirement: Dashboard Layout

The system MUST render a consistent admin layout with sidebar navigation.

#### Scenario: Admin accesses dashboard

- GIVEN authenticated admin user
- WHEN navigating to /admin
- THEN dashboard layout renders with sidebar
- AND main content area shows overview

#### Scenario: Sidebar navigation

- GIVEN admin on any admin page
- WHEN clicking navigation items
- THEN correct admin section loads
- AND active state is indicated

### Requirement: Product Management Pages

The system MUST provide CRUD interfaces for products.

#### Scenario: View products list

- GIVEN admin on products page
- WHEN page loads
- THEN table of all products is displayed
- AND edit/delete actions are available

#### Scenario: Create product form

- GIVEN admin on new product page
- WHEN form is submitted with valid data
- THEN product is created
- AND admin is redirected to products list

# Public Ecommerce UI

## Purpose

Public storefront pages including home, product listings, cart, and checkout flows.

## Requirements

### Requirement: Home Page

The system MUST render the storefront home with featured products.

#### Scenario: Load home page

- GIVEN public visitor
- WHEN navigating to /
- THEN home page renders with featured products
- AND call-to-action buttons are visible

### Requirement: Product Listing

The system MUST display paginated products with search capability.

#### Scenario: Browse products

- GIVEN products exist
- WHEN visiting /products
- THEN product grid is displayed
- AND pagination controls are available

### Requirement: Product Detail

The system MUST show individual product details with add-to-cart.

#### Scenario: View product detail

- GIVEN published product
- WHEN visiting /products/:id
- THEN product images, price, description displayed
- AND add to cart form is available

### Requirement: Cart Page

The system MUST display current cart contents and allow modifications.

#### Scenario: View and modify cart

- GIVEN items in cart
- WHEN visiting /cart
- THEN cart items are listed with quantities
- AND update/remove actions work

### Requirement: Checkout Page

The system MUST collect shipping info and process payment.

#### Scenario: Complete checkout

- GIVEN items in cart
- WHEN filling shipping form and confirming
- THEN Stripe Checkout session is created
- AND user is redirected to Stripe

# Earthbound Curator Design System

## Purpose

Design system implementing Earthbound Curator brand with color tokens, typography, and reusable components.

## Requirements

### Requirement: Color Tokens

The system MUST implement Earthbound Curator color palette as CSS variables.

#### Scenario: Use brand colors

- GIVEN design system loaded
- WHEN components use color tokens
- THEN correct brand colors are applied
- AND accessible contrast ratios are maintained

### Requirement: Typography System

The system MUST define font scales for headings and body text.

#### Scenario: Apply typography

- GIVEN text elements
- WHEN using typography classes
- THEN consistent font sizes and weights are applied
- AND responsive scaling works

### Requirement: Reusable Components

The system MUST provide consistent UI components across admin and public interfaces.

#### Scenario: Use button component

- GIVEN button component
- WHEN rendered in different contexts
- THEN consistent styling is maintained
- AND variants (primary, secondary) work

#### Scenario: Responsive layouts

- GIVEN components on different viewports
- WHEN viewport changes
- THEN layouts adapt appropriately
- AND touch targets are adequate on mobile