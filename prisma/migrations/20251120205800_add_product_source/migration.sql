-- Add supplier/source tracking to products
ALTER TABLE "Product" ADD COLUMN "supplier" TEXT;
ALTER TABLE "Product" ADD COLUMN "externalId" TEXT;
ALTER TABLE "Product" ADD COLUMN "sourceUrl" TEXT;

CREATE UNIQUE INDEX "Product_externalId_key" ON "Product"("externalId");
