-- Create CjWarehouse table
CREATE TABLE "CjWarehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CjWarehouse_pkey" PRIMARY KEY ("id")
);

-- Create RawCjVariant table
CREATE TABLE "RawCjVariant" (
    "id" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "sku" TEXT,
    "data" JSONB NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RawCjVariant_pkey" PRIMARY KEY ("id")
);

-- Create RawCjStock table
CREATE TABLE "RawCjStock" (
    "vid" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "countryCode" TEXT,
    "data" JSONB NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RawCjStock_pkey" PRIMARY KEY ("vid","areaId")
);

-- Create RawCjComment table
CREATE TABLE "RawCjComment" (
    "id" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RawCjComment_pkey" PRIMARY KEY ("id")
);
