# Feature Specification: E-Commerce MVP — MarketHub

**Feature Branch**: `001-ecommerce-mvp`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "physical products, b2c, multi-vendor, product listing & search/filter, wishlist, reviews, ratings, data stored on markdown files, no database integration"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse & Discover Products (Priority: P1)

A visitor lands on MarketHub and immediately sees a rich product grid. They can scroll through products, see prices, vendor names, star ratings, and attractive product cards. This is the core entry point of the entire platform.

**Why this priority**: Without product discovery, nothing else functions. This is the foundation every other story builds upon.

**Independent Test**: Can be validated by loading the homepage and confirming a grid of at least 6 products renders with name, image, price, vendor, and rating visible.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage, **When** the page loads, **Then** they see a grid of all available products from all vendors with name, image, price, rating, and vendor badge.
2. **Given** products exist in Markdown files, **When** the data layer reads them, **Then** all valid `.md` files in `data/products/` are rendered — no product is silently dropped.
3. **Given** a product card is hovered, **When** the cursor enters the card, **Then** a smooth lift/shadow animation plays.

---

### User Story 2 — Search & Filter Products (Priority: P2)

A shopper knows what they're looking for. They type into the search bar to find specific products, or use filters (category, price range, vendor, minimum rating) to narrow down the grid in real time.

**Why this priority**: Search/filter is the primary navigation tool for a multi-vendor marketplace with many SKUs.

**Independent Test**: Can be tested by searching for an existing product name and confirming the grid updates to show only matching results.

**Acceptance Scenarios**:

1. **Given** the product grid is displayed, **When** a user types a keyword in the search bar, **Then** the grid filters client-side in real time to show only matching products (name or description match, case-insensitive).
2. **Given** filter controls are visible, **When** a user selects a category, **Then** only products in that category are shown.
3. **Given** filter controls are visible, **When** a user sets a min/max price range, **Then** only products within the range are shown.
4. **Given** filter controls are visible, **When** a user picks a minimum star rating, **Then** only products meeting or exceeding that rating are shown.
5. **Given** a user applies multiple filters simultaneously, **When** all filters are active, **Then** the grid shows the intersection (AND logic) of all applied filters.
6. **Given** no products match the current filters, **When** the grid would be empty, **Then** a "No products found. Try adjusting your filters." message is displayed.

---

### User Story 3 — View Vendor Storefront (Priority: P3)

A shopper clicks on a vendor name/badge and lands on that vendor's dedicated storefront page. They see the vendor's banner, bio, all their listed products, and aggregate rating.

**Why this priority**: Multi-vendor differentiation is a key MVP pillar — buyers should be able to trust and explore specific vendors.

**Independent Test**: Can be tested by clicking a vendor badge and confirming the storefront page loads with that vendor's name, bio, and products-only grid.

**Acceptance Scenarios**:

1. **Given** a product card shows a vendor badge, **When** the badge is clicked, **Then** the user navigates to `/vendors/[vendorSlug]`.
2. **Given** a vendor page loads, **When** the page renders, **Then** it displays vendor name, description, banner image, and a grid of only their products.
3. **Given** vendor data is stored in `data/vendors/[slug].md`, **When** the page is rendered at build time, **Then** static generation is used (`generateStaticParams`).

---

### User Story 4 — Product Detail Page (Priority: P4)

A shopper clicks on a product card to view its full detail page: larger images, full description, specs, vendor info, all reviews, and the average star rating.

**Why this priority**: The PDP is the conversion page — it is where a buyer decides to trust the product. Without it, reviews/ratings have no natural home.

**Independent Test**: Can be tested by clicking a product card and confirming a dedicated URL (`/products/[slug]`) loads with full product info and the review section.

**Acceptance Scenarios**:

1. **Given** a product card is clicked, **When** the user navigates to the PDP, **Then** the URL is `/products/[slug]` and full product details render.
2. **Given** the PDP loads, **When** reviews exist for this product, **Then** all reviews are displayed with reviewer name, star rating, date, and comment.
3. **Given** reviews exist, **When** the PDP loads, **Then** an aggregate average star rating and total review count are shown prominently.
4. **Given** no reviews exist for a product, **When** the PDP loads, **Then** "Be the first to review this product!" is displayed instead.

---

### User Story 5 — Submit a Review & Rating (Priority: P5)

A user on the Product Detail Page fills in their name, picks a star rating (1–5), writes a comment, and submits. The review appears appended to the product review section.

**Why this priority**: Reviews are a trust signal for a marketplace — but since there is no auth or DB, MVP implementation uses localStorage for client-side persistence.

**Independent Test**: Can be tested by submitting the review form and confirming the review appears in the list without a page reload.

**Acceptance Scenarios**:

