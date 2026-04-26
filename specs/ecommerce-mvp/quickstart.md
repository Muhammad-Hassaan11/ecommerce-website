# Quickstart: E-Commerce MVP — MarketHub

**Branch**: `001-ecommerce-mvp` | **Date**: 2026-04-06  
**Prerequisites**: Node.js 20+, npm 10+, Git

This guide gets you from zero to a running local MarketHub instance in under 5 minutes.

---

## 1. Prerequisites Check

```powershell
node --version    # Must be >= 20.x
npm --version     # Must be >= 10.x
git --version
```

---

## 2. Project Initialization

> **If the Next.js project does not exist yet**, run this from the workspace root:

```powershell
# From: c:\Users\thisf\Desktop\ecommerce application\
npx create-next-app@latest . `
  --typescript `
  --app `
  --no-tailwind `
  --no-src-dir `
  --import-alias "@/*" `
  --eslint
```

> **If the project already exists**, skip to step 3.

---

## 3. Install Dependencies

```powershell
npm install gray-matter lucide-react
```

### Dependency Purpose

| Package | Version | Purpose |
|---|---|---|
| `gray-matter` | `^4.0.3` | Parse YAML frontmatter from `.md` files |
| `lucide-react` | `latest` | Icon set (heart, star, search, filter icons) |
| `next` | `^14.x` | Framework (included by create-next-app) |
| `typescript` | `^5.x` | Type safety (included by create-next-app) |

---

## 4. Verify Project Structure

After init, your workspace should look like:

```text
ecommerce application/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts (or .js)
└── specs/ecommerce-mvp/     ← already exists
```

---

## 5. Create Required Directories

```powershell
# From workspace root
New-Item -ItemType Directory -Force -Path "data/products"
New-Item -ItemType Directory -Force -Path "data/vendors"
New-Item -ItemType Directory -Force -Path "data/reviews"
New-Item -ItemType Directory -Force -Path "public/images/products"
New-Item -ItemType Directory -Force -Path "public/images/vendors"
New-Item -ItemType Directory -Force -Path "components/layout"
New-Item -ItemType Directory -Force -Path "components/product"
New-Item -ItemType Directory -Force -Path "components/vendor"
New-Item -ItemType Directory -Force -Path "components/review"
New-Item -ItemType Directory -Force -Path "components/wishlist"
New-Item -ItemType Directory -Force -Path "components/ui"
New-Item -ItemType Directory -Force -Path "lib/data"
New-Item -ItemType Directory -Force -Path "lib/utils"
New-Item -ItemType Directory -Force -Path "types"
```

---

## 6. Start the Dev Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Expected on first run**: Next.js default homepage (before implementation). This is correct.

---

## 7. Validate gray-matter Integration

Create a quick smoke test to confirm `gray-matter` parses your Markdown files correctly:

```powershell
# Run from workspace root
node -e "
const matter = require('gray-matter');
const fs = require('fs');
const files = fs.readdirSync('./data/products');
console.log('Products found:', files.length);
files.forEach(f => {
  const { data } = matter(fs.readFileSync('./data/products/' + f, 'utf8'));
  console.log(' -', data.slug, '|', data.name, '| price:', data.price);
});
"
```

> **Expected**: Prints a list of all product slugs and names without errors.

---

## 8. TypeScript Configuration

Ensure `tsconfig.json` has at minimum:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 9. Seed Data Validation Checklist

Before starting Phase 4 (UI components), confirm all seed data is in place:

- [ ] `data/vendors/` contains exactly **5** `.md` files
- [ ] `data/products/` contains exactly **20** `.md` files
- [ ] `data/reviews/` contains review files for at least **10** products
- [ ] All product files have a `vendorSlug` that matches a file in `data/vendors/`
- [ ] All images referenced in frontmatter exist under `public/images/`
- [ ] Running `npm run build` completes without TypeScript errors

---

## 10. Production Build (Vercel)

```powershell
npm run build
```

Check the build output for:
- ✅ All product routes: `○ /products/[slug]` (static)
- ✅ All vendor routes: `○ /vendors/[slug]` (static)
- ✅ Homepage: `○ /` (static)
- ✅ Wishlist: `○ /wishlist` (static)

### Deploy to Vercel

```powershell
# Install Vercel CLI once
npm install -g vercel

# Deploy from project root
vercel --prod
```

No environment variables required for MVP.

---

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| `Cannot find module 'gray-matter'` | Dependency not installed | `npm install gray-matter` |
| `Error: ENOENT data/products/` | Directory not created | Run step 5 |
| `Image not displaying` | Path not in `public/` | Move image to `public/images/` |
| `Type error: Property X does not exist` | Missing field in type | Update `types/index.ts` |
| `localStorage is not defined` | SSR context | Wrap in `useEffect` or check `typeof window !== 'undefined'` |
| `Wishlist not persisting` | Private/incognito mode | Expected — app degrades gracefully with toast |

---

## Useful Commands

```powershell
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build (validates all SSG pages)
npm run lint         # Run ESLint
npx tsc --noEmit    # Type-check without building
```
