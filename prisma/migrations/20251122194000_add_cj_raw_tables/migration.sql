CREATE TABLE IF NOT EXISTS "CjCategory" (
  "id"         TEXT PRIMARY KEY,
  "name"       TEXT NOT NULL,
  "parentId"   TEXT,
  "raw"        JSONB,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "RawCjProduct" (
  "id"         TEXT PRIMARY KEY,
  "categoryId" TEXT,
  "data"       JSONB NOT NULL,
  "lastSeenAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

