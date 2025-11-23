import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";

type AeApiProduct = {
  id?: string;
  productId?: string;
  sku?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number | string;
  salePrice?: number | string;
  originalPrice?: number | string;
  mainImage?: string;
  image?: string;
  imageUrl?: string;
  url?: string;
  productUrl?: string;
  tags?: string[];
  warehouseId?: string;
  warehouseName?: string;
  warehouseCode?: string;
};

function safeNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
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

function buildTags(input: AeApiProduct) {
  const tags = Array.isArray(input.tags) ? [...input.tags] : [];
  if (input.warehouseId) tags.push(`warehouse:${input.warehouseId}`);
  else if (input.warehouseCode) tags.push(`warehouse:${input.warehouseCode}`);
  else if (input.warehouseName) tags.push(`warehouse:${input.warehouseName}`);
  return tags;
}

function normalizeAeProduct(input: AeApiProduct) {
  const name =
    input.title ??
    input.name ??
    "Unnamed AliExpress product";

  const sell =
    safeNumber(input.salePrice ?? input.price) ??
    safeNumber(input.price);
  const retail =
    safeNumber(input.originalPrice) ?? sell ?? null;

  const price = sell ?? retail;
  if (price == null || price <= 0) {
    return null;
  }

  const compareAt =
    retail != null && retail > price ? retail : null;

  const imageRaw = input.mainImage ?? input.image ?? input.imageUrl ?? "";
  const image =
    typeof imageRaw === "string" ? imageRaw.trim() : "";
  if (!image) {
    return null;
  }

  const externalId =
    input.productId ??
    input.id ??
    input.sku;

  if (!externalId) {
    return null;
  }

  return {
    externalId,
    title: name,
    slug: toSlug(name, externalId),
    description: input.description ?? null,
    price,
    compareAt,
    image,
    imageAlt: name,
    showInUk: true,
    showInUs: true,
    tags: buildTags(input),
    supplier: "aliexpress",
    sourceUrl: input.productUrl ?? input.url ?? null,
  };
}

export async function importAeProducts(
  region: Region,
  feed: AeApiProduct[],
): Promise<{ imported: number }> {
  const now = new Date();
  let imported = 0;

  for (const original of feed) {
    const rawId =
      original.productId ??
      original.id ??
      original.sku ??
      undefined;

    if (rawId) {
      await prisma.rawAeProduct.upsert({
        where: { id: rawId },
        create: {
          id: rawId,
          data: { ...original, _region: region },
          lastSeenAt: now,
        },
        update: {
          data: { ...original, _region: region },
          lastSeenAt: now,
        },
      });
    }

    const product = normalizeAeProduct(original);
    if (!product) continue;

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

// Optional scaffold for direct AliExpress API calls.
// NOTE: The real AliExpress API response shape and parameters
// must be confirmed and adapted by a developer once you have
// the official docs and credentials.

type FetchOptions = {
  page?: number;
  pageSize?: number;
};

export async function fetchAeFeedAll(
  options?: FetchOptions,
): Promise<AeApiProduct[]> {
  const url = process.env.AE_API_URL;
  if (!url) return [];

  const page = options?.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options?.pageSize && options.pageSize > 0 ? options.pageSize : 40;

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  }).toString();

  const headers: Record<string, string> = {};
  if (process.env.AE_API_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.AE_API_TOKEN}`;
  }

  const res = await fetch(`${url}?${query}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    // For now, fail softly and let a dev refine this once AE docs are wired.
    return [];
  }

  const data = await res.json();

  const list =
    (Array.isArray(data) && (data as any[])) ||
    (Array.isArray((data as any).items) && (data as any).items) ||
    (Array.isArray((data as any).data) && (data as any).data) ||
    [];

  return list as AeApiProduct[];
}

