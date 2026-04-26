# Tasks: E-Commerce MVP — MarketHub

**Input**: `specs/ecommerce-mvp/plan.md`, `specs/ecommerce-mvp/spec.md`, `specs/ecommerce-mvp/data-model.md`  
**Branch**: `001-ecommerce-mvp` | **Date**: 2026-04-06

---

## Format: `[ID] [P?] [Story] Description`

- **[P]** = Can run in parallel (operates on different files; no dependency on sibling tasks)
- **[USn]** = Maps to User Story n from `spec.md`
- Each task references its exact target file path

---

## Phase 1: Setup — Project Scaffold & Design System

**Purpose**: Initialize the Next.js 14 project and establish the design system before any feature work begins.

- [x] T001 Init Next.js 14 with TypeScript using `npx create-next-app@latest` (see `quickstart.md §2`)
- [x] T002 Install dependencies: `npm install gray-matter lucide-react`
- [x] T003 Create all required directories per `quickstart.md §5` (`data/`, `components/`, `lib/`, `types/`, `public/images/`)
- [x] T004 Set up `app/globals.css` — design tokens: dark-mode color palette (HSL), CSS custom properties, fluid typography with `clamp()`, spacing scale, animation keyframes (`fadeIn`, `slideUp`, `scaleIn`)
- [x] T005 Set up `app/layout.tsx` — root layout with Google Fonts (Inter/Outfit), `<Navbar />` and `<Footer />` placeholders, `<main>` wrapper
- [x] T006 [P] Create `components/layout/Navbar.tsx` — logo, nav links (Home, Wishlist), responsive hamburger menu
- [x] T007 [P] Create `components/layout/Footer.tsx` — brand name, links, copyright

**Checkpoint**: `npm run dev` loads at `localhost:3000` with Navbar + Footer visible. Design tokens applied. No TypeScript errors.

---

## Phase 2: Types & Data Layer

**Purpose**: Core infrastructure that MUST be complete before any UI component or page can be built. All data flows through this layer.

> ⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [x] T008 Define `types/index.ts` — `Product`, `Vendor`, `Review` interfaces per `data-model.md` (include `source: 'seed' | 'local'` on Review)
- [x] T009 Implement `lib/data/products.ts` — `getAllProducts()`, `getProductBySlug()`, `getAllCategories()` — parse `data/products/*.md` with gray-matter; skip + `console.warn` on malformed files
- [x] T010 Implement `lib/data/vendors.ts` — `getAllVendors()`, `getVendorBySlug()`, `getProductsByVendorSlug()` — parse `data/vendors/*.md`
- [x] T011 Implement `lib/data/reviews.ts` — `getSeedReviewsByProductSlug()` — parse `data/reviews/[slug].md`; return `[]` if file missing (not an error)
- [x] T012 [P] Implement `lib/utils/ratings.ts` — `computeAverageRating(reviews: Review[]): number` — clamp input ratings to [1,5]; return 0 for empty array
- [x] T013 [P] Implement `lib/utils/wishlist.ts` — `getWishlist()`, `addToWishlist()`, `removeFromWishlist()`, `isWishlisted()` — all wrapped in `try/catch`; degrade silently if localStorage unavailable

**Checkpoint**: Run `npx tsc --noEmit` — zero type errors. Run gray-matter smoke test from `quickstart.md §7` — products print correctly.

---

## Phase 3: Seed Data — Products, Vendors, Reviews

**Purpose**: Populate `data/` with the 20 products, 5 vendors, and seed reviews defined in `data-model.md`. No UI needed yet.

### Vendors (5)

