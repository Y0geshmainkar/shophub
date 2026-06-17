# ShopHub

A full-featured frontend e-commerce portal demo built to showcase enterprise-grade React architecture. Implements real-world patterns including a data normalization layer that reconciles two incompatible backend schemas (Shopify-like and ERP), a multi-step checkout wizard, protected routes with authentication, and accessible UI components — following the same architectural discipline used in production-scale applications.

🚀 **Live Demo:** https://y0geshmainkar.github.io/shophub/  
📦 **Repo:** https://github.com/Y0geshmainkar/shophub

---

## What I Built

- **Product Catalog** — dynamic category filtering and keyword search powered by Redux state; product grid with discount badges, wishlist, and hover-reveal Add to Cart
- **Product Detail** — multi-image gallery with thumbnail switcher, quantity stepper with stock validation, source system badge (Shopify / ERP), and related products
- **Shopping Cart** — persisted to `localStorage` via Redux middleware; line-item quantity control, tax calculation, coupon input
- **4-Step Checkout Wizard** — Shipping address form → Payment (Credit Card or Bank Draft) → Order Review → Confirmation; full field validation at each step
- **Order History** — fetches and normalizes order data via TanStack Query; status badges (pending / confirmed / shipped / delivered)
- **Registration Flow** — 3-step wizard with password strength meter, field validation, and Redux auth state
- **Protected Routes** — `/checkout` and `/orders` redirect unauthenticated users to registration
- **Global Loading Overlay** — reacts to any active TanStack Query fetch or mutation automatically

---

## Key Engineering Decisions

**Normalization Layer** — Products come from two incompatible source systems. A `normalizers.ts` adapter detects the schema automatically and maps both into a single `Product` type before data enters the component tree. Components never touch raw API shapes.

**State Separation** — TanStack Query owns all server state (loading, caching, error). Redux owns only client state (cart, active filters, auth). This keeps the store lean and avoids redundant cache management.

**Data Flow discipline** — All fetches go through `apiClient` (Axios instance with interceptors) → service functions → TanStack Query hooks → normalized types → components. No raw `fetch()` or inline axios calls anywhere.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript + Vite |
| Client State | Redux Toolkit — cart, filters, auth |
| Server State | TanStack Query — useQuery, useMutation |
| HTTP | Axios with interceptors |
| Styles | SCSS Modules + design tokens (`_tokens.scss`) |
| Tests | Jest + React Testing Library (44 tests) |
| Component Docs | Storybook |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Pages & Routes

| Route | Description | Auth |
|---|---|---|
| `/` | Product catalog — search, filter, grid | Public |
| `/product/:id` | Product detail — gallery, stepper, related | Public |
| `/cart` | Cart — line items, totals, coupon | Public |
| `/checkout` | 4-step checkout wizard | 🔒 Protected |
| `/orders` | Order history with status badges | 🔒 Protected |
| `/register` | 3-step registration wizard | Public |

---

## Architecture — Data Flow

```
public/localJson/*.json
       ↓
  apiClient.ts        ← Axios instance + interceptors
       ↓
  services/*.ts       ← productService, cartService, orderService
       ↓
  normalizers.ts      ← Shopify schema + ERP schema → Product type
       ↓
  TanStack Query      ← caching, loading, error states
       ↓
  Redux slices        ← cart, productsSlice, authSlice
       ↓
  Components          ← consume normalized types only
```

---

## Getting Started

```bash
npm install
npm run dev        # Dev server at localhost:5173
npm test           # Run 44 Jest/RTL tests
npm run storybook  # Component library at localhost:6006
npm run build      # Production build
```

---

## Project Structure

```
src/
├── api/            # Axios instance + interceptors
├── services/       # productService, cartService, orderService
├── data/           # normalizers.ts — dual-schema normalization
├── types/          # Product, CartEntry, Order — strict TypeScript
├── store/          # Redux: cartSlice, productsSlice, authSlice
├── components/     # Reusable components + Storybook stories
├── pages/          # Catalog, ProductDetail, Cart, Checkout, Orders, Register
└── styles/         # SCSS design tokens + global reset
```

---

## CI/CD

Every push to `master` triggers:
1. **Test job** — installs dependencies, runs all Jest tests
2. **Build & Deploy job** — production build deployed to GitHub Pages

> Enable: **GitHub repo → Settings → Pages → Source → GitHub Actions**
