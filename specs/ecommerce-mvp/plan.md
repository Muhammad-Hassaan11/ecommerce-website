# Implementation Plan: E-Commerce MVP — MarketHub

**Branch**: `001-ecommerce-mvp` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/ecommerce-mvp/spec.md`

---

## Summary

Build a multi-vendor B2C e-commerce marketplace (MarketHub) using Next.js 14 App Router with TypeScript. All data (products, vendors, reviews) is sourced exclusively from Markdown files parsed via `gray-matter`. Client-side state (wishlist, submitted reviews) is persisted in `localStorage`. No database, no backend service, no authentication.

---

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20+  
**Framework**: Next.js 14+ (App Router, RSC-first)  
**Primary Dependencies**: `gray-matter` (MD parsing), `lucide-react` (icons), `next/image` (images)  
**Storage**: Markdown files in `data/` — no database  
**Testing**: None for MVP  
**Target Platform**: Web (Vercel static/ISR deployment)  
**Performance Goals**: LCP < 2s, search filter latency < 100ms  
**Constraints**: Zero backend, zero DB, localStorage for client state  
**Scale/Scope**: MVP — ~20 seed products, ~5 vendors, ~30 seed reviews  

---

## Constitution Check

- [x] Markdown-First Data Layer — `gray-matter` only, no DB imports
- [x] App Router + RSC — all data fetching in server components
- [x] Component Isolation — no business logic in page files
- [x] Schema Integrity — frontmatter validated at parse time
- [x] Simplicity/YAGNI — no payment, cart, auth, admin in scope
- [x] Design Excellence — dark-mode, animations, premium UI required

---

## Documentation (this feature)

```text
specs/ecommerce-mvp/
├── plan.md          # This file — architecture & implementation plan
├── spec.md          # Feature requirements & user stories
├── data-model.md    # Markdown frontmatter schemas per entity  [TODO]
├── quickstart.md    # Dev environment setup & run instructions [TODO]
└── tasks.md         # Granular task list (created via /sp.tasks) [TODO]
```

---

## Project Structure

```text
ecommerce-application/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, nav, footer)
│   ├── page.tsx                  # Homepage — product grid + search/filter
│   ├── globals.css               # Global CSS (design tokens, resets)
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx          # Product Detail Page (PDP)
│   ├── vendors/
│   │   └── [slug]/
│   │       └── page.tsx          # Vendor Storefront
│   └── wishlist/
│       └── page.tsx              # Wishlist page
│
├── components/                   # Reusable UI components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx       # Card with image, price, rating, vendor
│   │   ├── ProductGrid.tsx       # Responsive grid wrapper
│   │   └── ProductFilter.tsx     # Search + filter sidebar/panel
│   ├── vendor/
│   │   └── VendorBadge.tsx       # Clickable vendor name badge
│   ├── review/
│   │   ├── ReviewCard.tsx        # Single review display
│   │   ├── ReviewList.tsx        # List of reviews + aggregate rating
│   │   └── ReviewForm.tsx        # Submit review form (client component)
│   ├── wishlist/
│   │   └── WishlistButton.tsx    # Heart toggle button (client component)
│   └── ui/
│       ├── StarRating.tsx        # 1–5 star display + interactive widget
│       ├── Badge.tsx             # Category / tag badge
│       └── EmptyState.tsx        # Empty state illustration + message
│
├── lib/                          # Data access + utilities
│   ├── data/
│   │   ├── products.ts           # getAllProducts(), getProductBySlug()
│   │   ├── vendors.ts            # getAllVendors(), getVendorBySlug()
│   │   └── reviews.ts            # getReviewsByProductSlug()
│   └── utils/
│       ├── ratings.ts            # computeAverageRating()
│       └── wishlist.ts           # localStorage helpers
│
├── types/
│   └── index.ts                  # Product, Vendor, Review interfaces
│
├── data/                         # Markdown seed data
│   ├── products/
│   │   ├── wireless-headphones.md
│   │   ├── running-shoes-pro.md
│   │   └── ... (20 products total)
│   ├── vendors/
│   │   ├── techwave.md
│   │   ├── sportsgear.md
│   │   └── ... (5 vendors total)
│   └── reviews/
│       ├── wireless-headphones.md
│       └── ... (reviews per product)
│
├── public/
│   └── images/                   # Product + vendor images
│
├── specs/ecommerce-mvp/          # This spec
└── package.json
```

---

## Key Decisions & Rationale

| Decision | Options Considered | Chosen Approach | Rationale |
|---|---|---|---|
| Data storage | SQL DB, Supabase, JSON, Markdown | **Markdown + gray-matter** | Zero-backend constraint; human-readable seed data; git-trackable |
| Rendering strategy | CSR SPA, SSR per request, SSG+ISR | **SSG (`generateStaticParams`) + ISR** | Vercel-deployable without a server; instant cold loads |
| Client state | Redux, Zustand, Context, localStorage | **localStorage only** | No auth, no backend — simplest correct solution for wishlist & client reviews |
| Styling | Tailwind, CSS-in-JS, Styled Components | **Vanilla CSS Modules** | Constitution mandate; no extra build tooling; full design control |
| Search/filter | Algolia, server search, client-side | **Client-side filter on hydrated data** | Zero API cost; <100ms target achievable with ≤20 products in memory |
| Review persistence | DB writes, API routes, localStorage | **localStorage merge with seed MD** | No backend required; MVP scope; migration path documented in spec note |
| Icons | FontAwesome, Material Icons, custom SVG | **Lucide React** | Tree-shakable; consistent with Next.js ecosystem; zero CDN dependency |

---

## Interfaces & API Contracts

### `types/index.ts`

```typescript
export interface Product {
  slug: string
  name: string
  description: string
  price: number
  category: string
  images: string[]       // paths relative to /public/images/
  vendorSlug: string
  tags: string[]
  inStock: boolean
  createdAt: string      // ISO date string
}

