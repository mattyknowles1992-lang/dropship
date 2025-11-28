import { createHash, createHmac } from "node:crypto";

import type { Region } from "@/content/regions";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeSupplierProduct, type NormalizedProduct } from "@/lib/importers/normalize";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment");
}

const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({
  log: ["error"],
  adapter,
});

export type AeApiProduct = {
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
  raw?: Record<string, unknown>;
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

function normalizeAeProduct(input: AeApiProduct): NormalizedProduct | null {
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

  return normalizeSupplierProduct(
    {
      supplier: "aliexpress",
      externalId,
      title: name,
      slug: toSlug(name, externalId),
      description: input.description ?? null,
      price,
      compareAt,
      image,
      imageAlt: name,
      gallery: [image],
      tags: buildTags(input),
      supplierSku: input.sku ?? null,
      sourceUrl: input.productUrl ?? input.url ?? null,
      warehouseId: input.warehouseId ?? null,
      warehouseCode: input.warehouseCode ?? null,
      warehouseName: input.warehouseName ?? null,
      regionVisibility: { uk: true, us: true },
    },
    {
      fallbackTitle: `AliExpress product ${externalId}`,
    },
  );
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
      const basePayload: Record<string, unknown> = isRecord(original.raw)
        ? { ...original.raw }
        : { ...original };
      const dataPayload: Record<string, unknown> = {
        ...basePayload,
        _region: region,
      };

      await prisma.rawAeProduct.upsert({
        where: { id: rawId },
        create: {
          id: rawId,
          data: dataPayload as Prisma.InputJsonValue,
          lastSeenAt: now,
        },
        update: {
          data: dataPayload as Prisma.InputJsonValue,
          lastSeenAt: now,
        },
      });
    }

    const normalized = normalizeAeProduct(original);
    if (!normalized) continue;

    await prisma.product.upsert({
      where: { externalId: normalized.externalId },
      create: normalized.create,
      update: normalized.update,
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
  method?: string;
  language?: string;
  shipToCountry?: string;
  targetCurrency?: string;
  feedName?: string;
  searchId?: string;
  categoryId?: string | number;
  extraParams?: Record<string, string | number | undefined>;
};

export async function fetchAeFeedAll(options?: FetchOptions): Promise<AeApiProduct[]> {
  const page = options?.page && options.page > 0 ? options.page : 1;
  const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 40;
  const method = options?.method ?? process.env.AE_API_METHOD ?? "aliexpress.ds.feed.get";
  const language = options?.language ?? process.env.AE_API_LANGUAGE ?? "en";
  const shipToCountry = options?.shipToCountry ?? process.env.AE_SHIP_TO_COUNTRY ?? "GB";
  const targetCurrency = options?.targetCurrency ?? process.env.AE_TARGET_CURRENCY ?? "GBP";
  const feedName = options?.feedName ?? process.env.AE_FEED_NAME;
  const searchId = options?.searchId ?? process.env.AE_SEARCH_ID;
  const categoryId = options?.categoryId ?? process.env.AE_CATEGORY_ID;
  const extraParams = options?.extraParams ?? {};

  const rawItems = await callAliExpressApi(method, {
    current_page: page,
    page_size: pageSize,
    language,
    ship_to_country: shipToCountry,
    target_currency: targetCurrency,
    feed_name: feedName,
    search_id: searchId,
    category_id: categoryId,
    ...extraParams,
  });

  const products: AeApiProduct[] = [];
  for (const item of rawItems) {
    const mapped = mapAliExpressRecord(item);
    if (mapped) {
      products.push(mapped);
    }
  }
  return products;
}

type AliExpressBizParams = Record<string, string | number | undefined>;

type AliExpressCredentials = {
  endpoint: string;
  appKey: string;
  appSecret: string;
  accessToken: string;
  signMethod: "md5" | "sha256";
  httpMethod: "GET" | "POST";
};

async function callAliExpressApi(
  method: string,
  bizParams: AliExpressBizParams,
): Promise<Record<string, unknown>[]> {
  const creds = resolveAliExpressCredentials();

  const timestamp = buildAliExpressTimestamp();
  const commonParams: Record<string, string> = {
    method,
    app_key: creds.appKey,
    session: creds.accessToken,
    timestamp,
    format: "json",
    v: "2.0",
    sign_method: creds.signMethod,
  };

  const filteredBizEntries = Object.entries(bizParams)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => [key, typeof value === "number" ? String(value) : String(value)]) as Array<[string, string]>;

  const allParams = Object.fromEntries([
    ...Object.entries(commonParams),
    ...filteredBizEntries,
  ]) as Record<string, string>;

  const sign = buildAliExpressSignature(allParams, creds);
  const payload = new URLSearchParams({ ...allParams, sign });

  const requestUrl = creds.httpMethod === "POST"
    ? creds.endpoint
    : `${creds.endpoint}?${payload.toString()}`;

  const response = await fetch(requestUrl, {
    method: creds.httpMethod,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: creds.httpMethod === "POST" ? payload.toString() : undefined,
    cache: "no-store",
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`AliExpress API HTTP ${response.status}: ${rawText.slice(0, 400)}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`AliExpress API returned non-JSON payload: ${String(error)}`);
  }

  const errorResponse =
    isRecord(parsed) && isRecord(parsed.error_response)
      ? parsed.error_response
      : null;
  if (errorResponse) {
    const code = typeof errorResponse.code === "string" ? errorResponse.code : "";
    const msg = typeof errorResponse.msg === "string" ? errorResponse.msg : "";
    const subMsg = typeof errorResponse.sub_msg === "string" ? errorResponse.sub_msg : "";
    throw new Error(`AliExpress API error ${code} ${msg} ${subMsg}`.trim());
  }

  const responseKey = `${method.replace(/\./g, "_")}_response`;
  const root =
    isRecord(parsed) && parsed[responseKey] !== undefined
      ? parsed[responseKey]
      : isRecord(parsed) && parsed.response !== undefined
        ? parsed.response
        : parsed;

  return extractAliExpressRecords(root);
}

function resolveAliExpressCredentials(): AliExpressCredentials {
  const appKey = process.env.AE_APP_KEY ?? process.env.app_key;
  const appSecret = process.env.AE_APP_SECRET;
  const accessToken =
    process.env.AE_ACCESS_TOKEN ?? process.env.access_token;
  const endpoint = process.env.AE_API_ENDPOINT ?? "https://api-sg.aliexpress.com/rest";
  const signMethodEnv = (process.env.AE_SIGN_METHOD ?? "md5").toLowerCase();
  const httpMethodEnv = (process.env.AE_HTTP_METHOD ?? "GET").toUpperCase();

  if (!appKey || !appSecret || !accessToken) {
    throw new Error("Missing AliExpress credentials (AE_APP_KEY/AE_APP_SECRET/AE_ACCESS_TOKEN)");
  }

  const signMethod: "md5" | "sha256" = signMethodEnv === "sha256" ? "sha256" : "md5";
  const httpMethod: "GET" | "POST" = httpMethodEnv === "POST" ? "POST" : "GET";

  return {
    endpoint,
    appKey,
    appSecret,
    accessToken,
    signMethod,
    httpMethod,
  };
}

function buildAliExpressTimestamp(now = new Date()): string {
  const format = (process.env.AE_TIMESTAMP_FORMAT ?? "beijing-time").toLowerCase();

  if (format === "epoch-ms" || format === "unix-ms" || format === "milliseconds") {
    return String(now.getTime());
  }

  if (format === "iso8601" || format === "iso") {
    return now.toISOString();
  }

  const utcMillis = now.getTime() + now.getTimezoneOffset() * 60_000;
  const beijing = new Date(utcMillis + 8 * 60 * 60_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${beijing.getFullYear()}-${pad(beijing.getMonth() + 1)}-${pad(beijing.getDate())} ${pad(beijing.getHours())}:${pad(beijing.getMinutes())}:${pad(beijing.getSeconds())}`;
}

function buildAliExpressSignature(
  params: Record<string, string>,
  creds: AliExpressCredentials,
): string {
  const sortedKeys = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== "")
    .sort();
  const base = sortedKeys.reduce((acc, key) => acc + key + params[key], "");

  if (creds.signMethod === "sha256") {
    return createHmac("sha256", creds.appSecret)
      .update(base)
      .digest("hex")
      .toUpperCase();
  }

  return createHash("md5")
    .update(`${creds.appSecret}${base}${creds.appSecret}`)
    .digest("hex")
    .toUpperCase();
}

function extractAliExpressRecords(root: unknown): Record<string, unknown>[] {
  if (Array.isArray(root)) {
    return root.filter(isRecord);
  }

  if (!isRecord(root)) {
    return [];
  }

  const candidates: unknown[] = [];

  const directKeys = ["result", "items", "data", "list", "products", "product_list", "ae_items", "ae_item_dtos", "ae_item_dto"] as const;
  for (const key of directKeys) {
    if (root[key] !== undefined) {
      candidates.push(root[key]);
    }
  }

  if (isRecord(root.result)) {
    const nested = root.result;
    for (const key of directKeys) {
      if (nested[key] !== undefined) {
        candidates.push(nested[key]);
      }
    }
    const aeItemDtos = nested["ae_item_dtos"];
    if (isRecord(aeItemDtos) && Array.isArray(aeItemDtos["ae_item_dto"])) {
      candidates.push(aeItemDtos["ae_item_dto"]);
    }
  }

  for (const candidate of candidates) {
    const records = flattenAliExpressCollection(candidate);
    if (records.length > 0) {
      return records;
    }
  }

  return isRecord(root) ? [root] : [];
}

function flattenAliExpressCollection(value: unknown): Record<string, unknown>[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }
  if (isRecord(value)) {
    const aeItemDto = value["ae_item_dto"];
    if (Array.isArray(aeItemDto)) {
      return aeItemDto.filter(isRecord);
    }
    const items = value["items"];
    if (Array.isArray(items)) {
      return items.filter(isRecord);
    }
    const list = value["list"];
    if (Array.isArray(list)) {
      return list.filter(isRecord);
    }
    const product = value["product"];
    if (Array.isArray(product)) {
      return product.filter(isRecord);
    }
    const productList = value["product_list"];
    if (Array.isArray(productList)) {
      return productList.filter(isRecord);
    }
  }
  return [];
}

function mapAliExpressRecord(record: Record<string, unknown>): AeApiProduct | null {
  const getString = (keys: string[]): string | undefined => {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
    return undefined;
  };

  const getNumber = (keys: string[]): number | null => {
    for (const key of keys) {
      const value = record[key];
      const num = safeNumber(value);
      if (num != null) {
        return num;
      }
    }
    return null;
  };

  const getImages = (): string[] => {
    const imageKeys = [
      "mainImage",
      "image",
      "imageUrl",
      "image_url",
      "product_main_image_url",
      "product_main_image",
      "product_image",
      "productImage",
      "product_image_url",
      "product_small_images",
      "product_small_image_urls",
      "image_urls",
      "images",
    ];

    for (const key of imageKeys) {
      if (!(key in record)) continue;
      const value = record[key];
      const normalized = normalizeImageValue(value);
      if (normalized.length > 0) {
        return normalized;
      }
    }
    return [];
  };

  const collectTags = (): string[] => {
    const tagSet = new Set<string>();

    const tagCandidates = [record.tags, record.product_tags, record.tagList];
    for (const candidate of tagCandidates) {
      if (Array.isArray(candidate)) {
        for (const entry of candidate) {
          if (typeof entry === "string" && entry.trim()) {
            tagSet.add(entry.trim());
          }
        }
      } else if (typeof candidate === "string" && candidate.trim()) {
        candidate
          .split(/[;,]/)
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .forEach((chunk) => tagSet.add(chunk));
      }
    }

    const categoryPath = getString([
      "category_path",
      "product_category_path",
      "product_category",
      "product_category_name",
      "category_name",
    ]);
    if (categoryPath) {
      categoryPath
        .split(/[>\|,]/)
        .map((piece) => piece.trim())
        .filter(Boolean)
        .forEach((piece) => tagSet.add(piece));
    }

    return Array.from(tagSet);
  };

  const productId = getString([
    "productId",
    "product_id",
    "item_id",
    "itemId",
    "ae_item_id",
    "id",
  ]);

  const sku = getString([
    "sku",
    "item_sku",
    "sku_code",
    "productSku",
    "product_sku",
    "ae_sku_id",
  ]);

  const title =
    getString([
      "title",
      "subject",
      "product_title",
      "productTitle",
      "product_name",
      "productName",
      "name",
    ]) ?? `AliExpress product ${productId ?? sku ?? ""}`.trim();

  const description = getString([
    "description",
    "detail",
    "product_description",
    "productDescription",
    "item_description",
  ]);

  const salePrice = getNumber([
    "salePrice",
    "sale_price",
    "product_min_price",
    "min_price",
    "price",
    "target_sale_price",
  ]);

  const originalPrice = getNumber([
    "originalPrice",
    "original_price",
    "product_max_price",
    "max_price",
    "target_original_price",
  ]);

  const price = salePrice ?? originalPrice;
  if (price == null || price <= 0) {
    return null;
  }

  const images = getImages();
  const image = images[0];

  const url = getString([
    "productUrl",
    "product_url",
    "productDetailUrl",
    "product_detail_url",
    "detail_url",
    "detailUrl",
    "url",
  ]);

  const tags = collectTags();

  const warehouseId = getString(["warehouseId", "warehouse_id"]);
  const warehouseName = getString(["warehouseName", "warehouse_name"]);
  const warehouseCode = getString([
    "warehouseCode",
    "warehouse_code",
    "ship_from_country",
    "ship_from",
  ]);

  return {
    raw: record,
    id: productId ?? sku ?? getString(["id"]),
    productId: productId ?? undefined,
    sku: sku ?? undefined,
    title,
    name: title,
    description,
    price,
    salePrice: salePrice ?? undefined,
    originalPrice: originalPrice ?? undefined,
    mainImage: image,
    image: image,
    imageUrl: image,
    url,
    productUrl: url,
    tags: tags.length ? tags : undefined,
    warehouseId: warehouseId ?? undefined,
    warehouseName: warehouseName ?? undefined,
    warehouseCode: warehouseCode ?? undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeImageValue(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeImageValue(parsed);
      } catch {
        return [];
      }
    }
    const separators = [",", "|", ";"];
    for (const separator of separators) {
      if (trimmed.includes(separator)) {
        return trimmed
          .split(separator)
          .map((part) => part.trim())
          .filter((part) => part.length > 0);
      }
    }
    return [trimmed];
  }
  if (Array.isArray(value)) {
    const result: string[] = [];
    for (const entry of value) {
      normalizeImageValue(entry).forEach((img) => result.push(img));
    }
    return result;
  }
  if (isRecord(value)) {
    const stringList = value["string"];
    if (Array.isArray(stringList)) {
      return stringList.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
    }
    const images = value["images"];
    if (Array.isArray(images)) {
      return images.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
    }
  }
  return [];
}

