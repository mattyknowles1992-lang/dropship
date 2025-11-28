-- Store raw supplier price in USD alongside GBP pricing.
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "priceUsd" DECIMAL(10, 2);
