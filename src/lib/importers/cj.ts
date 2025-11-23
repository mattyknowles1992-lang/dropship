import { prisma } from "@/lib/db";

type CjListProduct = {
  id?: string;
  pid?: string;
  nameEn?: string;
  productNameEn?: string;
  sku?: string;
  spu?: string;
  productSku?: string;
  bigImage?: string;
  productImage?: string;
  sellPrice?: string;
  nowPrice?: string;
  discountPrice?: string;
  currency?: string;
  categoryId?: string;
  threeCategoryName?: string | null;
  warehouseInventoryNum?: number;
  totalVerifiedInventory?: number;
  description?: string;
};

// In-memory CJ access token cache so we don't request a new token
// for every single product page.
type CjTokenCache = {
  token: string;
  expiresAt: number; // epoch ms
} | null;

let cjTokenCache: CjTokenCache = null;

type CjProductListEnvelope = {
  code: number;
  result: boolean;
  message: string;
  data?: {
    pageSize: number;
    pageNumber: number;
    totalRecords: number;
    totalPages: number;
    content: Array<{
      productList: CjListProduct[];
      relatedCategoryList?: unknown;
      storeList?: Array<{
        warehouseId?: string;
        warehouseName?: string;
      }>;
    }>;
  };
};

function getCjUrl(): string {
  const url = process.env.CJ_API_URL;
  if (!url) {
    throw new Error("CJ_API_URL is not set");
  }
  return url;
}

function getCjAccessTokenFromEnv(): string {
  const token = process.env.CJ_ACCESS_TOKEN;
  if (!token) {
    throw new Error("CJ_ACCESS_TOKEN is not set");
  }
  return token;
}

function getCjId(product: CjListProduct): string | null {
  return product.pid ?? product.id ?? null;
}

function getTitle(product: CjListProduct): string | null {
  return product.nameEn ?? product.productNameEn ?? null;
}

function getImage(product: CjListProduct): string | null {
  return product.bigImage ?? product.productImage ?? null;
}

