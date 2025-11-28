# Agent Journal for `dropship`

This file is the running log for AI agents working on this project. Keep it concise, high-signal, and focused on decisions and next steps.

**All agents _must_ update this file** at the end of meaningful work sessions so the next person (human or AI) can understand what changed and what remains.

## How to Use This File

- Update this file **after meaningful tasks** (or after ~1–2 hours of work).
- Write in **plain English**, aimed at a future agent or human picking up the work.
- Focus on:
  - What you changed or investigated
  - Why you made those choices
  - What’s still open / risky / needs review
- Keep entries short (a few bullets); link to files instead of pasting big code blocks.

## Project Snapshot (High-Level)

- **Stack**: Next.js App Router, TypeScript, Tailwind, Prisma/Postgres.
- **App structure**:
  - `src/app/layout.tsx`: Global app layout (fonts, global shell via `ClientLayout`).
  - Marketing/public pages under `src/app/**/page.tsx` (e.g. `for-her`, `gifts`, age-based routes).
  - Admin UI lives under `src/app/admin/**` with its own layout in `src/app/admin/layout.tsx`.
- **Data**:
  - `src/lib/db.ts`: Prisma client.
  - `src/lib/catalog.ts`: Product fetching with region filters + seed fallback.
  - `src/lib/assets.ts`: Assets from DB with fallback to `src/content/assets.ts`.
  - `prisma/schema.prisma`: DB schema.
- **Region/content**:
  - `src/content/regions.ts`: Region config (US/UK, currency, etc.).
  - SEO-heavy routes follow `src/app/3-for-bundle/page.tsx` pattern.

## Current State & Integrations (Short Overview)

- **Marketing site**: Live Christmas gifting experience with regionalised copy (UK/US), 3-for-bundle offer, and SEO-focused landing pages under `src/app/**`.
- **Data integrations**:
  - Prisma models in `prisma/schema.prisma` wired to Postgres for products, variants, stock, assets, and CJ raw tables.
  - Fallback flows ensure that when the DB is unavailable, the site still runs using seed products (`src/content/products.ts`) and default assets (`src/content/assets.ts`).
- **Admin tools**:
  - Basic CMS under `src/app/admin/**` for managing products, assets, and groups, backed by `/api/*` routes and Prisma.
- **Stability improvements so far**:
  - Clear separation between global layout (`src/app/layout.tsx` + `ClientLayout`) and page-level content to avoid double headers/footers.
  - Defensive DB access layers (`src/lib/catalog.ts`, `src/lib/assets.ts`) that log Prisma issues and gracefully fall back to static content.

## Project Goal & Overall Plan

- **Long-term vision**:
  - `dropship` is the **admin/back-office** for a multi-storefront gifting business.
  - Admin runs on its own `/admin` system and powers **5–10 different niche storefronts** (Christmas gifts, other seasonal/evergreen niches, etc.).
  - The admin is the single source of truth for products, pricing, assets, and supplier mappings across all storefronts.
  - Over time, it should support **3–4 suppliers** (e.g. CJ, AliExpress, plus future sources), with consistent product models and stock/variant tracking.

- **Role of the admin**:
  - Acts as a product ingestion, curation and publishing hub for all frontends.
  - Handles supplier imports (CJ, AliExpress, others), enrichment (copy, images, tags), and controls which products are live on which niche storefront.
  - Provides safe tools for updating content without breaking the live sites.

## Short-Term Roadmap (Execution Order)

1. **Launch the Christmas storefront**
  - Polish copy, SEO, layouts and category pages for the current Christmas niche.
  - Ensure region handling (UK/US) and JSON-LD are correct and production-ready.

2. **Supplier integrations**
  - Integrate **AliExpress** import flow for products (scripts + admin UI hooks).
  - Import the remaining **CJ** products into the DB and surface them via admin + storefront.

3. **Payments & checkout**
  - Integrate **Stripe** as the primary payment processor.
  - Wire the storefront checkout flow to Stripe and validate success/failure flows.