- [x] T014 [P] Create `data/vendors/techwave.md` — slug: `techwave`, Electronics, San Francisco CA
- [x] T015 [P] Create `data/vendors/sportsgear.md` — slug: `sportsgear`, Footwear & Sports, Portland OR
- [x] T016 [P] Create `data/vendors/fitlife.md` — slug: `fitlife`, Fitness & Wellness, Austin TX
- [x] T017 [P] Create `data/vendors/urbancraft.md` — slug: `urbancraft`, Accessories & Lifestyle, New York NY
- [x] T018 [P] Create `data/vendors/apparel-co.md` — slug: `apparel-co`, Clothing, Los Angeles CA

### Products (20) — see full list in `data-model.md §Seed Products`

- [x] T019 [P] Create `data/products/wireless-headphones.md` — Electronics, vendorSlug: `techwave`, price: 129.99
- [x] T020 [P] Create `data/products/running-shoes-pro.md` — Footwear, vendorSlug: `sportsgear`, price: 89.99
- [x] T021 [P] Create `data/products/yoga-mat-premium.md` — Fitness, vendorSlug: `fitlife`, price: 49.99
- [x] T022 [P] Create `data/products/mechanical-keyboard.md` — Electronics, vendorSlug: `techwave`, price: 149.99
- [x] T023 [P] Create `data/products/leather-wallet.md` — Accessories, vendorSlug: `urbancraft`, price: 39.99
- [x] T024 [P] Create `data/products/protein-shaker.md` — Fitness, vendorSlug: `fitlife`, price: 24.99
- [x] T025 [P] Create `data/products/sunglasses-uv400.md` — Accessories, vendorSlug: `urbancraft`, price: 59.99
- [x] T026 [P] Create `data/products/smartwatch-fitness.md` — Electronics, vendorSlug: `techwave`, price: 199.99
- [x] T027 [P] Create `data/products/trail-running-vest.md` — Footwear, vendorSlug: `sportsgear`, price: 74.99
- [x] T028 [P] Create `data/products/cotton-tshirt-pack.md` — Clothing, vendorSlug: `apparel-co`, price: 34.99
- [x] T029 [P] Create `data/products/foam-roller.md` — Fitness, vendorSlug: `fitlife`, price: 29.99
- [x] T030 [P] Create `data/products/wireless-charger.md` — Electronics, vendorSlug: `techwave`, price: 44.99
- [x] T031 [P] Create `data/products/ceramic-water-bottle.md` — Accessories, vendorSlug: `urbancraft`, price: 32.99
- [x] T032 [P] Create `data/products/compression-socks.md` — Footwear, vendorSlug: `sportsgear`, price: 19.99
- [x] T033 [P] Create `data/products/backpack-30l.md` — Accessories, vendorSlug: `urbancraft`, price: 99.99
- [x] T034 [P] Create `data/products/resistance-bands-set.md` — Fitness, vendorSlug: `fitlife`, price: 27.99
- [x] T035 [P] Create `data/products/laptop-stand-aluminum.md` — Electronics, vendorSlug: `techwave`, price: 64.99
- [x] T036 [P] Create `data/products/hooded-sweatshirt.md` — Clothing, vendorSlug: `apparel-co`, price: 54.99
- [x] T037 [P] Create `data/products/trail-shoes.md` — Footwear, vendorSlug: `sportsgear`, price: 109.99
- [x] T038 [P] Create `data/products/portable-blender.md` — Fitness, vendorSlug: `fitlife`, price: 37.99

### Seed Reviews (10 products)

- [x] T039 [P] Create `data/reviews/wireless-headphones.md` — 3 reviews, ratings 5/4/5
- [x] T040 [P] Create `data/reviews/running-shoes-pro.md` — 3 reviews, ratings 4/5/4
- [x] T041 [P] Create `data/reviews/mechanical-keyboard.md` — 2 reviews, ratings 5/4
- [x] T042 [P] Create `data/reviews/smartwatch-fitness.md` — 3 reviews, ratings 4/3/5
- [x] T043 [P] Create `data/reviews/yoga-mat-premium.md` — 2 reviews, ratings 5/5
- [x] T044 [P] Create `data/reviews/leather-wallet.md` — 2 reviews, ratings 4/4
- [x] T045 [P] Create `data/reviews/backpack-30l.md` — 3 reviews, ratings 5/4/4
- [x] T046 [P] Create `data/reviews/trail-shoes.md` — 2 reviews, ratings 4/5
- [x] T047 [P] Create `data/reviews/foam-roller.md` — 2 reviews, ratings 5/4
- [x] T048 [P] Create `data/reviews/wireless-charger.md` — 2 reviews, ratings 4/3

