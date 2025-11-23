# Copilot Instructions for `dropship`

Guidelines for AI coding agents working in this Next.js 16 + TypeScript Christmas dropshipping storefront with a small Prisma-backed admin.

## Architecture & Key Files

- **Framework**: Next.js 16 App Router, TypeScript, Tailwind 4, Prisma + Postgres.
- **Public marketing shell**:
  - `src/app/layout.tsx`: Global app layout + region-aware `<html lang>`/metadata.
  - `src/components/Layout.tsx`: Visual shell (dark festive background, nav, footer) used by marketing pages.
  - Marketing/SEO pages live under `src/app/**/page.tsx` (e.g. `gifts-for-age-8`, `christmas-hampers`, `3-for-bundle`).
- **Admin & CMS**:
  - `src/app/admin/layout.tsx`: Card-style admin wrapper labelled “Basic CMS (preview)”.
  - `src/app/admin/products/page.tsx`: Product management UI (talks to `/api/products`).
  - `src/app/admin/assets`, `src/app/admin/groups`, `src/app/admin/cj-raw`: Admin views for assets, bundles and raw CJ data.
- **API routes & backend**:
  - `src/app/api/products/route.ts`: JSON API for CRUD-like product operations (POST/PATCH with numeric coercion helpers `toDecimal`/`toInt`).
  - Other API folders under `src/app/api/**` handle assets, categories, auth, shipping, tracking and uploads following the same pattern.
  - `src/lib/db.ts`: Singleton `PrismaClient` instance shared across server code.
- **Domain libraries**:
  - `src/lib/catalog.ts`: Region-aware product catalog loader that prefers DB (`prisma.product`) and falls back to `BASE_PRODUCTS` from `src/content/products.ts`.
  - `src/lib/assets.ts`: Merges editable DB-backed assets with `defaultAssets` from `src/content/assets.ts` via `getAssets()`.
  - `src/lib/seo.ts`: SEO helpers and region-specific metadata/JSON-LD.
  - `src/lib/suppliers.ts`: Types and config for AliExpress/CJdropshipping.
  - `src/lib/routes.ts`: `PUBLIC_ROUTES` array listing all non-auth marketing pages.

## Region & SEO Patterns

- **Region source of truth**:
  - `src/content/regions.ts` exports `REGIONS`, `Region` and `getCurrentRegion()` which reads `NEXT_PUBLIC_REGION` (`"uk"` or `"us"`).
  - When adding region-aware logic, use `const region = getCurrentRegion(); const isUK = region.id === "uk";` instead of reading env vars directly.
- **Copy & currency**:
  - Use `isUK` to branch copy and currency-sensitive details: `£` vs `$`, UK vs US wording, `.co.uk` vs `.com` phrasing.
  - Keep UK/US variants close together in the same component, mirroring patterns in `src/app/3-for-bundle/page.tsx` and age-based gift pages.
- **Metadata & JSON-LD**:
  - Many content pages define `export async function generateMetadata()` using helpers from `src/lib/seo.ts`.
  - JSON-LD is included with a `<script type="application/ld+json">` tag using `dangerouslySetInnerHTML` and choosing between UK/US schemas based on `isUK`.
  - New SEO-heavy pages should copy this structure from an existing age-based gifts page or the `3-for-bundle` page.

## Page & Component Conventions

- **Layout usage**:
  - Public marketing pages wrap their main section in `Layout` from `src/components/Layout.tsx`.
  - Admin pages use `src/app/admin/layout.tsx` for a bordered card shell; don’t reuse the public `Layout` there.
- **Styling**:
  - Use Tailwind 4 utilities in a dark festive palette: `bg-black/85`, `border-[#D9A441]/60`, text colours like `#FFF9F2` and `#E5E7EB`.
  - New sections should usually be rounded cards with subtle shadows, matching `3-for-bundle` and age-based gift pages.
- **Routing & links**:
  - Use `next/link` for internal navigation; keep kebab-case directories under `src/app` (e.g. `/gifts-for-mum`, `/stocking-fillers`).
  - If you add a new public page that should be treated as non-auth, also add its path to `PUBLIC_ROUTES` in `src/lib/routes.ts`.

## Data, Catalog & Suppliers

- **Prisma schema** (`prisma/schema.prisma`):
  - Models for `User`/auth, `Asset`, `Category`, `Product`, `ProductGroup` (+ `ProductGroupItem` and `ProductGroupRule`) and raw CJ/AliExpress tables.
  - `Product` includes region flags (`showInUk`, `showInUs`), pricing/stock, supplier fields (`supplier`, `externalId`, `warehouse*`) and `tags`.
- **Catalog flow**:
  - UI components/pages should fetch region-filtered products via helpers like `getProductsForRegion(region)` in `src/lib/catalog.ts` instead of querying Prisma directly.
  - `getProductsForRegion` first checks the DB; if empty (e.g. fresh install), it falls back to `BASE_PRODUCTS` from `src/content/products.ts`.
- **Assets & uploads**:
  - Default asset paths live in `src/content/assets.ts`; overrides are stored in the `Asset` table.
  - Always read via `getAssets()` from `src/lib/assets.ts` so DB overrides and defaults are merged.
- **Suppliers & raw data**:
  - `src/lib/suppliers.ts` and the `RawCjProduct`/`RawAeProduct` models are the hooks for future sync; don’t hardcode supplier URLs in components.

## API & Admin Patterns

- **API design**:
  - Use typed JSON payloads and simple helpers like `toDecimal`/`toInt` (see `src/app/api/products/route.ts`) to coerce form data into numbers.
  - Return `NextResponse.json` with clear error messages and appropriate HTTP status codes (`400` for validation, `500` for unexpected errors).
- **Admin UIs**:
  - Admin pages generally call the corresponding `/api/*` route with `fetch` and render simple forms/tables in the admin layout card.
  - Keep business rules (slugging, numeric parsing, tag splitting) on the server side inside `route.ts`, not duplicated in React components.

## Dev Workflow

- **Install & run** (Windows PowerShell):
  ```powershell
  cd C:\dropship
  npm install
  npm run dev
  ```
- **Region during dev**:
  ```powershell
  $env:NEXT_PUBLIC_REGION="us"; npm run dev
  # or
  $env:NEXT_PUBLIC_REGION="uk"; npm run dev
  ```
- **Build & lint**:
  - Build: `npm run build`
  - Lint: `npm run lint`

## How Agents Should Work Here

- Prefer reusing patterns from existing pages/components (especially other gift/category pages and admin sections) instead of inventing new structures.
- For new marketing pages, mirror structure, styling, SEO and region handling from the closest existing page.
- For new admin or API features, drive all persistence through Prisma models and `src/lib` helpers rather than ad-hoc queries.
- Keep region-specific behaviour confined to `getCurrentRegion`-based branching and `showInUk`/`showInUs` flags.
- Avoid introducing new backend services; extend the existing Next.js API + Prisma layer unless the repository is explicitly evolving in that direction.
