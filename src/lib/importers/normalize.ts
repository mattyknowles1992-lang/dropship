import { Prisma } from "@prisma/client";

const DEFAULT_PLACEHOLDER_IMAGE = "/products/santa-hat-model-1.jpg";

type RegionVisibility = {
  uk?: boolean;
  us?: boolean;
};

type Passthrough = Record<string, unknown>;

export type SupplierProductInput = {
  supplier: string;
  externalId: string | number;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  price?: number | string | null;
  compareAt?: number | string | null;
  costPrice?: number | string | null;
  currency?: string | null;
  sourcePrice?: number | string | null;
  sourceCurrency?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  gallery?: Array<string | null | undefined>;
  tags?: Array<string | null | undefined>;
  stock?: number | string | null;
  supplierSku?: string | null;
  sourceUrl?: string | null;
  warehouseId?: string | number | null;
  warehouseCode?: string | number | null;
  warehouseName?: string | null;
  categoryId?: string | null;
  variants?: unknown;
  regionVisibility?: RegionVisibility;
  passthrough?: Passthrough;
};

export type NormalizationOptions = {
  fallbackTitle?: string;
  defaultPrice?: number;
  preservePriceOnUpdate?: boolean;
  preserveTitleOnUpdate?: boolean;
  preserveDescriptionOnUpdate?: boolean;
  preserveImagesOnUpdate?: boolean;
  preserveSupplierSkuOnUpdate?: boolean;
  placeholderImage?: string;
  convertCostToTarget?: boolean;
  targetCurrency?: string;
  galleryLimit?: number;
};

