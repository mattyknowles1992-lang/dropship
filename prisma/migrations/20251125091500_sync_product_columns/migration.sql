-- Align product catalogue tables with the latest Prisma schema

-- Ensure all CJ-specific product columns exist
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "cjSellPrice" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "cjNowPrice" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "cjDiscountPrice" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "cjSuggestSellPrice" TEXT,
  ADD COLUMN IF NOT EXISTS "cjCurrency" TEXT,
  ADD COLUMN IF NOT EXISTS "cjProductName" TEXT,
  ADD COLUMN IF NOT EXISTS "cjProductNameEn" TEXT,
  ADD COLUMN IF NOT EXISTS "cjSku" TEXT,
  ADD COLUMN IF NOT EXISTS "cjSpu" TEXT,
  ADD COLUMN IF NOT EXISTS "cjCategoryId" TEXT,
  ADD COLUMN IF NOT EXISTS "cjCategoryName" TEXT,
  ADD COLUMN IF NOT EXISTS "cjProductType" TEXT,
  ADD COLUMN IF NOT EXISTS "cjProductUnit" TEXT,
  ADD COLUMN IF NOT EXISTS "cjProductWeight" DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "cjDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "cjMaterial" TEXT,
  ADD COLUMN IF NOT EXISTS "cjPacking" TEXT,
  ADD COLUMN IF NOT EXISTS "cjProductKey" TEXT,
  ADD COLUMN IF NOT EXISTS "cjLogisticsProps" JSONB,
  ADD COLUMN IF NOT EXISTS "cjVideo" TEXT[];

-- Ensure editable product group tables exist
CREATE TABLE IF NOT EXISTS "ProductGroup" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ProductGroupItem" (
  "id" TEXT PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductGroupItem_group_fkey" FOREIGN KEY ("groupId") REFERENCES "ProductGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ProductGroupItem_product_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProductGroupRule" (
  "id" TEXT PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "name" TEXT,
  "minQuantity" INTEGER NOT NULL,
  "bundlePrice" DECIMAL(10, 2) NOT NULL,
  "perOrderLimit" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductGroupRule_group_fkey" FOREIGN KEY ("groupId") REFERENCES "ProductGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add supporting indexes
CREATE UNIQUE INDEX IF NOT EXISTS "ProductGroupItem_groupId_productId_key" ON "ProductGroupItem"("groupId", "productId");