**Checkpoint**: Smoke test (`quickstart.md §7`) prints all 20 product slugs. `npm run build` completes without errors.

---

## Phase 4: Shared UI Components

**Purpose**: Build atomic components used across all user stories. These have no story-specific dependencies.

- [x] T049 [P] Create `components/ui/StarRating.tsx` — displays 1–5 filled/empty/half stars; accepts `rating: number`, `interactive?: boolean`; keyboard-navigable when interactive; hover highlight animation
- [x] T050 [P] Create `components/ui/Badge.tsx` — category / tag pill with background color variant; accepts `label: string`, `variant?: 'category' | 'tag' | 'vendor'`
- [x] T051 [P] Create `components/ui/EmptyState.tsx` — centered illustration (SVG inline), heading, subtext, optional CTA button; accepts `title`, `description`, `ctaLabel?`, `ctaHref?`
- [x] T052 [P] Create `components/vendor/VendorBadge.tsx` — clickable badge linking to `/vendors/[vendorSlug]`; accepts `vendorSlug`, `vendorName`; shows "Unknown Vendor" when name is missing

**Checkpoint**: Each component renders in isolation when imported and passed minimal props.

---

## Phase 5: User Story 1 — Browse & Discover Products (Priority: P1) 🎯 MVP

**Goal**: Render the full product grid on the homepage — name, image, price, rating, vendor badge — sourced from Markdown files.

**Independent Test** (from `spec.md`): Load `/` and confirm ≥ 6 product cards render with name, image, price, vendor, and rating visible.

### Implementation

- [x] T053 [US1] Create `components/product/ProductCard.tsx` — product image (`next/image`), name, price, category badge, star rating, vendor badge, wishlist button slot; hover lift + shadow animation (`transform: translateY(-4px)`)
- [x] T054 [US1] Create `components/product/ProductGrid.tsx` — CSS Grid wrapper with `auto-fill, minmax(280px, 1fr)`; accepts `products: Product[]`; renders `<ProductCard />` per item; renders `<EmptyState />` when array is empty
- [x] T055 [US1] Implement `app/page.tsx` — server component; calls `getAllProducts()`; passes products to `<ProductGrid />`; no client-side logic in this file

**Checkpoint**: `http://localhost:3000` renders all 20 product cards. Each card shows image, name, price, category badge, star rating, and vendor badge.

---

## Phase 6: User Story 2 — Search & Filter Products (Priority: P2)

**Goal**: Real-time client-side search + filters (category, price range, vendor, min rating) that narrow the product grid.

**Independent Test**: Type a product name in the search bar → grid updates to matching products only, < 100ms.

### Implementation

- [x] T056 [US2] Create `components/product/ProductFilter.tsx` — `"use client"` component; state: `search`, `selectedCategory`, `minPrice`, `maxPrice`, `selectedVendor`, `minRating`; emits `onFilterChange(filtered: Product[])`; search input + category select + price inputs + vendor select + star rating picker; results update on every `onChange`
- [x] T057 [US2] Update `app/page.tsx` — pass all products as prop to `<ProductFilter />`; `<ProductFilter />` owns filtered state and renders `<ProductGrid />` internally with filtered results

**Checkpoint**: Search "headphones" → only wireless-headphones card shows. Select "Fitness" category → only 6 fitness products show. Set min rating 5 → only 5-star rated products show.

---

## Phase 7: User Story 3 — Vendor Storefront (Priority: P3)

