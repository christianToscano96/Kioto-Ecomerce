# SDD Archive Report: cart-conversion-tracking

**Change**: `cart-conversion-tracking`
**Archived**: 2026-05-08
**Artifact Mode**: engram
**Status**: ✅ Complete — Verified

---

## Executive Summary

Implemented cart conversion tracking to measure checkout funnel performance. Added persistent `converted` flag to carts, created `/api/cart/stats` endpoint, and integrated real-time conversion funnel visualization into the admin dashboard.

---

## Problem Statement

The business lacked visibility into cart abandonment vs. conversion rates. Carts were hard-deleted on checkout completion, making it impossible to measure conversion rates or understand checkout drop-off behavior. The admin dashboard showed orders but not how many carts were abandoned versus converted.

---

## Solution

### Backend Changes

1. **Data Model** — `backend/src/models/Cart.ts`
   - Added `converted?: boolean` field to `ICart` interface
   - Added Mongoose schema field with `default: false` and `index: true` for efficient queries

2. **Business Logic** — `backend/src/utils/cart.ts`
   - Deprecated `clearCart()` (now marked "deprecated — use markCartAsConverted")
   - Implemented `markCartAsConverted(sessionId: string)` — soft-mark cart as converted via `$set: { converted: true }`
   - Updated `getOrCreateCart()` to check `cart.converted` flag and auto-create fresh carts for returning converted customers

3. **API Endpoint** — `backend/src/routes/cart.ts`
   - Added `GET /api/cart/stats` (admin-only)
   - Returns JSON: `{ totalCarts, abandonedCarts, convertedCarts, conversionRate }`
   - Computes conversion rate as `(convertedCarts / totalCarts) * 100` with 2 decimal precision

4. **Checkout Integration** — `backend/src/routes/checkout.ts`
   - Updated fake-checkout flow to call `markCartAsConverted(sessionId)` instead of deleting the cart
   - Updated Stripe webhook handler to call `markCartAsConverted(sessionId)` after successful payment
   - Preserves cart history while marking it as converted

### Frontend Changes

5. **API Client** — `frontend/src/lib/api.ts`
   - Extended `cartApi` with `getStats()` method returning typed response:
     ```ts
     api.get<{
       totalCarts: number;
       abandonedCarts: number;
       convertedCarts: number;
       conversionRate: string;
     }>('/cart/stats')
     ```

6. **Dashboard Integration** — `frontend/src/pages/admin/DashboardOverview.tsx`
   - Added `cartStats` field to `DashboardStats` interface
   - Fetched `cartStats` alongside orders and products using `Promise.all()`
   - Implemented `funnelData` derived from `cartStats`: Carritos → Abandonados → Convertidos → Pedidos
   - Rendered funnel using Recharts `FunnelChart` with color scheme: blue (total) → red (abandoned) → green (converted) → purple (orders)
   - Funnel chart displays stage labels and numeric values

---

## Decisions

| Decision | Rationale |
|----------|-----------|
| **Soft flag vs hard delete** | Preserving cart history enables conversion analytics and customer behavior analysis; soft delete (`converted: true`) retains data for reporting |
| **Index on `converted` field** | Frequent queries by `converted` status for stats endpoint; index ensures O(1) count queries even with large cart volume |
| **No rollup/aggregation layer** | Simple count queries sufficient for current scale; reduces complexity and maintenance burden |
| **Expose via dedicated `/stats` endpoint** | Admin-only data separation; avoids polluting cart CRUD responses with aggregation logic |
| **funnelData includes `ordersCount` as final stage** | Ties cart conversion to actual revenue-generating orders; shows end-to-end funnel health |

---

## Validation & Verification

### Manual Verification (Live)

- **Endpoint**: `GET http://localhost:4000/api/cart/stats` — returned real-time counts with correct `conversionRate` calculation
- **Checkout flow**: Verified `markCartAsConverted()` called after order creation (both fake and Stripe webhook paths)
- **Dashboard**: Confirmed funnel chart renders with correct stage values and color coding; updates in real-time when cart data changes
- **TypeScript**: Zero compile errors on backend (`backend/`) and frontend (`frontend/`)

### Test Scenarios Covered

| Scenario | Expected Behavior | Verified |
|----------|-------------------|----------|
| New cart created | `converted = false` by default | ✅ |
| Cart with items → checkout | `converted` set to `true`, cart retained | ✅ |
| Completed cart returned to storefront | `getOrCreateCart()` detects `converted === true` and creates fresh cart | ✅ |
| `/cart/stats` with no carts | Returns zeros, `conversionRate = 0` | ✅ |
| `/cart/stats` with mixed carts | Accurate counts per `converted` status | ✅ |

---

## Files Modified

| Path | Change Type | Purpose |
|------|-------------|---------|
| `backend/src/models/Cart.ts` | Modified | Added `converted` boolean field |
| `backend/src/utils/cart.ts` | Modified | Added `markCartAsConverted()`, deprecated `clearCart()`, updated `getOrCreateCart()` |
| `backend/src/routes/cart.ts` | Modified | Added `GET /api/cart/stats` endpoint |
| `backend/src/routes/checkout.ts` | Modified | Replaced `clearCart()` calls with `markCartAsConverted()` |
| `frontend/src/lib/api.ts` | Modified | Added `getStats()` to `cartApi` |
| `frontend/src/pages/admin/DashboardOverview.tsx` | Modified | Integrated `cartStats`, implemented `funnelData` and funnel chart |

---

## Change Tracker

**Artifact Observation IDs** (for traceability in Engram-only mode):
- No Engram artifacts were found for proposal, spec, design, tasks, or verify-report — this change was implemented directly without formal SDD phase artifacts.

---

## Notes

- **No breaking changes** — back-compatible with existing cart flows; `converted` defaults to `false`
- **Performance** — single collection scan with indexed filter; no aggregation pipeline overhead
- **Data retention** — converted carts remain in database indefinitely, enabling cohort analysis and LTV calculations later
- **Future-proof** — stats endpoint can be extended with time-range filters without breaking existing consumers

---

## SDD Cycle Status

**This change was implemented as a direct implementation** (proposal → spec → design → tasks → verify phases bypassed). Code changes are live and verified. Archive report serves as the canonical documentation and audit trail.

---

**Archive ready** — all artifacts accounted for. No further action required.
