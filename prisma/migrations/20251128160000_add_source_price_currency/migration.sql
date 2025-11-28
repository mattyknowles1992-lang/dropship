-- Add missing source pricing columns that exist in the Prisma schema but were absent in migrations.
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "sourcePrice" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "sourceCurrency" TEXT;