**Goal**: A dedicated `/vendors/[slug]` page showing vendor banner, bio, and their products only.

**Independent Test**: Click any vendor badge → `/vendors/techwave` loads with TechWave's name, bio, banner, and only TechWave products.

### Implementation

- [x] T058 [US3] Create `app/vendors/[slug]/page.tsx` — server component; `generateStaticParams()` from `getAllVendors()`; calls `getVendorBySlug(slug)` + `getProductsByVendorSlug(slug)`; renders vendor banner (`next/image`), logo, name, location, joined date, description, and `<ProductGrid products={vendorProducts} />`; 404 if vendor not found
- [x] T059 [US3] Update `components/vendor/VendorBadge.tsx` if needed — ensure link uses correct `/vendors/[slug]` href

**Checkpoint**: Navigate to `/vendors/fitlife` → only FitLife products appear. Navigate to `/vendors/techwave` → only TechWave products appear. No cross-contamination.

---

## Phase 8: User Story 4 — Product Detail Page (Priority: P4)

**Goal**: Full-detail page at `/products/[slug]` with images, description, specs, vendor info, and reviews section.

**Independent Test**: Click a product card → `/products/wireless-headphones` loads with full info and review section (aggregate rating + all seed reviews).

### Implementation

- [x] T060 [US4] Create `components/review/ReviewCard.tsx` — displays reviewer name, star rating, date, comment; `source` badge ("Verified Seed" vs "Community")
- [x] T061 [US4] Create `components/review/ReviewList.tsx` — accepts `reviews: Review[]`; renders aggregate average rating + count prominently; lists `<ReviewCard />` per review; shows `<EmptyState title="Be the first to review!" />` when empty
- [x] T062 [US4] Create `app/products/[slug]/page.tsx` — server component; `generateStaticParams()` from `getAllProducts()`; loads product + vendor + seed reviews; renders: image gallery, name, price, category/tag badges, `<VendorBadge />`, full description (Markdown body), `<ReviewList seedReviews={...} />`, `<ReviewForm productSlug={...} />`; 404 if product not found

**Checkpoint**: `/products/wireless-headphones` shows images, description, TechWave badge, star aggregate, and all 3 seed reviews. `/products/portable-blender` (no reviews) shows "Be the first to review!"

---

## Phase 9: User Story 5 — Submit a Review & Rating (Priority: P5)

**Goal**: Review form on PDP — name, star rating, comment — submits and persists via localStorage. Merged with seed reviews on load.

**Independent Test**: Fill review form → click Submit → new review appears at top of list without page reload.

### Implementation

- [x] T063 [US5] Create `components/review/ReviewForm.tsx` — `"use client"`; state: `name`, `rating`, `comment`; inline validation (all fields required; rating 1–5); on submit: write to `localStorage["mh_reviews_[slug]"]`; optimistic UI — appends review to displayed list immediately; star widget highlights on hover before selection; clear form after submit
- [x] T064 [US5] Update `components/review/ReviewList.tsx` — `"use client"`; on mount read `localStorage["mh_reviews_[slug]"]`; merge with `seedReviews` prop (seed reviews first, local reviews appended); recompute aggregate with merged set

**Checkpoint**: Submit review at `/products/wireless-headphones` → review appears instantly. Hard refresh → review still shows. Submit empty form → validation errors appear; form does not submit.

---

## Phase 10: User Story 6 — Wishlist (Priority: P6)

**Goal**: Heart toggle on every product card + PDP; `/wishlist` page shows all saved products.

**Independent Test**: Click heart on 2 products → navigate to `/wishlist` → both appear.

### Implementation

