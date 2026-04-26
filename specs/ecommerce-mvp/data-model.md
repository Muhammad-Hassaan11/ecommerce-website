# Data Model: E-Commerce MVP — MarketHub

**Branch**: `001-ecommerce-mvp` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)

This document is the authoritative reference for all Markdown frontmatter schemas used in MarketHub. Every `.md` file in `data/` MUST conform to its schema below.

---

## Entity: Product

**File location**: `data/products/[slug].md`  
**Parsed by**: `lib/data/products.ts` → `getAllProducts()`, `getProductBySlug()`  
**TypeScript type**: `Product` in `types/index.ts`

### Frontmatter Schema

```yaml
---
slug: string          # REQUIRED. Unique, URL-safe kebab-case. Must match filename.
name: string          # REQUIRED. Display name shown on cards and PDP.
price: number         # REQUIRED. Decimal, in USD. E.g. 129.99
category: string      # REQUIRED. Single category. E.g. "Electronics"
images:               # REQUIRED. Array, min 1 item. Paths relative to /public/.
  - string
vendorSlug: string    # REQUIRED. Must match a slug in data/vendors/. Unmatched → "Unknown Vendor".
tags:                 # OPTIONAL. Default []. Free-form tags for future filter use.
  - string
inStock: boolean      # REQUIRED. true or false.
createdAt: string     # REQUIRED. ISO 8601 date. E.g. "2026-01-15"
---
Markdown body = full product description (shown on PDP below the fold).
```

### Validation Rules (enforced by reader)

| Field | Rule | On Violation |
|---|---|---|
| `slug` | Must match filename (without `.md`) | `console.warn` + skip product |
| `name` | Non-empty string | `console.warn` + skip product |
| `price` | Positive number | `console.warn` + skip product |
| `category` | Non-empty string | `console.warn` + skip product |
| `images` | Array with ≥ 1 string item | `console.warn` + skip product |
| `vendorSlug` | Non-empty string | `console.warn` + render "Unknown Vendor" (do not skip) |
| `inStock` | Boolean | `console.warn` + default to `false` |
| `createdAt` | Parseable date string | `console.warn` + default to today |

### Seed Products (20 planned)

| Slug | Name | Category | vendorSlug |
|---|---|---|---|
| `wireless-headphones` | Wireless Headphones Pro | Electronics | `techwave` |
| `running-shoes-pro` | Running Shoes Pro | Footwear | `sportsgear` |
| `yoga-mat-premium` | Premium Yoga Mat | Fitness | `fitlife` |
| `mechanical-keyboard` | Mechanical Keyboard RGB | Electronics | `techwave` |
| `leather-wallet` | Slim Leather Wallet | Accessories | `urbancraft` |
| `protein-shaker` | Protein Shaker Bottle | Fitness | `fitlife` |
| `sunglasses-uv400` | UV400 Polarized Sunglasses | Accessories | `urbancraft` |
| `smartwatch-fitness` | Fitness Smartwatch X | Electronics | `techwave` |
| `trail-running-vest` | Trail Running Vest | Footwear | `sportsgear` |
| `cotton-tshirt-pack` | Premium Cotton T-Shirt 3-Pack | Clothing | `apparel-co` |
| `foam-roller` | High-Density Foam Roller | Fitness | `fitlife` |
| `wireless-charger` | Wireless Charging Pad 15W | Electronics | `techwave` |
| `ceramic-water-bottle` | Ceramic-Coated Water Bottle | Accessories | `urbancraft` |
| `compression-socks` | Compression Running Socks | Footwear | `sportsgear` |
| `backpack-30l` | Urban Commuter Backpack 30L | Accessories | `urbancraft` |
| `resistance-bands-set` | Resistance Bands Set (5-pack) | Fitness | `fitlife` |
| `laptop-stand-aluminum` | Adjustable Aluminum Laptop Stand | Electronics | `techwave` |
| `hooded-sweatshirt` | Heavyweight Hooded Sweatshirt | Clothing | `apparel-co` |
| `trail-shoes` | All-Terrain Trail Shoes | Footwear | `sportsgear` |
| `portable-blender` | USB Portable Blender | Fitness | `fitlife` |