export interface Vendor {
  slug: string
  name: string
  description: string
  bannerImage: string    // path relative to /public/images/
  logoImage: string
  location: string
  joinedAt: string       // ISO date string
  rating: number         // pre-computed aggregate, 1–5
}

export interface Review {
  productSlug: string
  reviewerName: string
  rating: number         // 1–5 (clamped)
  comment: string
  createdAt: string      // ISO date string
  source: 'seed' | 'local'  // distinguishes MD vs localStorage origin
}
```

### `lib/data/products.ts`

```typescript
// Returns all products parsed from data/products/*.md
// Skips files with missing required fields (console.warn + skip, never throws)
export function getAllProducts(): Product[]

// Returns a single product by slug, or null if not found
export function getProductBySlug(slug: string): Product | null

// Returns all unique category strings across all products
export function getAllCategories(): string[]
```

### `lib/data/vendors.ts`

```typescript
// Returns all vendors parsed from data/vendors/*.md
export function getAllVendors(): Vendor[]

// Returns a single vendor by slug, or null if not found
export function getVendorBySlug(slug: string): Vendor | null

// Returns all products belonging to a specific vendor
export function getProductsByVendorSlug(slug: string): Product[]
```

### `lib/data/reviews.ts`

```typescript
// Returns all seed reviews for a product from data/reviews/[slug].md
// Returns [] if the file does not exist — not an error
export function getSeedReviewsByProductSlug(slug: string): Review[]
```

### `lib/utils/ratings.ts`

```typescript
// Computes average from an array of reviews; returns 0 if empty
// Clamps individual ratings to [1, 5] range; logs warning if clamped
export function computeAverageRating(reviews: Review[]): number
```

### `lib/utils/wishlist.ts`

```typescript
// Reads wishlist slugs from localStorage["mh_wishlist"]
// Returns [] if localStorage is unavailable (private/incognito mode)
export function getWishlist(): string[]

// Adds a product slug to the wishlist (idempotent — no duplicates)
export function addToWishlist(slug: string): void

// Removes a product slug from the wishlist
export function removeFromWishlist(slug: string): void