4. **Admin UI build-out**
  - Expand `/admin` into a more complete control panel:
    - Product listing, detail, editing, and status per storefront.
    - Asset management and grouping.
    - Supplier/source visibility (which product comes from where, with what IDs).

5. **Testing & launch**
  - End-to-end test: catalog, cart/checkout, region behaviour, and supplier-driven products.
  - Launch the Christmas site as the first storefront.
  - After launch, iterate on the admin panel to support new niches and additional storefronts.


## Active Goals / Big Picture

- Keep the marketing site fast, SEO-friendly, and region-aware (UK/US).
- Stabilise admin and data flows so adding/editing products & assets is safe.
- Avoid regressions like double headers/footers and broken Prisma connections.

## User Context & Agent Guidance

- **User**: Matthew Knowles – currently learning and relatively inexperienced with programming, but actively engaged in the project and decision-making.
- **Quality bar**: Aim for high-spec, modern, robust implementations ("state of the art") while keeping the UX and existing functionality seamless; do not introduce cleverness that hurts readability or maintainability.
- **Safety & realism**: Take extra precautions around security, data integrity, failure modes, and real-world behaviour (e.g. payment flows, supplier syncs, stock/pricing). Prefer defensive coding and safe defaults over shortcuts.
- **Autonomy expectation**: If the agent can read/edit files and run commands within the workspace, it should **just do so** rather than instructing the user to copy/paste code or run basic commands—focus on delivering working changes end-to-end.
- **When to prompt Matthew**:
  - When a decision has product/business impact (e.g. pricing strategy, supplier choice, UX trade-offs) and there isn’t a clear precedent in the repo.
  - When deeper research or external credentials are required (e.g. Stripe live vs test keys, CJ/AliExpress account specifics).
  - When a change might be destructive or hard to undo (DB migrations, data wipes, major schema reshapes).
- **Communication style**: Keep explanations concise and actionable, but don’t skip over important caveats; when something is non-trivial, briefly state trade-offs and your recommendation.
 - **Pace vs. correctness**: Treat this guidance setup and overall architecture choices as critical; do not rush for short-term speed at the expense of long-term stability, safety, or clarity. Maximum efficiency comes from thoughtful, correct work more than from moving fast.


## Log Entries

### 2025-11-26 – CJ Sync, Pricing & Storefront

**Commits referenced**
- `7ff8e61` – Tune CJ sync: source pricing, category filters, GB/US/CN defaults
- `b01158b` – Add storefront product detail flow and cart context
- `b64bd3e` – Expand admin product editing fields
- `e3b786b` – Explicit SSL config for Prisma Postgres adapter
- `67b2f2f` – Remove unsupported Prisma config client block

**What was done (high level)**
- Tightened **CJ sync and pricing behaviour** so imported products have clearer source pricing, better category filtering, and sane defaults for GB/US/CN markets.
- Built out the **storefront product detail page** under `src/app/products/[slug]/page.tsx`, including gallery, pricing + compare-at display, bundle badge integration via `getBundleLabel`, supplier/source info, delivery info, and review sections.
- Introduced a **cart context + product detail actions** flow so product pages can add items to cart consistently (see `ProductDetailActions` and related cart components).
- Expanded **admin product editing** so more fields from `prisma/schema.prisma` (e.g. CJ metadata, pricing, visibility flags, pages, gallery) are manageable from the CMS rather than only via seed data.
- Hardened **Prisma/Postgres configuration** by adding explicit SSL settings for the adapter and removing an unsupported `client` block that previously caused warnings or runtime issues.

**Why**
- To move closer to a fully DB-backed storefront where products, pricing, and CJ data are consistent between admin and the live site.
- To ensure storefront product pages and the cart flow are powered by the same product model and bundle offers defined in the admin.
- To improve reliability and clarity of the PostgreSQL connection in production environments.

