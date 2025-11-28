import { prisma } from "@/lib/db";
import { normalizeSupplierProduct } from "@/lib/importers/normalize";
import type { Prisma } from "@prisma/client";

// Types for CJ responses
type CjProductListResponse = {
  code: number;
  result: boolean;
  message: string;
  data?: {
    pageSize: number;
    pageNumber: number;
    totalRecords: number;
    totalPages: number;
    content: Array<{
      productList: Array<CjListProduct>;
      relatedCategoryList?: unknown;
      storeList?: Array<{
        warehouseId?: string;
        warehouseName?: string;
        countryCode?: string;
      }>;
    }>;
  };
};

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
  costPrice?: string;
  nowPrice?: string;
  discountPrice?: string;
  currency?: string;
  categoryId?: string;
  threeCategoryName?: string | null;
  warehouseInventoryNum?: number;
  totalVerifiedInventory?: number;
  totalUnVerifiedInventory?: number;
  description?: string;
};

type CjProductDetail = {
  currency?: string;
  pid?: string;
  productNameEn?: string;
  productSku?: string;
  productImage?: string;
  productImages?: unknown;
  productImageList?: unknown;
  description?: string;
  sellPrice?: number;
  costPrice?: number;
  suggestSellPrice?: string;
  categoryId?: string;
  categoryName?: string;
  materialNameEn?: string;
  packingNameEn?: string;
  productProEnSet?: string[];
  productKeyEn?: string;
  productType?: string;
  productUnit?: string;
  productWeight?: number;
  productVideo?: string[];
  variants?: Array<CjVariant>;
};

type CjVariant = {
  vid: string;
  pid: string;
  variantNameEn?: string;
  variantSku?: string;
  variantImage?: string;
  variantStandard?: string;
  variantUnit?: string;
  variantProperty?: string | null;
  variantKey?: string | null;
  variantLength?: number;
  variantWidth?: number;
  variantHeight?: number;
  variantVolume?: number;
  variantWeight?: number;
  variantSellPrice?: number;
  variantSugSellPrice?: number;
  createTime?: string;
};

type CjStockByPid = {
  inventories?: Array<{
    areaEn?: string;
    areaId?: number | string;
    countryCode?: string;
    totalInventoryNum?: number;
    cjInventoryNum?: number;
    factoryInventoryNum?: number;
    countryNameEn?: string;
  }>;
  variantInventories?: Array<{
    vid?: string;
    inventory?: Array<{
      countryCode?: string;
      totalInventory?: number;
      cjInventory?: number;
      factoryInventory?: number;
      verifiedWarehouse?: number;
    }>;
  }>;
};

type CjWarehouse = {
  id: string;
  areaId?: number;
  areaEn?: string;
  countryCode?: string;
  nameEn?: string;
};

type CjComment = {
  commentId?: string | number;
  pid?: string;
  comment?: string;
  commentUser?: string;
  score?: string | number;
  countryCode?: string;
  commentDate?: string;
  commentUrls?: string[];
  flagIconUrl?: string;
};

type SyncOptions = {
  pageSize?: number;
  maxPages?: number;
  countryCodes?: string[];
  excludeCategoryIds?: string[];
  startInventory?: number;
};

export type SyncSummary = {
  pagesProcessed: number;
  rawProducts: number;
  rawVariants: number;
  rawStocks: number;
  rawComments: number;
  productUpserts: number;
};

const DEFAULT_PAGE_SIZE = 50;

function getBaseUrl(): string {
  const url = process.env.CJ_API_URL;
  if (!url) throw new Error("CJ_API_URL is not set");
  const u = new URL(url);
  return `${u.protocol}//${u.host}`;
}

function getAccessToken(): string {
  const token = process.env.CJ_ACCESS_TOKEN;
  if (!token) throw new Error("CJ_ACCESS_TOKEN is not set");
  return token;
}

/**
 * Try to refresh the CJ access token using a refresh token if provided.
 * Expects `CJ_REFRESH_TOKEN` in env. On success, updates process.env.CJ_ACCESS_TOKEN
 * for the lifetime of this process.
 */