// Returns true if the slug is currently wishlisted
export function isWishlisted(slug: string): boolean
```

### localStorage Key Conventions

| Key | Value | Used By |
|---|---|---|
| `mh_wishlist` | `string[]` (product slugs) | WishlistButton, wishlist page |
| `mh_reviews_[product-slug]` | `Review[]` (JSON) | ReviewForm, ReviewList |

---

## Non-Functional Requirements (NFRs)

| Concern | Target | Approach |
|---|---|---|
| **LCP** | < 2 seconds | SSG pre-renders all pages; `next/image` with `priority` on hero images |
| **Search filter latency** | < 100ms per keystroke | In-memory array filter with `useMemo`; no debounce needed at ≤20 products |
| **Accessibility** | Semantic HTML + ARIA labels | `aria-label` on icon buttons; `<nav>`, `<main>`, `<article>` elements; keyboard-navigable star widget |
| **Mobile responsiveness** | 320px–2560px | CSS Grid with `auto-fill + minmax`; fluid typography with `clamp()` |
| **localStorage degradation** | Graceful fail | `try/catch` wrapper in wishlist util; toast: "Wishlist unavailable in this browser mode" |
| **Malformed Markdown** | No crash | Per-file `try/catch` in data readers; `console.warn` + skip product |
| **Build time** | < 30s | SSG with ≤20 products × ≤5 vendors — trivially fast |
| **Client JS bundle** | Minimal | RSC-first; `"use client"` only on: `ProductFilter`, `WishlistButton`, `ReviewForm`, `StarRating` |

---

## Data Management

### Markdown Frontmatter Schemas

**Product** (`data/products/[slug].md`):
```yaml
---
slug: "wireless-headphones"
name: "Wireless Headphones Pro"
price: 129.99
category: "Electronics"
images:
  - "/images/products/headphones-1.jpg"
vendorSlug: "techwave"
tags: ["audio", "wireless"]
inStock: true
createdAt: "2026-01-15"
---
Full product description goes here as Markdown body.
```

**Vendor** (`data/vendors/[slug].md`):
```yaml
---
slug: "techwave"
name: "TechWave Store"
bannerImage: "/images/vendors/techwave-banner.jpg"
logoImage: "/images/vendors/techwave-logo.png"
location: "San Francisco, CA"
joinedAt: "2025-06-01"
rating: 4.7
---
Vendor description as Markdown body.
```

**Reviews** (`data/reviews/[product-slug].md`):
```yaml
---
reviews:
  - reviewerName: "Alice M."
    rating: 5
    comment: "Outstanding quality!"
    createdAt: "2026-02-10"
  - reviewerName: "Bob K."
    rating: 4
    comment: "Good value."
    createdAt: "2026-03-01"
