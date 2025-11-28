-- Add `pages` array column so products can be featured on specific storefront pages.
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "pages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
