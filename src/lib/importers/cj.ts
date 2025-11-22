import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";

type CjApiProduct = {
  id: string;
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
};

function toSlug(name: string, id: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${id.slice(0, 6)}`;
}

function normalizeProduct(input: CjApiProduct) {
  const price = input.sellPrice ?? input.retailPrice ?? 0;
  const compareAt =
    input.retailPrice && input.sellPrice && input.retailPrice > input.sellPrice
      ? input.retailPrice
      : null;

  return {
    externalId: input.id,
    title: input.name,
    slug: toSlug(input.name, input.id),
    description: input.description ?? null,
    price,
    compareAt,
    image: input.mainImage ?? input.image ?? "",
    imageAlt: input.name,
    showInUk: input.showInUk ?? true,
    showInUs: input.showInUs ?? true,
    tags: input.tags ?? [],
    supplier: "cjdropshipping",
    sourceUrl: input.url ?? null,
  };
}

export async function importCjProducts(
  region: Region,
  feed: CjApiProduct[],
): Promise<{ imported: number }> {
  const normalized = feed.map(normalizeProduct);

  let imported = 0;
  for (const product of normalized) {
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
  const url = process.env.CJ_API_URL;
  if (!url) {
    return [];
  }

  const token = process.env.CJ_API_TOKEN;
  if (!token) {
    throw new Error("CJ_API_TOKEN is not set");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "CJ-Access-Token": token,
  };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`CJ API returned ${res.status}`);
  }

  const data = (await res.json()) as CjApiProduct[] | { products?: CjApiProduct[] };
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as any).products)) return (data as any).products;
  throw new Error("Unexpected CJ API response shape");
}