1. **Given** the PDP review section is visible, **When** a user fills in name, rating, and comment and clicks "Submit Review", **Then** the new review appears at the top of the review list (optimistic UI update).
2. **Given** the review form is submitted, **When** it is empty or missing required fields, **Then** inline validation errors appear and the form does not submit.
3. **Given** a star rating widget is shown, **When** the user hovers over stars, **Then** they highlight interactively before selection.

> **MVP Note**: Reviews submitted client-side are persisted to `localStorage` per product slug and merged with seed `.md` reviews on load. A follow-up ADR should address server-side write-back.

---

### User Story 6 — Wishlist (Priority: P6)

A shopper clicks a heart icon on any product card or PDP to save it to their wishlist. A dedicated Wishlist page shows all saved products with a remove option.

**Why this priority**: Wishlist is a high-engagement feature for B2C, enabling deferred purchase intent. Simple `localStorage` implementation keeps it zero-backend.

**Independent Test**: Can be tested by clicking the heart icon on two products, navigating to `/wishlist`, and confirming both appear.

**Acceptance Scenarios**:

1. **Given** a product card or PDP shows a heart icon, **When** clicked, **Then** the product is added to `localStorage` wishlist and the heart icon fills/animates.
2. **Given** the product is already wishlisted, **When** the heart is clicked again, **Then** the product is removed (toggle behavior) and the icon empties.
3. **Given** at least one wishlisted product, **When** the user navigates to `/wishlist`, **Then** all wishlisted products render as cards.
4. **Given** the wishlist page is shown, **When** the user clicks "Remove" on a product, **Then** it is removed from `localStorage` and disappears from the page.
5. **Given** no products are wishlisted, **When** the user navigates to `/wishlist`, **Then** an empty-state illustration and "Your wishlist is empty" message are shown.

---

### Edge Cases

- What happens when a `.md` product file has missing frontmatter fields? Surface a console warning; skip the product from the grid (do not crash).
- What happens when `localStorage` is full or unavailable (private browsing)? Wishlist silently degrades; show a toast: "Wishlist unavailable in this browser mode."
- What happens when the search term matches zero products? Show empty state message; do not show an error.
- What happens if a vendor slug in a product file does not match any vendor file? Show "Unknown Vendor" as the badge text; do not throw.
- What happens if a review star rating is outside 1–5? Clamp to 1–5; log a warning.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read all product data from Markdown files in `data/products/*.md` using gray-matter.
- **FR-002**: System MUST read all vendor data from `data/vendors/*.md` using gray-matter.
- **FR-003**: System MUST read seed reviews from `data/reviews/[product-slug].md` using gray-matter.
- **FR-004**: System MUST display a product grid on the homepage with name, image, price, category, rating, and vendor.
- **FR-005**: System MUST support real-time client-side search by product name and description.
- **FR-006**: System MUST support filtering by category, price range (min/max), vendor, and minimum rating.
- **FR-007**: System MUST provide a Product Detail Page at `/products/[slug]` with full info + reviews.
- **FR-008**: System MUST provide a Vendor Storefront page at `/vendors/[slug]` with vendor info + their products.
- **FR-009**: System MUST support wishlist via `localStorage` — add, remove, persist across page refreshes.
- **FR-010**: System MUST provide a `/wishlist` page displaying saved products.
- **FR-011**: System MUST allow users to submit reviews (name, rating, comment) with client-side persistence via `localStorage`.
- **FR-012**: System MUST display reviews on the PDP merged from seed `.md` data and `localStorage`.
- **FR-013**: System MUST compute and display average star ratings from available review data.
- **FR-014**: System MUST be statically generated where possible (SSG/ISR) and Vercel-deployable.
- **FR-015**: System MUST NOT include any database, ORM, or backend service calls.

### Key Entities

- **Product**: `slug`, `name`, `description`, `price`, `category`, `images[]`, `vendorSlug`, `tags[]`, `inStock`, `createdAt`
- **Vendor**: `slug`, `name`, `description`, `bannerImage`, `logoImage`, `location`, `joinedAt`, `rating`
- **Review**: `productSlug`, `reviewerName`, `rating` (1–5), `comment`, `createdAt`
- **Wishlist** (client-only): `{ productSlug: string }[]` stored in `localStorage["mh_wishlist"]`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Product grid renders all `.md` products within 2 seconds on initial load (cold SSG).
- **SC-002**: Search results update within 100ms of each keystroke (client-side filtering, no network call).
- **SC-003**: Wishlisted products persist and reappear correctly after a full browser refresh.
- **SC-004**: Adding a review and refreshing the page shows the review persisted (via `localStorage` merge).
- **SC-005**: All pages pass basic accessibility checks — semantic HTML, ARIA labels on interactive elements.
- **SC-006**: The UI achieves a "premium / WOW" first impression: dark-mode design, smooth animations, polished typography.
- **SC-007**: Vendor storefront page only shows that vendor's products (no cross-contamination).
- **SC-008**: All Markdown files with correct schema load without errors; malformed files log a warning but do not crash the app.
