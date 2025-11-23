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

function getCjToken(): string {
  const token = process.env.CJ_API_TOKEN;
  if (!token) {
    throw new Error("CJ_API_TOKEN is not set");
  }
  return token;
}

function getCjUrl(): string {
  const url = process.env.CJ_API_URL;
  if (!url) {
    throw new Error("CJ_API_URL is not set");
  }
  return url;
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
  const token = getCjToken();

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

export async function importCjProducts(
  region: Region,
  feed: CjApiProduct[],
): Promise<{ imported: number }> {
  const now = new Date();
  let imported = 0;
  for (const original of feed) {
    const rawId =
      original.id ??
      original.externalId ??
      (original.name ? `anon-${original.name}` : undefined);

    if (rawId) {
      const rawData: any = {
        ...original,
        _region: region,
      };

      await prisma.rawCjProduct.upsert({
        where: { id: rawId },
        create: {
          id: rawId,
          categoryId: (original as any).categoryId ?? null,
          data: rawData,
          lastSeenAt: now,
        },
        update: {
          categoryId: (original as any).categoryId ?? null,
          data: rawData,
          lastSeenAt: now,
        },
      });
    }

    const product = normalizeProduct(original);
    if (!product) {
      continue;
    }

    // Skip items not meant for this region if flags are provided.
    if (
      (region === "uk" && product.showInUk === false) ||
      (region === "us" && product.showInUs === false)
    ) {
      continue;
    }

    await prisma.product.upsert({
      where: { externalId: product.externalId },
      create: product,
      update: product,
    });
    imported += 1;
  }

  return { imported };
}

// ---------- Full feed fetch with pagination ----------

type FetchOptions = {
  pageSize?: number;
  maxPages?: number;
  throttleMs?: number;
  startPage?: number;
};

async function fetchCjFeedPage(
  pageNum: number,
  pageSize: number,
  throttleMs?: number,
): Promise<CjApiProduct[]> {
  const url = process.env.CJ_API_URL;
  if (!url) return [];

  const token = process.env.CJ_API_TOKEN;
  if (!token) throw new Error("CJ_API_TOKEN is not set");

  const size = Math.max(pageSize, 10); // CJ enforces min pageSize of 10
  const delayMs = throttleMs && throttleMs > 0 ? throttleMs : 1200;

  const headers: Record<string, string> = {
    "CJ-Access-Token": token,
  };

  const query = new URLSearchParams({
    pageNum: String(pageNum),
    pageSize: String(size),
  }).toString();

  let attempt = 0;
  let res: Response | null = null;
  while (attempt < 3) {
    attempt += 1;
    res = await fetch(`${url}?${query}`, {
      method: "GET",
      headers,
    });

    if (res.ok) break;

    // Handle rate limit with backoff.
    if (res.status === 429 && attempt < 3) {
      await sleep(delayMs);
      continue;
    }

    const text = await res.text().catch(() => "");
    throw new Error(`CJ API returned ${res.status} ${text}`);
  }

  if (!res) {
    throw new Error("CJ API request did not complete");
  }

  const data = await res.json();

  // Handle common CJ response shapes and map to our expected fields
  const rawList =
    (Array.isArray(data) && (data as any)) ||
    (Array.isArray((data as any).products) && (data as any).products) ||
    (Array.isArray((data as any).data) && (data as any).data) ||
    (Array.isArray((data?.data as any)?.products) && (data.data as any).products) ||
    (Array.isArray((data?.data as any)?.list) && (data.data as any).list) ||
    (Array.isArray((data as any).result) && (data as any).result) ||
    (Array.isArray((data?.result as any)?.list) && (data.result as any).list) ||
    (Array.isArray((data as any).list) && (data as any).list) ||
    [];

  return (rawList as any[]).map((item) => {
    const name =
      item.productNameEn ||
      (Array.isArray(item.productName) ? item.productName[0] : item.productName) ||
      item.name ||
      "Unnamed product";
    const price = safeNumber(item.sellPrice);
    const retailFallback = price ?? 0;
    const retail = safeNumber(item.retailPrice) ?? retailFallback;

    return {
      id: item.pid ?? item.id ?? item.productSku,
      name,
      description: item.remark ?? item.description ?? null,
      sellPrice: price,
      retailPrice: retail,
      mainImage: item.productImage ?? item.mainImage ?? item.image,
      image: item.productImage ?? item.mainImage ?? item.image,
      url: item.productUrl ?? item.sourceUrl ?? null,
      tags: Array.isArray(item.tags) ? item.tags : undefined,
      showInUk: true,
      showInUs: true,
      supplier: "cjdropshipping",
      externalId: item.pid ?? item.id ?? item.productSku,
      sourceUrl: item.productUrl ?? item.sourceUrl ?? null,
      variants: item.variants ?? undefined,
      warehouse: item.warehouse ?? item.warehouseName ?? undefined,
      warehouseCode: item.warehouseCode ?? undefined,
      warehouseId: item.warehouseId ?? undefined,
    } as CjApiProduct;
  });
}

export async function fetchCjFeedAll(options?: FetchOptions): Promise<CjApiProduct[]> {
  const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 100;
  const maxPages = options?.maxPages && options.maxPages > 0 ? options.maxPages : 20;
  const throttleMs = typeof options?.throttleMs === "number" && options.throttleMs > 0 ? options.throttleMs : 0;
  const startPage = options?.startPage && options.startPage > 0 ? options.startPage : 1;

  const all: Record<string, CjApiProduct> = {};

  const endPage = startPage + maxPages - 1;

  for (let page = startPage; page <= endPage; page += 1) {
    const pageData = await fetchCjFeedPage(page, pageSize, throttleMs);
    if (pageData.length === 0) break;
    for (const item of pageData) {
      const key = item.id ?? item.externalId ?? `${item.name}-${page}-${Math.random().toString(16).slice(2, 8)}`;
      all[key] = item;
    }
    if (pageData.length < pageSize) break; // no more pages

    // Respect CJ rate limits (1 req/sec) if throttling is requested.
    if (throttleMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, throttleMs));
    }
  }

  return Object.values(all);
}