- [x] T065 [US6] Create `components/wishlist/WishlistButton.tsx` — `"use client"`; reads `isWishlisted(slug)` on mount; toggles `addToWishlist` / `removeFromWishlist` on click; heart icon fills + scale animation on add; hollow on remove; shows toast "Wishlist unavailable in this browser mode" if localStorage throws
- [x] T066 [US6] Update `components/product/ProductCard.tsx` — embed `<WishlistButton slug={product.slug} />` in top-right corner of card
- [x] T067 [US6] Create `app/wishlist/page.tsx` — `"use client"`; on mount reads `getWishlist()` slugs; maps to full `Product` data (import `getAllProducts()` or pass as prop via server component wrapper); renders `<ProductGrid products={wishlisted} />`; shows `<EmptyState title="Your wishlist is empty" description="Click the heart on any product to save it." ctaLabel="Browse Products" ctaHref="/" />` when empty; remove button on each card removes from localStorage and updates UI

**Checkpoint**: Add 3 products to wishlist → navigate to `/wishlist` → 3 cards shown with remove buttons. Click remove → card disappears. Refresh → only remaining items show. Clear all → empty state appears.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Responsiveness, animations, edge cases, accessibility, and final smoke test across all routes.

- [x] T068 Responsive layout audit — test at 320px, 768px, 1024px, 1280px; fix any grid/nav overflow issues
- [x] T069 Add micro-interactions to `ProductCard.tsx` — hover lift (`translateY(-4px)`), shadow depth increase, image zoom (scale 1.05 on `<img>` with overflow hidden on card)
- [x] T070 Add page-level `fadeIn` / `slideUp` entry animations to homepage, PDP, vendor page, wishlist page
- [x] T071 [P] Add custom `app/not-found.tsx` — styled 404 page with "Page not found" message and back-to-home CTA
- [x] T072 [P] Add `<meta>` descriptions and `<title>` tags to all page files (homepage, PDP, vendor, wishlist)
- [x] T073 [P] Accessibility pass — add `aria-label` to all icon-only buttons (WishlistButton, close icons); verify `<nav>`, `<main>`, `<article>` usage; test keyboard tab order on star rating widget
- [x] T074 Edge case: product with missing `vendorSlug` match → confirm "Unknown Vendor" renders, no crash
- [x] T075 Edge case: `localStorage` unavailable → confirm toast appears on WishlistButton click, app does not throw
- [x] T076 Edge case: empty `data/products/` directory → confirm homepage renders `<EmptyState />` not a crash
- [x] T077 Final smoke test — manually walk through all routes: `/`, `/products/[slug]`, `/vendors/[slug]`, `/wishlist`; run `npm run build` to confirm zero errors

---

## Dependencies & Execution Order

```
Phase 1 (Setup)
  └─→ Phase 2 (Types & Data Layer) ← BLOCKS ALL BELOW
        ├─→ Phase 3 (Seed Data) [P with Phase 4]
        ├─→ Phase 4 (Shared UI)  [P with Phase 3]
        │     └─→ Phase 5 (US1: Browse)
        │           └─→ Phase 6 (US2: Search/Filter)
        │           └─→ Phase 7 (US3: Vendor Storefront)
        │           └─→ Phase 8 (US4: PDP)
        │                 └─→ Phase 9 (US5: Reviews)
        │                 └─→ Phase 10 (US6: Wishlist)
        └─→ Phase 11 (Polish) ← After all stories done
```

### Parallel Opportunities

- T006 + T007 (Navbar + Footer) — different files, run together
- T014–T018 (vendor files) — all independent
- T019–T038 (product files) — all independent
- T039–T048 (review files) — all independent
- T049–T052 (shared UI atoms) — all independent
- T060 + T061 (ReviewCard + ReviewList) — different files

---

## Notes

- `[P]` = operates on different files; launch together
- All `"use client"` components: `ProductFilter`, `WishlistButton`, `ReviewForm`, `ReviewList` (merged), `app/wishlist/page.tsx`
- All other components and pages are React Server Components (no `"use client"`)
- Commit after each phase checkpoint
- Run `npx tsc --noEmit` at each phase checkpoint — zero tolerance for type errors
