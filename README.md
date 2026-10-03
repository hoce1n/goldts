# goldts

A Persian-first **Next.js frontend for digital gold and coin commerce**, built to work with the [`goldCSharp`](https://github.com/hoce1n/goldCSharp) API. The application combines a customer shopping experience with authenticated catalog operations, live gold pricing, quote creation, and payment handoff.

## What this project demonstrates

- Building a production-style frontend with **Next.js App Router**, React, and TypeScript
- Creating reusable, typed API services and domain models for auth, market prices, coins, and quotes
- Handling JWT access tokens with refresh-token retry and queued failed requests
- Designing Persian RTL layouts with local fonts, localized dates, and Iranian-market terminology
- Implementing role-aware UI boundaries and protected routes
- Turning a gold-price feed into a weight-aware quote calculator and product pricing experience
- Building reusable commerce UI: product cards, filters, product details, cart, auth flows, OTP forms, and admin catalog controls

## Main flows

### Customer experience

- Browse active gold and coin products
- Filter by name, weight, and price; sort catalog results
- View product details and live price snapshots
- Add products to a shopping cart
- Calculate a quote by weight or amount
- Create and confirm a quote with an idempotency key
- Complete phone-based OTP authentication and registration
- Refresh access tokens automatically when an API session expires

### Authenticated operations

- Create, update, activate, deactivate, and delete coin products
- Edit stock and minting fees
- View catalog and market-price history through typed React Query hooks
- Restrict management actions by user role

## Technology stack

- **Next.js 16** and React 18
- **TypeScript** with typed API/domain models
- **Tailwind CSS 4** and Radix/shadcn-style UI primitives
- **TanStack Query** for server-state management
- **Zustand** for auth and cart state
- **Axios** with auth and refresh-token interceptors
- React Hook Form and Zod for form validation
- `moment-jalaali` and local Doran/Peyda fonts for Persian UX

## Architecture

```text
src/
├── app/          App Router pages, layouts, providers, and route groups
├── components/   Reusable UI, catalog, auth, cart, and layout components
├── hooks/        React Query hooks grouped by domain
├── services/     Typed API clients for auth, coins, market prices, and quotes
├── stores/       Zustand auth and cart stores
├── types/        API, auth, coin, market, and quote models
├── schemas/      Validation schemas
└── lib/          Axios client and shared utilities
```

## Getting started

### Prerequisites

- Node.js 20+ or Bun
- A running [`goldCSharp`](https://github.com/hoce1n/goldCSharp) API, or a compatible API with the documented routes

### Install and run

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

### Configure the API

Set the API origin through Next.js environment configuration:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://localhost:5001/api
```

Do not commit `.env.local` or credentials. The client expects the API to provide auth, coin/catalog, market-price, and quote endpoints.

## Pricing model

The project includes [`doc/IR_GOLD_18K.md`](doc/IR_GOLD_18K.md), which documents the pricing model:

```text
final price = (18K gold price per gram / 1000 × weight in milli) + minting fee
```

This keeps frontend calculations explicit and aligned with the backend’s gold-domain model.

## Related project

- Backend API: [`hoce1n/goldCSharp`](https://github.com/hoce1n/goldCSharp)

## License

No license has been specified yet. Add a license before distributing the application publicly.