// ---------- Variant + stock sync ----------

type CjVariant = {
  variantId?: string;
  vid?: string;
  id?: string;
  pid?: string;
  sku?: string;
  price?: number;
  sellPrice?: number;
  retailPrice?: number;
  weight?: number;
  stock?: number;
  inventory?: number;
  color?: string;
  size?: string;
  [key: string]: unknown;
};

type CjStockResponse = {
  vid?: string;
  stock?: number;
  sellStock?: number;
  availableStock?: number;
  quantity?: number;
  [key: string]: unknown;
};

function getVariantId(variant: CjVariant) {
  return variant.variantId ?? variant.vid ?? variant.id ?? null;
}

function resolveStockNumber(variant: CjVariant, stockResponse?: CjStockResponse | null) {
  const stockFromResponse =
    stockResponse?.stock ??
    stockResponse?.availableStock ??
    stockResponse?.sellStock ??
    stockResponse?.quantity;

  if (typeof stockFromResponse === "number") {
    return stockFromResponse;
  }

  const embedded =
    variant.stock ?? variant.inventory ?? (variant as any).sellStock ?? (variant as any).availableStock;
  return typeof embedded === "number" ? embedded : null;
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

async function fetchCjVariantsByProductId(pid: string): Promise<CjVariant[]> {
  const endpoint = "https://developers.cjdropshipping.com/api2.0/v1/product/variant/queryByPid";
  const json = await cjPost(endpoint, { pid });
  const candidates = (json?.data as any) ?? (json?.result as any);

  if (Array.isArray(candidates)) {
    return candidates;
  }
  if (Array.isArray(candidates?.variants)) {
    return candidates.variants;
  }
  if (Array.isArray(candidates?.list)) {
    return candidates.list;
  }
  return [];
}

async function fetchCjStockForVariant(vid: string): Promise<CjStockResponse | null> {
  const endpoint = "https://developers.cjdropshipping.com/api2.0/v1/product/stock/queryByVid";
  try {
    const json = await cjPost(endpoint, { vid });
    const data = (json?.data as any) ?? (json?.result as any);
    if (!data) return null;
    if (Array.isArray(data)) return data.find((entry) => entry?.vid === vid) ?? data[0] ?? null;
    return data as CjStockResponse;
  } catch (error) {
    console.error(`Failed to fetch stock for VID ${vid}`, error);
    return null;
  }
}

export async function syncCjVariantsForProduct(product: { id: string; externalId: string }) {
  const pid = product.externalId;
  const variants = await fetchCjVariantsByProductId(pid);

  const variantsWithStock = [];
  let totalStock = 0;

  for (const variant of variants) {
    const variantId = getVariantId(variant);
    let stockNumber: number | null = null;

    if (variantId) {
      const stockResponse = await fetchCjStockForVariant(variantId);
      stockNumber = resolveStockNumber(variant, stockResponse);
    } else {
      stockNumber = resolveStockNumber(variant);
    }

    if (typeof stockNumber === "number") {
      totalStock += stockNumber;
    }

    variantsWithStock.push({
      ...variant,
      variantId,
      stock: stockNumber,
    });
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      variants: variantsWithStock,
      stock: variantsWithStock.length > 0 ? totalStock : null,
    },
  });

  return { variantCount: variantsWithStock.length, totalStock, productId: updated.id };
}

// ---------- Freight calculation ----------

type FreightItem = {
  vid: string;
  quantity: number;
  weight?: number;
};

export type FreightQuoteRequest = {
  countryCode: string;
  postCode?: string;
  province?: string;
  city?: string;
  items: FreightItem[];
};

export async function calculateCjFreightQuote(params: FreightQuoteRequest) {
  const endpoint =
    process.env.CJ_FREIGHT_API_URL ??
    "https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate";

  const payload = {
    countryCode: params.countryCode,
    province: params.province ?? "",
    city: params.city ?? "",
    postCode: params.postCode ?? "",
    productList: params.items.map((item) => ({
      vid: item.vid,
      quantity: item.quantity,
      weight: item.weight ?? undefined,
    })),
  };

  const json = await cjPost(endpoint, payload);
  const candidates = (json?.data as any) ?? (json?.result as any);

  const options = Array.isArray(candidates)
    ? candidates.map((opt) => ({
        company: opt.company ?? opt.logisticsCompany ?? null,
        channel: opt.channel ?? opt.logisticsChannel ?? opt.channelName ?? null,
        cost: typeof opt.freight === "number" ? opt.freight : opt.cost ?? null,
        currency: opt.currency ?? null,
        deliveryDays: opt.deliveryTime ?? opt.aging ?? null,
        raw: opt,
      }))
    : [];

  return { options, raw: json };
}

export async function fetchCjFeed(): Promise<CjApiProduct[]> {
  return fetchCjFeedAll();
}
