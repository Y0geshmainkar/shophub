# ShopHub

A frontend demo of an enterprise e-commerce portal built with React 18, Redux Toolkit, TanStack Query, and TypeScript. Demonstrates real-world architecture patterns including a backend data-normalization layer, secure checkout UX, protected routes, and accessibility.

🚀 **Live Demo:** https://y0geshmainkar.github.io/shophub/

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript + Vite |
| State | Redux Toolkit (cart, filters, auth) |
| Server State | TanStack Query (useQuery, useMutation) |
| HTTP | Axios with interceptors |
| Styles | SCSS Modules + design tokens |
| Tests | Jest + React Testing Library |
| Components | Storybook |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Architecture — Data Flow

```
public/localJson/*.json
       ↓
  apiClient.ts        ← Axios instance
       ↓
  services/*.ts       ← calls apiClient
       ↓
  normalizers.ts      ← adapts two source schemas → normalized type
       ↓
  TanStack Query      ← caches, loading/error states
       ↓
  Redux slices        ← cart, filters, auth (client state only)
       ↓
  Components          ← consume normalized types only
```

Two incompatible source schemas are normalized into one `Product` type:

| Field | Shopify-like | ERP |
|---|---|---|
| ID | `product_id` | `itemCode` |
| Name | `title` | `itemName` |
| Price | `variants[0].price` | `unitPrice` |
| Stock | `inventory_quantity` | `stockLevel` |

---

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Product catalog with search + category filter | Public |
| `/product/:id` | Product detail with image gallery + qty stepper | Public |
| `/cart` | Cart with line items, totals, coupon input | Public |
| `/checkout` | 4-step wizard: Shipping → Payment → Review → Confirm | 🔒 |
| `/orders` | Order history with status badges | 🔒 |
| `/register` | 3-step registration wizard | Public |

---

## Getting Started

```bash
npm install
npm run dev
```

### Other commands

```bash
npm test              # Run Jest tests (44 tests)
npm run storybook     # Launch Storybook on :6006
npm run build         # Production build
```

---

## Project Structure

```
src/
├── api/            # Axios instance + interceptors
├── services/       # productService, cartService, orderService
├── data/           # normalizers.ts (Shopify + ERP → Product)
├── types/          # Product, CartEntry, Order interfaces
├── store/          # Redux slices: cart, products, auth
├── components/     # Reusable UI components + Storybook stories
├── pages/          # Route-level page components
└── styles/         # SCSS tokens + global styles
```

---

## CI/CD

On every push to `master`:
1. **Test** — runs all Jest tests
2. **Build & Deploy** — builds and deploys to GitHub Pages

> Enable in repo: **Settings → Pages → Source → GitHub Actions**