async function refreshAccessTokenIfAvailable() {
  const refreshToken = process.env.CJ_REFRESH_TOKEN;
  if (!refreshToken) return;

  try {
    const base = getBaseUrl();
    const url = new URL("/api2.0/v1/authentication/refreshAccessToken", base).toString();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("CJ refresh token failed", res.status, text);
      return;
    }

    const json = await res.json();
    const newToken: string | undefined = json?.data?.accessToken;
    if (newToken) {
      process.env.CJ_ACCESS_TOKEN = newToken;
      console.info("CJ access token refreshed");
    } else {
      console.warn("CJ refresh token response missing accessToken");
    }
  } catch (err) {
    console.warn("CJ refresh token threw", err);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cjGet<T>(path: string, params?: Record<string, string | number | undefined>) {
  const base = getBaseUrl();
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }

  // simple retry for 429 with backoff
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "CJ-Access-Token": getAccessToken(),
      },
      cache: "no-store",
    });

    if (res.status === 429) {
      if (attempt === maxAttempts) throw new Error("CJ API rate limited (429)");
      const delay = 2000 * attempt;
      await sleep(delay);
      continue;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`CJ GET ${path} failed ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
  }
  throw new Error("CJ GET retry exhausted");
}

async function fetchSettings(): Promise<number | null> {
  try {
    const json = await cjGet<{ data?: { setting?: { qpsLimit?: number } } }>("/api2.0/v1/setting/get");
    return json?.data?.setting?.qpsLimit ?? null;
  } catch (e) {
    console.warn("CJ settings fetch failed, continuing without QPS info", e);
    return null;
  }
}

type CjCategoryLevel3 = {
  categoryId?: string;
  categoryName?: string;
  [key: string]: unknown;
};

type CjCategoryLevel2 = {
  categorySecondList?: CjCategoryLevel3[];
  [key: string]: unknown;
};

type CjCategoryLevel1 = {
  categoryFirstList?: CjCategoryLevel2[];
  [key: string]: unknown;
};

type CjCategoryResponse = {
  data?: CjCategoryLevel1[];
};

async function syncCategories() {
  const resp = await cjGet<CjCategoryResponse>("/api2.0/v1/product/getCategory");
  const rows = resp.data ?? [];

  const records: Array<{ id: string; name: string; parentId: string | null; raw: Prisma.InputJsonValue }> = [];
  for (const lvl1 of rows) {
    for (const lvl2 of lvl1?.categoryFirstList ?? []) {
      for (const lvl3 of lvl2?.categorySecondList ?? []) {
        const id = lvl3.categoryId as string | undefined;
        if (!id) continue;
        records.push({
          id,
          name: lvl3.categoryName ?? "Unknown",
          parentId: null,
          raw: (lvl3 as unknown) as Prisma.InputJsonValue,
        });
      }
    }
  }

  for (const rec of records) {
    await prisma.cjCategory.upsert({
      where: { id: rec.id },
      update: { name: rec.name, parentId: rec.parentId, raw: rec.raw, updatedAt: new Date() },
      create: { id: rec.id, name: rec.name, parentId: rec.parentId, raw: rec.raw },
    });
  }
}

type CjWarehouseResponse = {
  data?: Array<{
    id?: string | number;
    areaId?: number;
    areaEn?: string;
    countryCode?: string;
    valueEn?: string;
    en?: string;
    nameEn?: string;
    [key: string]: unknown;
  }>;
};

async function syncWarehouses(): Promise<Record<string, CjWarehouse>> {
  const resp = await cjGet<CjWarehouseResponse>("/api2.0/v1/product/globalWarehouseList");
  const map: Record<string, CjWarehouse> = {};

  for (const w of resp.data ?? []) {
    const id = String(w.id ?? w.areaId ?? w.valueEn ?? "");
    if (!id) continue;
    const record: CjWarehouse = {
      id,
      areaId: w.areaId,
      areaEn: w.areaEn,
      countryCode: w.countryCode ?? w.valueEn,
      nameEn: w.areaEn ?? w.en ?? w.nameEn ?? "Warehouse",
    };
    map[id] = record;
    await prisma.cjWarehouse.upsert({
      where: { id },
      update: {
        name: record.nameEn ?? "Warehouse",
        countryCode: record.countryCode ?? null,
        raw: (w as unknown) as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: { id, name: record.nameEn ?? "Warehouse", countryCode: record.countryCode ?? null, raw: (w as unknown) as Prisma.InputJsonValue },
    });
  }

  return map;
}

async function fetchProductListV2(params: Record<string, string | number | undefined>): Promise<CjProductListResponse> {
  return cjGet<CjProductListResponse>("/api2.0/v1/product/listV2", params);
}

async function fetchProductDetail(pid: string): Promise<CjProductDetail | null> {
  const resp = await cjGet<{ data?: CjProductDetail }>("/api2.0/v1/product/query", {
    pid,
    features: "enable_description",
  });
  return resp.data ?? null;
}

async function fetchVariants(pid: string): Promise<CjVariant[]> {
  const resp = await cjGet<{ data?: CjVariant[] }>("/api2.0/v1/product/variant/query", { pid });
  return resp.data ?? [];
}

async function fetchStockByPid(pid: string): Promise<CjStockByPid | null> {
  const resp = await cjGet<{ data?: CjStockByPid }>("/api2.0/v1/product/stock/getInventoryByPid", { pid });
  return resp.data ?? null;
}

async function fetchComments(pid: string): Promise<CjComment[]> {
  const resp = await cjGet<{ data?: { list?: CjComment[] } }>("/api2.0/v1/product/productComments", {
    pid,
    pageNum: 1,
    pageSize: 10,
  });
  return resp.data?.list ?? [];
}

function getCjId(product: CjListProduct): string | null {
  return product.pid ?? product.id ?? null;
}

function getTitle(product: CjListProduct, detail?: CjProductDetail | null): string | null {
  return detail?.productNameEn ?? product.nameEn ?? product.productNameEn ?? null;
}

function getRetailPrice(product: CjListProduct, detail?: CjProductDetail | null): number | null {
  const source =
    detail?.sellPrice ??
    product.nowPrice ??
    product.discountPrice ??
    product.sellPrice;
  if (!source) return null;
  const n = Number(source);
  return Number.isFinite(n) ? n : null;
}

function getCostPrice(product: CjListProduct, detail?: CjProductDetail | null): number | null {
  const sources: Array<number | string | undefined> = [
    detail?.costPrice,
    product.costPrice,
    detail?.sellPrice,
    product.sellPrice,
  ];

  for (const candidate of sources) {
    if (candidate === undefined || candidate === null) continue;
    const value = Number(candidate);
    if (Number.isFinite(value)) return value;
  }

  return null;
}

function extractImagesFromValue(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => extractImagesFromValue(entry));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractImagesFromValue(parsed);
      } catch (err) {
        console.warn("CJ image JSON parse failed", err);
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
  return [];
}

function collectProductImages(
  product: CjListProduct,
  detail: CjProductDetail | null | undefined,
  variants: CjVariant[],
): string[] {
  const seen = new Set<string>();
  const push = (source: unknown) => {
    const images = extractImagesFromValue(source);
    for (const image of images) {
      if (!seen.has(image)) {
        seen.add(image);
      }
    }
  };

  push(product.bigImage);
  push(product.productImage);
  if (detail) {
    push(detail.productImage);
    if (detail.productImages) push(detail.productImages);
    if (detail.productImageList) push(detail.productImageList);
  }

  for (const variant of variants) {
    push(variant.variantImage);
  }

  return Array.from(seen);
}

function sumInventory(stock?: CjStockByPid | null): number | null {
  if (!stock) return null;
  if (stock.variantInventories?.length) {
    let total = 0;
    for (const v of stock.variantInventories) {
      for (const inv of v.inventory ?? []) {
        if (typeof inv.totalInventory === "number") total += inv.totalInventory;
      }
    }
    return total;
  }
  if (stock.inventories?.length) {
    let total = 0;
    for (const inv of stock.inventories) {
      if (typeof inv.totalInventoryNum === "number") total += inv.totalInventoryNum;
    }
    return total;
  }
  return null;
}

function mapVariantStock(variantId: string, stock: CjStockByPid | null, warehouseMap: Record<string, CjWarehouse>) {
  const records: Array<{ warehouseId?: string; countryCode?: string; totalInventory?: number; verified?: number }> = [];
  if (!stock?.variantInventories) return records;
  for (const v of stock.variantInventories) {
    if (v.vid !== variantId) continue;
    for (const inv of v.inventory ?? []) {
      const wh = Object.values(warehouseMap).find((w) => w.countryCode === inv.countryCode);
      records.push({
        warehouseId: wh?.id,
        countryCode: inv.countryCode,
        totalInventory: inv.totalInventory,
        verified: inv.verifiedWarehouse,
      });
    }
  }
  return records;
}

export async function syncCjProducts(options?: SyncOptions): Promise<SyncSummary> {
  // Refresh access token first if a refresh token is available.
  await refreshAccessTokenIfAvailable();

  const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : DEFAULT_PAGE_SIZE;
  const maxPages = options?.maxPages && options.maxPages > 0 ? options.maxPages : undefined;
  const countryCodes = options?.countryCodes?.length ? options.countryCodes : ["GB", "US"];
  const excludeCategoryIds = new Set(options?.excludeCategoryIds ?? []);
  const startInventory = options?.startInventory ?? undefined;

  const qps = await fetchSettings();
  const throttleMs = qps && qps > 0 ? Math.max(1000 / qps, 300) : 800;

  await syncCategories();
  const warehouseMap = await syncWarehouses();

  let pagesProcessed = 0;
  let rawProducts = 0;
  let rawVariants = 0;
  let rawStocks = 0;
  let rawComments = 0;
  let productUpserts = 0;

  for (const countryCode of countryCodes) {
    let pageNumber = 1;
    let totalPages = 1;

    while (pageNumber <= totalPages && (!maxPages || pagesProcessed < maxPages)) {
      const resp = await fetchProductListV2({
        page: pageNumber,
        size: pageSize,
        countryCode,
        startWarehouseInventory: startInventory,
        features: "enable_category",
        orderBy: 4, // inventory
        sort: "desc",
      });

      const data = resp.data;
      if (!data) break;

      totalPages = data.totalPages ?? 1;

      for (const block of data.content ?? []) {
        for (const product of block.productList ?? []) {
          const cjId = getCjId(product);
          if (!cjId) continue;
          if (product.categoryId && excludeCategoryIds.has(product.categoryId)) continue;

          await prisma.rawCjProduct.upsert({
            where: { id: cjId },
            update: { categoryId: product.categoryId ?? null, data: product, lastSeenAt: new Date() },
            create: { id: cjId, categoryId: product.categoryId ?? null, data: product },
          });
          rawProducts += 1;

          const [detail, variants, stock, comments] = await Promise.all([
            fetchProductDetail(cjId),
            fetchVariants(cjId),
            fetchStockByPid(cjId),
            fetchComments(cjId),
          ]);

          for (const v of variants) {
            await prisma.rawCjVariant.upsert({
              where: { id: v.vid },
              update: { pid: v.pid, sku: v.variantSku ?? null, data: v, lastSeenAt: new Date() },
              create: { id: v.vid, pid: v.pid, sku: v.variantSku ?? null, data: v },
            });
            rawVariants += 1;
          }

          if (stock?.inventories) {
            for (const inv of stock.inventories) {
              const areaId = String(inv.areaId ?? "");
              if (!areaId) continue;
              await prisma.rawCjStock.upsert({
                where: { vid_areaId: { vid: cjId, areaId } },
                update: { countryCode: inv.countryCode ?? null, data: inv, lastSeenAt: new Date() },
                create: { vid: cjId, areaId, countryCode: inv.countryCode ?? null, data: inv },
              });
              rawStocks += 1;
            }
          }
          if (stock?.variantInventories) {
            for (const v of stock.variantInventories) {
              for (const inv of v.inventory ?? []) {
                const areaId = inv.countryCode ? inv.countryCode : "unknown";
                await prisma.rawCjStock.upsert({
                  where: { vid_areaId: { vid: v.vid ?? "unknown", areaId } },
                  update: { countryCode: inv.countryCode ?? null, data: inv, lastSeenAt: new Date() },
                  create: { vid: v.vid ?? "unknown", areaId, countryCode: inv.countryCode ?? null, data: inv },
                });
                rawStocks += 1;
              }
            }
          }

          for (const c of comments) {
            const commentId = String(c.commentId ?? "");
            if (!commentId) continue;
            await prisma.rawCjComment.upsert({
              where: { id: commentId },
              update: { pid: cjId, data: c },
              create: { id: commentId, pid: cjId, data: c },
            });
            rawComments += 1;
          }

          const title = getTitle(product, detail);
          const cjRetail = getRetailPrice(product, detail);
          const cjCost = getCostPrice(product, detail);
          // CJ sell/discount price = our cost (raw). GBP conversion happens inside normaliser when FX env is present.
          const cjCurrency = detail?.currency ?? product.currency ?? null; // keep raw if present.
          const costPrice = cjCost ?? null;
          const totalStock = sumInventory(stock) ?? product.warehouseInventoryNum ?? product.totalVerifiedInventory ?? null;
          const galleryImages = collectProductImages(product, detail, variants);

          const variantPayload = variants.map((v) => {
            return {
              vid: v.vid,
              pid: v.pid,
              sku: v.variantSku,
              name: v.variantNameEn,
              weight: v.variantWeight,
              sellPrice: v.variantSellPrice,
              sugSellPrice: v.variantSugSellPrice,
              dimensions: {
                length: v.variantLength,
                width: v.variantWidth,
                height: v.variantHeight,
                volume: v.variantVolume,
              },
              stock: mapVariantStock(v.vid, stock, warehouseMap),
            };
          });

          let warehouseId: string | null = null;
          let warehouseName: string | null = null;
          let warehouseCode: string | null = null;
          const firstStore = block.storeList?.[0];
          if (firstStore?.warehouseId) {
            warehouseId = String(firstStore.warehouseId);
            warehouseName = firstStore.warehouseName ?? null;
            warehouseCode = firstStore.countryCode ?? null;
          } else if (stock?.inventories?.length) {
            const inv = stock.inventories[0];
            const wh = Object.values(warehouseMap).find((w) => w.countryCode === inv.countryCode);
            warehouseId = wh?.id ?? null;
            warehouseName = wh?.nameEn ?? null;
            warehouseCode = wh?.countryCode ?? null;
          }
          const normalized = normalizeSupplierProduct(
            {
              supplier: "cjdropshipping",
              externalId: cjId,
              title: title ?? null,
              description: detail?.description ?? product.description ?? null,
              price: cjRetail ?? null,
              costPrice,
              currency: cjCurrency,
              image: galleryImages[0] ?? null,
              imageAlt: title ?? null,
              gallery: galleryImages,
              stock: totalStock,
              supplierSku: detail?.productSku ?? product.sku ?? product.spu ?? product.productSku ?? null,
              sourceUrl: null,
              warehouseId,
              warehouseCode,
              warehouseName,
              regionVisibility: { uk: false, us: false },
              variants: variantPayload,
              passthrough: {
                cjSellPrice: cjRetail ?? null,
                cjNowPrice: product.nowPrice ? Number(product.nowPrice) : null,
                cjDiscountPrice: product.discountPrice ? Number(product.discountPrice) : null,
                cjSuggestSellPrice:
                  detail?.suggestSellPrice != null
                    ? String(detail.suggestSellPrice)
                    : null,
                cjCurrency: cjCurrency ?? null,
                cjProductName: product.productNameEn ?? product.nameEn ?? detail?.productNameEn ?? null,
                cjProductNameEn: detail?.productNameEn ?? product.productNameEn ?? product.nameEn ?? null,
                cjSku: detail?.productSku ?? product.sku ?? product.productSku ?? product.spu ?? null,
                cjSpu: product.spu ?? null,
                cjCategoryId: product.categoryId ?? detail?.categoryId ?? null,
                cjCategoryName: product.threeCategoryName ?? detail?.categoryName ?? null,
                cjProductType: detail?.productType ?? null,
                cjProductUnit: detail?.productUnit ?? null,
                cjProductWeight: detail?.productWeight ?? null,
                cjDescription: detail?.description ?? product.description ?? null,
                cjMaterial: detail?.materialNameEn ?? null,
                cjPacking: detail?.packingNameEn ?? null,
                cjProductKey: detail?.productKeyEn ?? null,
                cjLogisticsProps: detail?.productProEnSet,
                cjVideo: detail?.productVideo ?? [],
              },
            },
            {
              fallbackTitle: `CJ Product ${cjId}`,
              defaultPrice: cjRetail ?? 0,
              preservePriceOnUpdate: true,
              preserveTitleOnUpdate: true,
              preserveDescriptionOnUpdate: true,
              preserveImagesOnUpdate: true,
              preserveSupplierSkuOnUpdate: true,
              convertCostToTarget: true,
              targetCurrency: "GBP",
            },
          );

          if (!normalized) {
            continue;
          }

          await prisma.product.upsert({
            where: { externalId: normalized.externalId },
            update: normalized.update,
            create: normalized.create,
          });
          productUpserts += 1;

          await sleep(throttleMs);
        }
      }

      pagesProcessed += 1;
      pageNumber += 1;
      await sleep(throttleMs);
    }
  }

  return { pagesProcessed, rawProducts, rawVariants, rawStocks, rawComments, productUpserts };
}
