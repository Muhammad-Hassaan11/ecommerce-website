# MarketHub E-Commerce Constitution
<!-- Multi-vendor B2C ecommerce MVP — Next.js + Markdown data layer -->

## Core Principles

### I. Markdown-First Data Layer (NON-NEGOTIABLE)
All application data (products, vendors, reviews, wishlist state) MUST be stored as Markdown files with YAML frontmatter.
No database (SQL, NoSQL, Firebase, Supabase, etc.) may be introduced at any stage of the MVP.
Data access MUST go through a unified `lib/data/` reader layer that parses `.md` files at build/request time.
Adding a database requires a new ADR and explicit user approval.

### II. Next.js App Router — Server-First Rendering
All pages MUST use the Next.js App Router (`app/` directory).
Prefer React Server Components (RSC) for data-fetching pages; only add `"use client"` when interactivity strictly requires it.
Static generation (SSG) via `generateStaticParams` is the default for product/vendor pages.
API routes (`app/api/`) are allowed only for write operations (e.g., posting a review, toggling wishlist via localStorage sync).

### III. Component Isolation & Reusability
Every UI element MUST live in `components/` and be independently renderable in isolation.
No business logic inside page files — pages only compose components.
Shared types/interfaces MUST be defined in `types/` and imported, never duplicated.

### IV. Markdown Schema Integrity
Every Markdown file MUST conform to its declared schema (see `specs/ecommerce-mvp/spec.md` → Key Entities).
New fields require a schema change documented in the spec before implementation.
Missing or malformed frontmatter MUST surface as a clear error, not a silent failure.

### V. Simplicity & YAGNI
MVP scope is strictly: Product Listing, Search/Filter, Multi-Vendor pages, Wishlist (localStorage), Reviews & Ratings.
Payment, checkout, cart, authentication, and admin dashboard are OUT OF SCOPE for this MVP.
Do not add complexity not directly serving a defined user story. Every abstraction must be justified.

### VI. Design Excellence (NON-NEGOTIABLE)
The UI MUST be premium, modern, and visually stunning — not a basic/plain design.
Use a curated dark-mode-first color palette, smooth animations, glassmorphism accents, and micro-interactions.
Typography must use a Google Font (Inter or Outfit preferred).
Every interactive element must have hover/focus states.

## Technology Constraints

| Concern | Decision |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS Modules (no Tailwind, no CSS-in-JS) |
| Data Layer | Markdown files + gray-matter parser |
| State (client) | React `useState` / `useEffect` + `localStorage` for wishlist |
| Images | `next/image` with static assets in `public/` |
| Icons | Lucide React |
| Testing | None required for MVP (add as follow-up) |
| Deployment | Vercel-ready (no server needed — static/ISR) |

## Development Workflow

1. **Spec first** — No feature is built without a spec entry.
2. **Data schema first** — Define the Markdown frontmatter shape before writing components.
3. **Seed data** — All mock `.md` files live in `data/products/`, `data/vendors/`, `data/reviews/`.
4. **Component → Page** — Build atomic components, then assemble into pages.
5. **PHR after every significant session** — Record prompt history per CLAUDE.md rules.

## Governance

This Constitution supersedes all other practices. Any deviation requires explicit user approval and a new ADR.
All features must reference a User Story from `specs/ecommerce-mvp/spec.md`.
Complexity must be justified in writing.

**Version**: 1.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-06
