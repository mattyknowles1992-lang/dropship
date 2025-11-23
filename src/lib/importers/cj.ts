import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";

type CjApiProduct = {
  id?: string;
  name: string;
  description?: string;
  sellPrice?: number;
  retailPrice?: number;
  mainImage?: string;
  image?: string;
  url?: string;
  tags?: string[];
  showInUk?: boolean;
  showInUs?: boolean;
  supplier?: string;
  externalId?: string;
  sourceUrl?: string;
  variants?: unknown;
  warehouse?: string;
  warehouseCode?: string;
  warehouseId?: string;
};

function safeNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toSlug(name: string, id?: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (id) {
    return `${base}-${id.slice(0, 6)}`;
  }
  return base;
}

function buildTags(input: CjApiProduct) {
  const tags = Array.isArray(input.tags) ? [...input.tags] : [];
  if (input.warehouseId) tags.push(`warehouse:${input.warehouseId}`);
  else if (input.warehouseCode) tags.push(`warehouse:${input.warehouseCode}`);
  else if (input.warehouse) tags.push(`warehouse:${input.warehouse}`);
  return tags;
}

function normalizeProduct(input: CjApiProduct) {
  const baseSell = safeNumber(input.sellPrice);
  const baseRetail = safeNumber(input.retailPrice);
  const price = baseSell ?? baseRetail;

  if (price == null || !Number.isFinite(price) || price <= 0) {
    return null;
  }

  const compareAt =
    baseRetail != null && baseRetail > price ? baseRetail : null;

  const imageRaw = input.mainImage ?? input.image ?? "";
  const image = typeof imageRaw === "string" ? imageRaw.trim() : "";

  if (!image) {
    return null;
  }

  return {
    externalId: input.id ?? input.externalId,
    title: input.name,
    slug: toSlug(input.name, input.id ?? input.externalId ?? ""),
    description: input.description ?? null,
    price,
    compareAt,
    image,
    imageAlt: input.name,
    showInUk: input.showInUk ?? true,
    showInUs: input.showInUs ?? true,
    tags: buildTags(input),
    supplier: "cjdropshipping",
    sourceUrl: input.url ?? null,
  };
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
