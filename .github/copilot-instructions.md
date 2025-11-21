# Copilot Instructions for `dropship`

These guidelines help AI coding agents work effectively in this Next.js 16 + TypeScript Christmas dropshipping storefront.

## Architecture & Key Files

- **Framework**: Next.js 16 App Router with TypeScript and Tailwind 4.
- **Entry & layout**:
  - `src/app/layout.tsx`: Global app layout + region-aware `<html lang>` and metadata.
  - `src/components/Layout.tsx`: Visual shell (background, header bar, nav, footer) used by most pages.
- **Home & marketing pages**:
  - `src/app/page.tsx`: Main Christmas landing page (hero, countdown, trust section, category links).
  - Category/landing pages live under `src/app/**/page.tsx` (e.g. `gifts-for-age-8`, `christmas-hampers`, `deals`, `reviews`, `3-for-bundle`).
- **Content & configuration**:
  - `src/content/regions.ts`: Region config (UK/US) with IDs, currencies, site names; central source for `getCurrentRegion()`.
  - `src/content/categories.ts`: Gift categories and URLs.
  - `src/content/products.ts`: Mock product data annotated with supplier info.
  - `src/lib/seo.ts` / `src/lib/seo.tsx`: SEO helpers and region-specific metadata/JSON-LD.
  - `src/lib/suppliers.ts`: Types and config for AliExpress/CJdropshipping.
- **UI components**:
  - `src/components/ProductCard.tsx`: Reusable product card for product grids.
  - `src/components/ChristmasCountdown.tsx`: Animated countdown used on the homepage.
  - `src/components/TrustBadges.tsx`: Payment and trust signals.
  - `src/components/HeroCarousel.tsx`, `src/components/Snowfall.tsx`: Visual/animated homepage accents.

## Region & SEO Patterns

- **Region selection**:
  - Region is determined via `getCurrentRegion()` from `src/content/regions.ts`, which reads `NEXT_PUBLIC_REGION` (`"uk"` or `"us"`).
  - When adding new pages or components that differ by country, prefer `const region = getCurrentRegion(); const isUK = region.id === "uk";` rather than reading env vars directly.
- **Copy & currency**:
  - Use `isUK` to branch copy, currency and locale-sensitive details: `£` vs `$`, `UK` vs `USA`, `.co.uk` vs `.com` style wording.
  - Keep region-specific strings close together and follow existing phrasing in pages like `src/app/3-for-bundle/page.tsx` or age-based gift pages.
- **Metadata & JSON-LD**:
  - Many pages export `generateMetadata(): Metadata` that pulls from `seoUK`/`seoUS` in `src/lib/seo.ts` and includes Open Graph & Twitter data.
  - Content pages that render JSON-LD use:
    ```tsx
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(isUK ? seoUK.jsonLd : seoUS.jsonLd) }}
    />
    ```
  - When creating new SEO-heavy pages, mirror the `generateMetadata` + JSON-LD pattern from existing `gifts-for-age-*` or `3-for-bundle` pages.

## Page & Component Conventions

- **Layout usage**:
  - All marketing/content pages should wrap their main section in `Layout` from `src/components/Layout.tsx`:
    ```tsx
    export default function SomePage() {
      const region = getCurrentRegion();
      const isUK = region.id === "uk";

      return (
        <Layout>
          {/* page content */}
        </Layout>
      );
    }
    ```
- **Styling**:
  - Tailwind 4 utility classes with a **dark festive theme**: `bg-black/85`, `border-[#D9A441]/60`, text colours like `#FFF9F2` and `#E5E7EB`.
  - New sections should typically be rounded cards with borders and shadows, as in `3-for-bundle` and age-based gift pages.
- **Routing & links**:
  - Use `next/link` for internal navigation and match existing URL patterns (`/gifts-for-age-8`, `/gifts-for-mum`, `/stocking-fillers`, etc.).
  - When adding new routes, keep kebab-case directory names under `src/app`.

## Data & Suppliers

- **Products**:
  - Product definitions live in `src/content/products.ts` and reference suppliers through typed metadata.
  - When adding real products, extend existing types instead of inlining supplier URLs in components.
- **Suppliers**:
  - Use `SupplierKey` and `SUPPLIERS` from `src/lib/suppliers.ts` for any logic that needs supplier-specific labels or links.

## Dev Workflow

- **Install & run** (Windows PowerShell, from README):
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

- Prefer reusing existing patterns from similar pages/components instead of inventing new structures.
- When creating a new page, pick the closest existing page (e.g. another age/relationship/category page) and mirror its structure, metadata, and styling.
- Keep region-specific behaviour confined to `getCurrentRegion`-based branching rather than adding new global flags.
- Avoid introducing backend/API logic; this project is currently a static marketing/storefront with mock data.