**What’s next / open items**
- [ ] Verify that all active storefront pages (especially bundle and category routes) are using DB-backed products where available, and fall back to `src/content/products.ts` only when necessary.
- [ ] Confirm admin UI fully exposes and validates key product fields added in `prisma/schema.prisma` (pricing, bundle rules, CJ metadata), and that updates propagate correctly to the storefront.
- [ ] Exercise CJ sync flows end-to-end (import → DB → admin → storefront) to catch mismatches in pricing, categories, or GB/US/CN defaults.

### 2025-11-26 – Layout & Stability Pass

**What was done**
- Reviewed global layout in `src/app/layout.tsx` and several pages (home, `for-her`, `gifts`).
- Confirmed admin layout is isolated in `src/app/admin/layout.tsx` and does not reuse the public header/footer.
- Identified risk of double-wrapping via `Layout` and `ClientLayout` in the root layout.

**Why**
- Historic issues where new pages sometimes ended up with duplicated header/footer and heavy shells.
- Need a clear, single source of truth for global chrome (nav/footer) and simple, content-only pages.

**What’s next / open items**
- [ ] Decide the final single source of chrome:
  - Either keep everything in `ClientLayout` or in `Layout`, but not both.
- [ ] Once decided, simplify `src/app/layout.tsx` accordingly and ensure all pages remain content-only.
- [ ] For admin, plan upcoming UI upgrade and confirm whether `src/app/admin/layout.tsx` should remain a thin wrapper or be replaced entirely.

### 2025-11-26 – Agent Instructions & Continuity

**What was done**
- Updated `.github/copilot-instructions.md` to reflect the current architecture (Next.js App Router, Prisma, region handling, SEO patterns) and key helper modules in `src/lib` and `src/content`.
- Documented region/SEO conventions based on `src/app/3-for-bundle/page.tsx`, `src/lib/seo.tsx`, and `src/content/regions.ts`.
- Added guidance around product visibility via `src/lib/catalog.ts` (`getProductsForRegion`) and the `pages`/`showInUk`/`showInUs` flags in `prisma/schema.prisma`.
- Linked the Copilot instructions to this journal so agents know to read and update `docs/AGENT-JOURNAL.md` for cross-session continuity.

**Why**
- To make AI and human contributors immediately productive without re-discovering architecture, region rules, or data flows each session.
- To avoid drift between how the app actually works and what agents assume when generating code or editing SEO/content.

**What’s next / open items**
- [ ] Keep `.github/copilot-instructions.md` in sync whenever major flows change (layout ownership, catalog fields, admin/API patterns).
- [ ] Encourage future sessions to log meaningful changes here, especially around layout decisions, Prisma schema changes, and supplier integrations.

### 2025-11-28 – DB bootstrap & local resilience

**What was done**
- Added `scripts/seed-basic.mjs` plus `npm run db:seed` to populate assets, categories, seed products, and bundle groups; uses the same Prisma adapter setup (dotenv + SSL relaxed) as the app.
- Added `npm run db:migrate` helper for applying the existing migrations set.
- Hardened bundle-facing pages (`getProductsForBundle`, 3-for-* pages) to catch Prisma errors and return empty sets instead of crashing if the DB is unreachable.

**Notes / blockers**
- Local attempts to reach the Render Postgres at `dpg-d4kp61re5dus73fcfkng-a.frankfurt-postgres.render.com` are failing with `ECONNRESET` during connection startup (even with `sslmode=require` and `rejectUnauthorized:false`). `prisma migrate deploy`/`db push` and raw `pg` connections cannot complete from this machine; likely network/VPN/host restriction. Seed/migrate scripts are ready for when a working DB connection is available.

### 2025-11-28 – Column mismatch fix

- Added migration `20251128160000_add_source_price_currency` to create `sourcePrice` and `sourceCurrency` on `Product` (these were in the schema but missing in SQL, causing P2022 ColumnNotFound).
- Reran `prisma migrate deploy` and `npm run db:seed` successfully; Prisma adapter queries now work against the live DB.