function getPrice(product: CjListProduct): number | null {
  const source = product.nowPrice ?? product.discountPrice ?? product.sellPrice;
  if (!source) return null;
  const n = Number(source);
  return Number.isFinite(n) ? n : null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCjProductPage(pageNumber: number, pageSize: number): Promise<CjProductListEnvelope> {
  const url = getCjUrl();
  const token = getCjAccessTokenFromEnv();

  // listV2 expects GET with `page` and `size` query params
  const params = new URLSearchParams({
    page: String(pageNumber),
    size: String(pageSize),
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: {
      "CJ-Access-Token": token,
    },
  });

  if (response.status === 429) {
    throw new Error("CJ API rate limited (429)");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CJ API error ${response.status}: ${text}`);
  }

  const json = (await response.json()) as CjProductListEnvelope;
  return json;
}

export type SyncSummary = {
  pagesProcessed: number;
  rawUpserts: number;
  productUpserts: number;
};

export async function syncCjProducts(options?: { pageSize?: number; maxPages?: number }): Promise<SyncSummary> {
  const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 50;
  const maxPages = options?.maxPages && options.maxPages > 0 ? options.maxPages : undefined;

  let pageNumber = 1;
  let totalPages = 1;
  let pagesProcessed = 0;
  let rawUpserts = 0;
  let productUpserts = 0;

  // Basic retry/backoff settings for 429s or transient errors.
  const maxRetries = 5;

  while (pageNumber <= totalPages && (!maxPages || pagesProcessed < maxPages)) {
    let attempt = 0;
    let pageData: CjProductListEnvelope | null = null;

    // Retry loop for this page
    while (attempt <= maxRetries) {
      try {
        pageData = await fetchCjProductPage(pageNumber, pageSize);
        break;
      } catch (error) {
        attempt += 1;
        const isLastAttempt = attempt > maxRetries;

        // Simple exponential backoff, starting at 2s.
        const delayMs = Math.min(60000, 2000 * attempt);

        if (isLastAttempt) {
          console.error("CJ sync: giving up on page", pageNumber, "error", error);
          throw error;
        }

        console.warn(
          "CJ sync: error fetching page",
          pageNumber,
          "attempt",
          attempt,
          "– waiting",
          delayMs,
          "ms before retry",
        );
        await sleep(delayMs);
      }
    }

    if (!pageData || !pageData.data) {
      break;
    }

    totalPages = pageData.data.totalPages ?? 1;

    for (const block of pageData.data.content ?? []) {
      const store = Array.isArray(block.storeList) ? block.storeList[0] : undefined;

      for (const product of block.productList ?? []) {
        const cjId = getCjId(product);
        if (!cjId) continue;

        const title = getTitle(product);
        const image = getImage(product);
        const price = getPrice(product);

        // Upsert RawCjProduct with full payload.
        await prisma.rawCjProduct.upsert({
          where: { id: cjId },
          update: {
            categoryId: product.categoryId ?? null,
            data: product,
            lastSeenAt: new Date(),
          },
          create: {
            id: cjId,
            categoryId: product.categoryId ?? null,
            data: product,
          },
        });
        rawUpserts += 1;

        // Seed/update Product so it appears in WMS/admin, but keep it non-live.
        const data: Record<string, unknown> = {
          supplier: "cj",
          externalId: cjId,
        };

        if (title) {
          data.title = title;
          data.slug = slugify(title);
          data.imageAlt = title;
        }

        if (image) {
          data.image = image;
        }

        if (typeof product.description === "string" && product.description.trim().length > 0) {
          data.description = product.description.trim();
        }

        if (price !== null) {
          data.price = price;
        }

        if (typeof product.warehouseInventoryNum === "number") {
          data.stock = product.warehouseInventoryNum;
        } else if (typeof product.totalVerifiedInventory === "number") {
          data.stock = product.totalVerifiedInventory;
        }

        if (product.categoryId) {
          data.categoryId = product.categoryId;
        }

        if (store?.warehouseId) {
          data.warehouseId = store.warehouseId;
        }
        if (store?.warehouseName) {
          data.warehouseName = store.warehouseName;
        }

        // Never make imported products live automatically.
        data.showInUk = false;
        data.showInUs = false;

        await prisma.product.upsert({
          where: { externalId: cjId },
          update: data,
          create: {
            title: (data.title as string) ?? `CJ Product ${cjId}`,
            slug: (data.slug as string) ?? slugify(`cj-${cjId}`),
            description: (data.description as string) ?? null,
            price: (data.price as number) ?? 0,
            compareAt: null,
            costPrice: null,
            shippingUk: null,
            shippingUs: null,
            image: (data.image as string) ?? "/products/placeholder.jpg",
            imageAlt: (data.imageAlt as string) ?? null,
            showInUk: false,
            showInUs: false,
            tags: [],
            stock: (data.stock as number | undefined) ?? null,
            supplier: "cj",
            supplierSku:
              product.sku ?? product.spu ?? product.productSku ?? undefined,
            externalId: cjId,
            sourceUrl: null,
            warehouseId: (data.warehouseId as string | undefined) ?? null,
            warehouseCode: null,
            warehouseName: (data.warehouseName as string | undefined) ?? null,
            categoryId: (data.categoryId as string | undefined) ?? null,
          },
        });

        productUpserts += 1;
      }
    }

    pagesProcessed += 1;
    pageNumber += 1;
  }

  return { pagesProcessed, rawUpserts, productUpserts };
}
 
async function cjPost(endpoint: string, payload: Record<string, unknown>) {
  const token = process.env.CJ_API_TOKEN;
  if (!token) {
    throw new Error("CJ_API_TOKEN is not set");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CJ API ${endpoint} returned ${res.status} ${text}`);
  }

  return res.json() as Promise<any>;
}
// NOTE: Legacy CJ feed/variant/freight helpers removed; this file now focuses on
// listV2 product import using CJ_ACCESS_TOKEN and CJ_API_URL.
