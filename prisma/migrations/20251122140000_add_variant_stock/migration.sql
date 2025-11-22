-- Add stock tracking and variant snapshot for CJ
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "stock" INTEGER;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "variants" JSONB;