---
```

### Schema Evolution Rules

1. **Adding a new optional field** → Add as `field?: type` in `types/index.ts`; add default in reader. No existing `.md` files need updating.
2. **Renaming a field** → Update `types/index.ts` + all `.md` files + reader. Document in spec changelog.
3. **Removing a field** → Mark deprecated in types first; remove in the follow-up spec version.
4. **New entity type** → Requires spec update + constitution amendment if it crosses the "no DB" boundary.

### Data Retention

- All Markdown seed data is source-controlled in `data/` — permanent, versioned.
- `localStorage` data has no server backup. Clearing browser storage permanently removes client-submitted reviews and wishlist. MVP-scope limitation; documented as known constraint.

---

## Implementation Phases

### Phase 1 — Project Scaffold & Design System
1. Init Next.js 14 with TypeScript (`npx create-next-app@latest`)
2. Install dependencies: `gray-matter`, `lucide-react`
3. Set up `globals.css` with design tokens (colors, fonts, spacing, animations)
4. Set up root `layout.tsx` with Navbar + Footer

### Phase 2 — Types & Data Layer
5. Define `types/index.ts` — Product, Vendor, Review interfaces
6. Implement `lib/data/products.ts` — parse `data/products/*.md`
7. Implement `lib/data/vendors.ts` — parse `data/vendors/*.md`
8. Implement `lib/data/reviews.ts` — parse `data/reviews/[slug].md`
9. Implement `lib/utils/ratings.ts` and `lib/utils/wishlist.ts`

### Phase 3 — Seed Data (20 products, 5 vendors, reviews)
10. Create 5 vendor `.md` files
11. Create 20 product `.md` files spread across vendors
12. Create seed review `.md` files for ~10 products

### Phase 4 — UI Components
13. `StarRating`, `Badge`, `EmptyState` (shared UI)
14. `VendorBadge` (vendor link)
15. `ProductCard` + `ProductGrid`
16. `WishlistButton` (client, localStorage)
17. `ProductFilter` (client, search + filters)
18. `ReviewCard` + `ReviewList` + `ReviewForm`

### Phase 5 — Pages
19. Homepage (`app/page.tsx`) — product grid + filter
20. Product Detail Page (`app/products/[slug]/page.tsx`)
21. Vendor Storefront (`app/vendors/[slug]/page.tsx`)
22. Wishlist Page (`app/wishlist/page.tsx`)

### Phase 6 — Polish & Verify
23. Responsive layout (mobile → desktop)
24. Animations & micro-interactions
25. Edge case handling (missing fields, empty states)
26. Smoke test all pages

---

## Operational Readiness

### Deployment

| Concern | Approach |
|---|---|
| **Platform** | Vercel (zero-config for Next.js) |
| **Build command** | `next build` — SSG pre-renders all product + vendor pages |
| **Output mode** | Static HTML + minimal client JS chunks |
| **Env variables** | None required (no secrets, no API keys) |
| **Rollback** | Git revert + Vercel instant rollback via dashboard |

### Observability (MVP-level)

| Signal | Approach |
|---|---|
| Malformed Markdown | `console.warn` with file path + missing field name |
| localStorage errors | `console.warn` + user toast: "Wishlist unavailable in this browser mode" |
| Missing vendorSlug match | `console.warn` + render "Unknown Vendor" badge — no crash |
| 404 pages | Next.js default 404; add custom styled `not-found.tsx` in Phase 6 |
| Build errors | TypeScript strict mode + Vercel PR previews — build fails loudly |

### Feature Flags

None required for MVP. All features ship together under branch `001-ecommerce-mvp`.

---

## Risk Analysis

| Risk | Likelihood | Blast Radius | Mitigation |
|---|---|---|---|
| **localStorage unavailable** (incognito/private mode) | Medium | Wishlist + client reviews break silently | `try/catch` wrapper; graceful degrade; toast notification |
| **Malformed `.md` crashes build** | Low | Entire build fails | Per-file `try/catch` in readers; skip + warn; TypeScript strict mode |
| **`next/image` external domain error** | Low | Images fail to render | Use only `/public/images/` local assets; no external domains needed for MVP |
| **Filter performance degrades** at scale beyond MVP | Low | Search feels slow | `useMemo` on filter; acceptable to ~500 products; documented migration path to a search service |
| **Review `localStorage` key collision** between products | Low | Reviews cross-contaminate | Key namespaced as `mh_reviews_[product-slug]` — unique per product |
| **`gray-matter` Node 20 incompatibility** | Very Low | Build fails | Pin `gray-matter@4.x` (LTS, widely tested) |

---

## Complexity Tracking

No constitution violations detected.

---

## Verification Plan

### Manual Smoke Tests

- Homepage renders 20 product cards from MD files
- Search filters grid in real time (< 100ms)
- Category / price / rating filters work (AND logic)
- Product Detail Page loads at `/products/[slug]`
- Reviews show from MD seed + localStorage merged
- Review form validates, submits, and persists on refresh
- Vendor Storefront shows only that vendor's products
- Wishlist toggle persists across browser refresh
- Empty wishlist shows empty state illustration
- All pages are mobile-responsive at 320px, 768px, 1280px

### Success Criteria Cross-Check

| Criterion | How to Verify |
|---|---|
| SC-001: Grid renders in < 2s | Lighthouse audit on Vercel preview; check LCP value |
| SC-002: Search < 100ms | DevTools Performance tab; measure `input` event → DOM repaint |
| SC-003: Wishlist persists after refresh | Add items → hard refresh (Ctrl+Shift+R) → confirm items show |
| SC-004: Reviews persist after refresh | Submit review → hard refresh → confirm review appears |
| SC-005: Accessibility | Lighthouse accessibility audit; axe DevTools extension |
| SC-006: Premium UI | Visual review — dark mode, animations, typography, glassmorphism |
| SC-007: Vendor isolation | Load vendor page → confirm zero products from other vendors |
| SC-008: Malformed MD handled | Add broken `.md` → `next dev` → confirm only a console warning, no crash |
