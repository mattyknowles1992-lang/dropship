-- Add gallery array column to store multiple images per product
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