export type NormalizedProduct = {
  externalId: string;
  supplier: string;
  create: Prisma.ProductUncheckedCreateInput;
  update: Prisma.ProductUncheckedUpdateInput;
  primaryImage: string;
  gallery: string[];
  tags: string[];
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

function toOptionalNumber(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toOptionalInt(value: unknown): number | null | undefined {
  const parsed = toOptionalNumber(value);
  if (parsed === undefined) return undefined;
  if (parsed === null) return null;
  return Math.round(parsed);
}

function collectImages(candidates: unknown[]): string[] {
  const seen = new Set<string>();
  const stack = [...candidates];

  while (stack.length) {
    const next = stack.shift();
    if (next === undefined || next === null) continue;
    if (typeof next === "string") {
      const trimmed = next.trim();
      if (trimmed.length) seen.add(trimmed);
      continue;
    }
    if (Array.isArray(next)) {
      stack.push(...next);
    }
  }

  return Array.from(seen);
}

export function convertCurrency(value: number, fromCurrency: string, targetCurrency: string): number {
  const from = fromCurrency.toUpperCase();
  const target = targetCurrency.toUpperCase();
  if (from === target) return value;

  if (from === "USD" && target === "GBP") {
    const rate = Number(process.env.FX_USD_GBP ?? NaN);
    if (Number.isFinite(rate) && rate > 0) {
      return Number((value * rate).toFixed(2));
    }
  }

  return value;
}

export function normalizeSupplierProduct(
  input: SupplierProductInput,
  options: NormalizationOptions = {},
): NormalizedProduct | null {
  const supplier = String(input.supplier ?? "").trim();
  if (!supplier) return null;

  const rawExternalId = toOptionalString(input.externalId);
  const externalId = rawExternalId ?? String(input.externalId ?? "").trim();
  if (!externalId) return null;

  const fallbackTitle = options.fallbackTitle ?? `${supplier.toUpperCase()} ${externalId}`;
  const rawTitle = input.title ?? fallbackTitle;
  const title = rawTitle ? String(rawTitle).trim() : fallbackTitle;

  const customSlug = toOptionalString(input.slug);
  const slugSource = customSlug ?? (title.length ? title : fallbackTitle);
  const slug = slugify(slugSource) || slugify(`${supplier}-${externalId}`);

  const placeholder = options.placeholderImage ?? DEFAULT_PLACEHOLDER_IMAGE;
  const imageListRaw = collectImages([
    input.image,
    input.gallery ?? [],
  ]);
  const galleryLimit = options.galleryLimit && options.galleryLimit > 0 ? options.galleryLimit : undefined;
  const imageList = galleryLimit ? imageListRaw.slice(0, galleryLimit) : imageListRaw;
  const primaryImage = imageList[0] ?? placeholder;
  const gallery = imageList.filter((entry) => entry !== primaryImage);

  const priceNumber = toOptionalNumber(input.price);
  let createPrice = priceNumber ?? options.defaultPrice ?? null;
  if (createPrice === null) {
    return null;
  }

  const compareAtInputProvided = input.compareAt !== undefined;
  const compareAtNumber = toOptionalNumber(input.compareAt);
  const priceForComparison = priceNumber ?? createPrice;
  let compareAtValue: number | null | undefined;
  if (compareAtInputProvided) {
    if (compareAtNumber === null) {
      compareAtValue = null;
    } else if (compareAtNumber !== undefined && priceForComparison !== null && compareAtNumber > priceForComparison) {
      compareAtValue = compareAtNumber;
    } else if (compareAtNumber !== undefined) {
      compareAtValue = null;
    }
  }

  let costPriceNumber = toOptionalNumber(input.costPrice);
  if (
    costPriceNumber !== undefined &&
    costPriceNumber !== null &&
    options.convertCostToTarget &&
    input.currency
  ) {
    costPriceNumber = convertCurrency(costPriceNumber, input.currency, options.targetCurrency ?? "GBP");
  }

  const stockProvided = input.stock !== undefined;
  const stockNumber = stockProvided ? toOptionalInt(input.stock) ?? null : undefined;

  const tagsProvided = input.tags !== undefined;
  const tags = tagsProvided
    ? Array.from(
        new Set(
          (input.tags ?? [])
            .map((tag) => (tag != null ? String(tag).trim() : ""))
            .filter((tag) => tag.length > 0),
        ),
      )
    : [];

  const descriptionProvided = input.description !== undefined;
  const descriptionValue = descriptionProvided ? toOptionalString(input.description) ?? null : undefined;

  const imageAltProvided = input.imageAlt !== undefined;
  const imageAltValue = imageAltProvided ? toOptionalString(input.imageAlt) ?? null : null;
  const imageAlt = imageAltValue ?? title;

  const supplierSkuProvided = input.supplierSku !== undefined;
  const supplierSkuValue = supplierSkuProvided ? toOptionalString(input.supplierSku) ?? null : undefined;

  const sourceUrlProvided = input.sourceUrl !== undefined;
  const sourceUrlValue = sourceUrlProvided ? toOptionalString(input.sourceUrl) ?? null : undefined;

  const warehouseIdProvided = input.warehouseId !== undefined;
  const warehouseIdValue = warehouseIdProvided ? toOptionalString(input.warehouseId) ?? null : undefined;

  const warehouseCodeProvided = input.warehouseCode !== undefined;
  const warehouseCodeValue = warehouseCodeProvided ? toOptionalString(input.warehouseCode) ?? null : undefined;

  const warehouseNameProvided = input.warehouseName !== undefined;
  const warehouseNameValue = warehouseNameProvided ? toOptionalString(input.warehouseName) ?? null : undefined;

  const categoryIdProvided = input.categoryId !== undefined;
  const categoryIdValue = categoryIdProvided ? toOptionalString(input.categoryId) ?? null : undefined;

  const create: Prisma.ProductUncheckedCreateInput = {
    title,
    slug,
    description: descriptionValue ?? null,
    image: primaryImage,
    imageAlt,
    gallery,
    showInUk: Boolean(input.regionVisibility?.uk),
    showInUs: Boolean(input.regionVisibility?.us),
    tags: tagsProvided ? tags : [],
    supplier,
    externalId,
    price: createPrice,
  };

  if (input.sourcePrice !== undefined) {
    const sp = toOptionalNumber(input.sourcePrice);
    if (sp !== undefined && sp !== null) {
      (create as any).sourcePrice = sp;
      (create as any).sourceCurrency = input.sourceCurrency ?? input.currency ?? null;
    }
  }

  if (stockProvided) create.stock = stockNumber;
  if (supplierSkuProvided) create.supplierSku = supplierSkuValue;
  if (!supplierSkuProvided) create.supplierSku = null;
  if (sourceUrlProvided) create.sourceUrl = sourceUrlValue;
  else create.sourceUrl = null;
  if (warehouseIdProvided) create.warehouseId = warehouseIdValue;
  else create.warehouseId = null;
  if (warehouseCodeProvided) create.warehouseCode = warehouseCodeValue;
  else create.warehouseCode = null;
  if (warehouseNameProvided) create.warehouseName = warehouseNameValue;
  else create.warehouseName = null;
  if (categoryIdProvided) create.categoryId = categoryIdValue;
  if (input.variants !== undefined) {
    create.variants =
      input.variants === null
        ? Prisma.JsonNull
        : (input.variants as unknown as Prisma.InputJsonValue);
  }
  if (costPriceNumber !== undefined) create.costPrice = costPriceNumber;
  if (compareAtValue !== undefined) create.compareAt = compareAtValue;

  const update: Prisma.ProductUncheckedUpdateInput = {
    slug,
    showInUk: Boolean(input.regionVisibility?.uk),
    showInUs: Boolean(input.regionVisibility?.us),
    supplier,
    externalId,
  };

  if (!options.preserveTitleOnUpdate) {
    update.title = title;
  }

  if (!options.preserveImagesOnUpdate) {
    update.image = primaryImage;
    update.imageAlt = imageAlt;
    update.gallery = gallery;
  }

  if (descriptionProvided && !options.preserveDescriptionOnUpdate) {
    update.description = descriptionValue;
  }

  if (tagsProvided) update.tags = tags;
  if (stockProvided) update.stock = stockNumber;
  if (supplierSkuProvided && !options.preserveSupplierSkuOnUpdate) {
    update.supplierSku = supplierSkuValue;
  }
  if (sourceUrlProvided) update.sourceUrl = sourceUrlValue;
  if (warehouseIdProvided) update.warehouseId = warehouseIdValue;
  if (warehouseCodeProvided) update.warehouseCode = warehouseCodeValue;
  if (warehouseNameProvided) update.warehouseName = warehouseNameValue;
  if (categoryIdProvided) update.categoryId = categoryIdValue;
  if (input.variants !== undefined) {
    update.variants =
      input.variants === null
        ? Prisma.JsonNull
        : (input.variants as unknown as Prisma.InputJsonValue);
  }
  if (!options.preservePriceOnUpdate) {
    update.price = priceNumber ?? createPrice;
  }
  if (costPriceNumber !== undefined) {
    update.costPrice = costPriceNumber;
  }
  if (compareAtValue !== undefined) {
    update.compareAt = compareAtValue;
  }

  if (input.passthrough) {
    const createExtras = create as Record<string, unknown>;
    const updateExtras = update as Record<string, unknown>;
    for (const [key, value] of Object.entries(input.passthrough)) {
      if (value !== undefined) {
        createExtras[key] = value;
        updateExtras[key] = value;
      }
    }
  }

  return {
    externalId,
    supplier,
    create,
    update,
    primaryImage,
    gallery,
    tags: tagsProvided ? tags : [],
  };
}

export { DEFAULT_PLACEHOLDER_IMAGE };