---

## Entity: Vendor

**File location**: `data/vendors/[slug].md`  
**Parsed by**: `lib/data/vendors.ts` → `getAllVendors()`, `getVendorBySlug()`  
**TypeScript type**: `Vendor` in `types/index.ts`

### Frontmatter Schema

```yaml
---
slug: string          # REQUIRED. Unique, URL-safe kebab-case. Must match filename.
name: string          # REQUIRED. Display name shown on badges and storefront.
bannerImage: string   # REQUIRED. Path relative to /public/. E.g. "/images/vendors/techwave-banner.jpg"
logoImage: string     # REQUIRED. Path relative to /public/. E.g. "/images/vendors/techwave-logo.png"
location: string      # REQUIRED. Human-readable city/country.
joinedAt: string      # REQUIRED. ISO 8601 date. E.g. "2025-06-01"
rating: number        # REQUIRED. Pre-computed aggregate, 1.0–5.0. Updated manually per seed.
---
Markdown body = vendor description / bio (shown on storefront page).
```

### Seed Vendors (5)

| Slug | Name | Location | Category focus |
|---|---|---|---|
| `techwave` | TechWave Store | San Francisco, CA | Electronics |
| `sportsgear` | SportsGear Co. | Portland, OR | Footwear & Sports |
| `fitlife` | FitLife Supplies | Austin, TX | Fitness & Wellness |
| `urbancraft` | UrbanCraft | New York, NY | Accessories & Lifestyle |
| `apparel-co` | Apparel Co. | Los Angeles, CA | Clothing |

---

## Entity: Review

**File location**: `data/reviews/[product-slug].md`  
**Parsed by**: `lib/data/reviews.ts` → `getSeedReviewsByProductSlug()`  
**TypeScript type**: `Review` in `types/index.ts`

### Frontmatter Schema

```yaml
---
reviews:
  - reviewerName: string   # REQUIRED. Display name.
    rating: number         # REQUIRED. Integer 1–5. Clamped if outside range.
    comment: string        # REQUIRED. Review text.
    createdAt: string      # REQUIRED. ISO 8601 date.
---
# (No Markdown body used for this entity)
```

> **Note**: Each `data/reviews/[slug].md` file contains ALL seed reviews for that product. One file per product.

### Validation Rules

| Field | Rule | On Violation |
|---|---|---|
| `rating` | Integer 1–5 | `console.warn` + clamp to [1, 5] |
| `reviewerName` | Non-empty string | `console.warn` + default to "Anonymous" |
| `comment` | Non-empty string | `console.warn` + default to "(no comment)" |
| `createdAt` | Parseable date | `console.warn` + default to today |

---

## Entity: Wishlist (client-only)

**Storage**: `localStorage["mh_wishlist"]`  
**Managed by**: `lib/utils/wishlist.ts`  
**TypeScript shape**: `string[]` (array of product slugs)

```typescript
// Example localStorage value:
// localStorage["mh_wishlist"] = '["wireless-headphones","smartwatch-fitness"]'
```

---

## Entity: Client Review (client-only)

**Storage**: `localStorage["mh_reviews_[product-slug]"]` (one key per product)  
**Managed by**: `ReviewForm` component  
**TypeScript shape**: `Review[]` (same interface; `source: 'local'`)

```typescript
// Example localStorage value:
// localStorage["mh_reviews_wireless-headphones"] = '[{"reviewerName":"Jane","rating":4,...,"source":"local"}]'
```

---

## Field Naming Convention

- All slug fields: `kebab-case` (lowercase, hyphens)
- All date fields: ISO 8601 string `"YYYY-MM-DD"`
- All image paths: relative to `/public/`, starting with `/images/`
- Boolean fields: lowercase `true` / `false` in YAML

---

## Schema Change Log

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-06 | Initial schema definition for Product, Vendor, Review, Wishlist, ClientReview |
