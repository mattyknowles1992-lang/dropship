# Integration & Deployment Checklist

_A living checklist to keep Prisma, imports, and admin flows stable across releases._

## 1. Pre-Merge Sanity
- Confirm `npm run lint`, `npm run build`, and key unit/integration scripts (`node scripts/test-prisma.mjs`) pass locally.
- Run `scripts/check-product-columns.mjs` against the live database to spot schema drift.
- Ensure `.env` and Render dashboard settings include `DATABASE_URL` and omit `PRISMA_ACCELERATE_URL` (adapter requires direct Postgres URL with SSL).
- Review new marketing routes: add any public paths to `src/lib/routes.ts` → `PUBLIC_ROUTES`.

## 2. Database & Prisma
- Run `npx prisma migrate status` locally to confirm no pending migrations; apply new migrations with `npx prisma migrate deploy` before shipping.
- Verify Prisma Client is regenerated (`npx prisma generate`) after schema tweaks.
- Smoke-test Prisma connectivity via `node scripts/test-prisma.mjs` against the deployed DB.

## 3. Admin / API Surface
- Hit `/admin/products` locally: walk through editing title/description/pricing/tags/gallery and confirm PATCH updates persist.
- Exercise the search/filter controls on `/admin/products` (title/tags/supplier/category) to ensure the list narrows correctly and empty states render.
- If new API routes were added, `npm run build` should include them in the Turbopack summary; double-check route signatures for region handling.
- Confirm `/api/upload` and any new upload endpoints respect file limits and return `path`.

## 4. Imports & External Integrations
- For CJ/AliExpress changes, run staged import scripts (if available) in a sandbox DB, verifying all mapped columns (`docs/cj-field-mapping.md`).
- When touching importer logic, validate the shared `normalizeSupplierProduct` output (slug, pricing, gallery, JSON fields) before writing to Prisma.
- Validate API keys/tokens (CJ, AliExpress, Cloudinary) still resolve from environment variables.
- If AliExpress credentials rotate, rerun `node scripts/refresh-ae-token.mjs` and propagate the generated tokens from `tmp/ae-token-refresh.env` into `.env` and Render.
- Update cron/trigger notes if new background jobs are required.

## 5. Assets & Content
- Run through `getAssets()` consumers to ensure new keys have fallbacks in `src/content/assets.ts`.
- Confirm marketing pages referencing newly added products have region-appropriate copy/currency.

## 6. Deployment Steps
- `git push` → watch Render deploy logs until Prisma migration + Next.js build succeeds.
- After deploy, run `/admin/products` smoke test in production, verifying at least one product edit and image upload round-trip.
- Trigger a manual CJ/AliExpress sync (once implemented) and confirm new products appear with correct region flags.

## 7. Post-Deploy Audit
- Check server logs for Prisma warnings or rejected connections (Render dashboard → Logs).
- Verify sitemap/robots regenerate by curling `/sitemap.xml` and `/robots.txt`.
- Monitor analytics/error tracking (if configured) for the first 30 minutes post-release.

_Keep this checklist updated as tooling evolves—future automation (CI, import jobs) should reference these touchpoints._# Integration & Deployment Checklist

_A living checklist to keep Prisma, imports, and admin flows stable across releases._

## 1. Pre-Merge Sanity
- Snapshot git state before heavy edits (`git status`, `git add`, `git commit`) so rollbacks stay easy.
- Confirm `npm run lint`, `npm run build`, and key unit/integration scripts (`node scripts/test-prisma.mjs`) pass locally.
- Run `scripts/check-product-columns.mjs` against the live database to spot schema drift.
- Ensure `.env` and Render dashboard settings include `DATABASE_URL` and omit `PRISMA_ACCELERATE_URL` (adapter requires direct Postgres URL with SSL).
- Review new marketing routes: add any public paths to `src/lib/routes.ts` → `PUBLIC_ROUTES`.

## 2. Database & Prisma
- Before introducing schema changes, create a branch and run `git add`/`git commit` so you can revert if the migration fails.
- Run `npx prisma migrate status` locally to confirm no pending migrations; apply new migrations with `npx prisma migrate deploy` before shipping.
- Verify Prisma Client is regenerated (`npx prisma generate`) after schema tweaks.
- After a migration runs, double-check the Render database (psql `\d "Product"` or `scripts/check-product-columns.mjs`) so the new columns exist before continuing feature work.
- Smoke-test Prisma connectivity via `node scripts/test-prisma.mjs` against the deployed DB.

## 3. Admin / API Surface
- Hit `/admin/products` locally: walk through editing title/description/pricing/tags/gallery and confirm PATCH updates persist.
- Exercise the search/filter controls on `/admin/products` (title/tags/supplier/category) to ensure the list narrows correctly and empty states render.
- If new API routes were added, `npm run build` should include them in the Turbopack summary; double-check route signatures for region handling.
- Confirm `/api/upload` and any new upload endpoints respect file limits and return `path`.

## 4. Imports & External Integrations
- For CJ/AliExpress changes, run staged import scripts (if available) in a sandbox DB, verifying all mapped columns (`docs/cj-field-mapping.md`).
- When touching importer logic, validate the shared `normalizeSupplierProduct` output (slug, pricing, gallery, JSON fields) before writing to Prisma.
- Validate API keys/tokens (CJ, AliExpress, Cloudinary) still resolve from environment variables.
- If AliExpress credentials rotate, rerun `node scripts/refresh-ae-token.mjs` and propagate the generated tokens from `tmp/ae-token-refresh.env` into `.env` and Render.
- Update cron/trigger notes if new background jobs are required.

## 5. Assets & Content
- Run through `getAssets()` consumers to ensure new keys have fallbacks in `src/content/assets.ts`.
- Confirm marketing pages referencing newly added products have region-appropriate copy/currency.

## 6. Deployment Steps
- `git push` → watch Render deploy logs until Prisma migration + Next.js build succeeds.
- After deploy, run `/admin/products` smoke test in production, verifying at least one product edit and image upload round-trip.
- Trigger a manual CJ/AliExpress sync (once implemented) and confirm new products appear with correct region flags.

## 7. Post-Deploy Audit
- Check server logs for Prisma warnings or rejected connections (Render dashboard → Logs).
- Verify sitemap/robots regenerate by curling `/sitemap.xml` and `/robots.txt`.
- Monitor analytics/error tracking (if configured) for the first 30 minutes post-release.

_Keep this checklist updated as tooling evolves—future automation (CI, import jobs) should reference these touchpoints._