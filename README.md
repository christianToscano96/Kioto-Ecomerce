# Kioto Ecommerce

A MERN stack ecommerce platform with admin dashboard, built with the Earthbound Curator design system.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Zustand, React Query
- **Backend**: Express, Node.js, TypeScript, MongoDB, Mongoose
- **Payment**: Stripe
- **Design System**: Earthbound Curator (custom + Noto Serif/Manrope fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Installation

```bash
# Install all dependencies
npm install

# Build shared package
cd shared && npm run build

# Start development servers
npm run dev
```

## Environment Variables

### Backend (.env)

```
PORT=5050
MONGO_URI=mongodb://localhost:27017/kioto
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5050/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## Project Structure

```
kioto/
├── backend/          # Express API server
├── frontend/         # React Vite application
├── shared/           # Shared TypeScript types
└── openspec/         # SDD artifacts
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Products (Admin)

- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Products (Public)

- `GET /api/public/products` - List published products
- `GET /api/public/products/:id` - Get single product
- `GET /api/public/products?search=term` - Search products

### Cart

- `GET /api/cart` - Get cart contents
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Checkout

- `POST /api/checkout` - Create Stripe Checkout session
- `POST /api/checkout/webhook` - Handle Stripe webhook events

## Stripe Webhooks

Configure the following webhook endpoint in your Stripe Dashboard:

- Endpoint: `https://yourdomain.com/api/checkout/webhook`
- Events to listen:
  - `checkout.session.completed`
  - `checkout.session.expired`

## Testing

```bash
# Backend tests
npm run test --workspace=backend

# Frontend tests
npm run test --workspace=frontend

# E2E tests
npm run test:e2e --workspace=frontend
```

## Deployment

1. Build backend: `npm run build --workspace=backend`
2. Build frontend: `npm run build --workspace=frontend`
3. Start server: `npm start --workspace=backend`

## License

MIT
# Kioto-Ecomerce
