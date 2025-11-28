# Copilot Instructions for `dropship`

Guidelines for AI coding agents working in this Next.js 16 + TypeScript Christmas dropshipping storefront with a Prisma-backed admin and supplier import scripts.

## Architecture & Key Files

- **Framework**: Next.js 16 App Router, TypeScript, Tailwind 4, Prisma + Postgres.
- **Public marketing shell**:
  - `src/app/layout.tsx`: Global app layout + region-aware `<html lang>`/metadata.
  - `src/components/Layout.tsx`: Visual shell (dark festive background, nav, footer) used by marketing pages.
  - Marketing/SEO pages live under `src/app/**/page.tsx` (e.g. `gifts-for-age-8`, `christmas-hampers`, `3-for-bundle`).
- **Admin & CMS**:
  - `src/app/admin/layout.tsx`: Card-style admin wrapper labelled “Basic CMS (preview)”.
  - `src/app/admin/products/page.tsx`: Product management UI talking to `/api/products`, `/api/categories` and `/api/upload`.
  - `src/app/admin/assets/page.tsx`: Asset editor backed by `Asset` table + `getAssets()`.
  - `src/app/admin/groups/page.tsx`: Read-only view over bundle/product groups via `/api/admin/groups`.
  - `src/app/admin/cj-raw/page.tsx` + `src/app/admin/cj-raw/promote/route.ts`: Explore/promote raw CJ rows into first-class `Product`s.
- **API routes & backend**:
  - `src/app/api/products/route.ts`: JSON API for CRUD-like product operations (POST/PATCH with numeric coercion helpers like `toDecimal`/`toInt`).
  - Other API folders under `src/app/api/**` handle assets, categories, auth, tracking and uploads following the same pattern.
  - `src/app/api/admin/groups/route.ts`: Admin-only JSON API around `ProductGroup` + `ProductGroupRule` + `ProductGroupItem`.
  - `src/lib/db.ts`: Singleton `PrismaClient` instance shared across server code.
- **Domain libraries**:
  - `src/lib/catalog.ts`: Region-aware product catalog loader that prefers DB (`prisma.product`) and falls back to `BASE_PRODUCTS` from `src/content/products.ts` on empty DB or Prisma error.
  - `src/lib/assets.ts`: Merges editable DB-backed assets with `defaultAssets` from `src/content/assets.ts` via cached `getAssets()`.
  - `src/lib/seo.ts`: SEO helpers and region-specific metadata/JSON-LD patterns.
  - `src/lib/suppliers.ts`: Types and config for AliExpress/CJdropshipping.
  - `src/lib/importers/cj.ts`, `src/lib/importers/aliexpress.ts`: Map external feed rows into internal product-ish shapes.
  - `src/lib/routes.ts`: `PUBLIC_ROUTES` array listing all non-auth marketing pages.

## Region & SEO Patterns

- **Region source of truth**:
  - `src/content/regions.ts` exports `REGIONS`, a `Region` type and helpers for resolving `
