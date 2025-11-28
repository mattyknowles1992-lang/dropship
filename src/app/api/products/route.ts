import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function toDecimal(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toInt(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isInteger(n) ? n : null;
  }
  return null;
}

function toStringArray(value: unknown) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const items = value
      .map((entry) => (typeof entry === "string" ? entry.trim() : String(entry).trim()))
      .filter((entry) => entry.length > 0);
    return items.length ? items : [];
  }
  if (typeof value === "string") {
    const items = value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    return items.length ? items : [];
  }
  return null;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("/api/products GET failed", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string | null;
      image?: string;
      price?: number | string;
      compareAt?: number | string | null;
      costPrice?: number | string | null;
      shippingUk?: number | string | null;
      shippingUs?: number | string | null;
      stock?: number | string | null;
      supplier?: string | null;
      externalId?: string | null;
      warehouseId?: string | null;
      warehouseCode?: string | null;
      warehouseName?: string | null;
      showInUk?: boolean;
      showInUs?: boolean;
      categoryId?: string | null;
      tags?: string[] | string | null;
      gallery?: string[] | string | null;
    };

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    const slugBase = slugify(body.title);

    const price = toDecimal(body.price);
    if (price === null) {
      return NextResponse.json(
        { error: "Price is required and must be a number" },
        { status: 400 },
      );
    }

    const tags =
      Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
          ? body.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

    const rawGallery = toStringArray(body.gallery) ?? [];
    const defaultImage = "/products/santa-hat-model-1.jpg";
    const providedImage =
      typeof body.image === "string" && body.image.trim().length > 0
        ? body.image.trim()
        : null;
    const primaryImage = providedImage ?? rawGallery[0] ?? defaultImage;
    const gallery = Array.from(
      new Set(rawGallery.filter((entry) => entry !== primaryImage)),
    );

    const created = await prisma.product.create({
      data: {
        title: body.title.trim(),
        slug: slugBase,
        description: body.description ?? null,
        image: primaryImage,
        imageAlt: body.title.trim(),
        gallery,
        price,
        compareAt: toDecimal(body.compareAt),
        costPrice: toDecimal(body.costPrice),
        shippingUk: toDecimal(body.shippingUk),
        shippingUs: toDecimal(body.shippingUs),
        stock: toInt(body.stock),
        supplier: body.supplier ?? null,
        externalId: body.externalId ?? null,
        warehouseId: body.warehouseId ?? null,
        warehouseCode: body.warehouseCode ?? null,
        warehouseName: body.warehouseName ?? null,
        showInUk: body.showInUk ?? false,
        showInUs: body.showInUs ?? false,
        categoryId:
          typeof body.categoryId === "string" ? body.categoryId : null,
        tags,
        // CJ passthrough fields (optional on manual create)
        cjSellPrice: toDecimal((body as any).cjSellPrice),
        cjNowPrice: toDecimal((body as any).cjNowPrice),
        cjDiscountPrice: toDecimal((body as any).cjDiscountPrice),
        // Stored as string in Prisma schema, so normalise to string/null
        cjSuggestSellPrice:
          (body as any).cjSuggestSellPrice != null
            ? String((body as any).cjSuggestSellPrice)
            : null,
        cjCurrency: (body as any).cjCurrency ?? null,
        cjProductName: (body as any).cjProductName ?? null,
        cjProductNameEn: (body as any).cjProductNameEn ?? null,
        cjSku: (body as any).cjSku ?? null,
        cjSpu: (body as any).cjSpu ?? null,
        cjCategoryId: (body as any).cjCategoryId ?? null,
        cjCategoryName: (body as any).cjCategoryName ?? null,
        cjProductType: (body as any).cjProductType ?? null,
        cjProductUnit: (body as any).cjProductUnit ?? null,
        cjProductWeight: toDecimal((body as any).cjProductWeight),
        cjDescription: (body as any).cjDescription ?? null,
        cjMaterial: (body as any).cjMaterial ?? null,
        cjPacking: (body as any).cjPacking ?? null,
        cjProductKey: (body as any).cjProductKey ?? null,
        cjLogisticsProps: (body as any).cjLogisticsProps ?? undefined,
        cjVideo: Array.isArray((body as any).cjVideo)
          ? (body as any).cjVideo
          : undefined,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating product", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      image?: string;
      description?: string | null;
      tags?: string[] | string | null;
      price?: number | string;
      compareAt?: number | string | null;
      costPrice?: number | string | null;
      shippingUk?: number | string | null;
      shippingUs?: number | string | null;
      stock?: number | string | null;
      supplier?: string | null;
      externalId?: string | null;
      warehouseId?: string | null;
      warehouseCode?: string | null;
      warehouseName?: string | null;
      title?: string;
      showInUk?: boolean;
      showInUs?: boolean;
      categoryId?: string | null;
      // CJ passthrough fields
      cjSellPrice?: number | string | null;
      cjNowPrice?: number | string | null;
      cjDiscountPrice?: number | string | null;
      cjSuggestSellPrice?: number | string | null;
      cjCurrency?: string | null;
      cjProductName?: string | null;
      cjProductNameEn?: string | null;
      cjSku?: string | null;
      cjSpu?: string | null;
      cjCategoryId?: string | null;
      cjCategoryName?: string | null;
      cjProductType?: string | null;
      cjProductUnit?: string | null;
      cjProductWeight?: number | string | null;
      cjDescription?: string | null;
      cjMaterial?: string | null;
      cjPacking?: string | null;
      cjProductKey?: string | null;
      cjLogisticsProps?: unknown;
      cjVideo?: string[] | null;
      gallery?: string[] | string | null;
    };

    if (!body.id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {};

    if (typeof body.image === "string") data.image = body.image.trim();
    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.description === "string") {
      data.description = body.description.trim();
    }
    if (body.description === null) {
      data.description = null;
    }
    if (typeof body.showInUk === "boolean") data.showInUk = body.showInUk;
    if (typeof body.showInUs === "boolean") data.showInUs = body.showInUs;
    if (body.categoryId === null) data.categoryId = null;
    if (typeof body.categoryId === "string") data.categoryId = body.categoryId;

    const price = toDecimal(body.price);
    if (price !== null) data.price = price;

    const compareAt = toDecimal(body.compareAt);
    if (compareAt !== null) data.compareAt = compareAt;

    const costPrice = toDecimal(body.costPrice);
    if (costPrice !== null) data.costPrice = costPrice;

    const shippingUk = toDecimal(body.shippingUk);
    if (shippingUk !== null) data.shippingUk = shippingUk;

    const shippingUs = toDecimal(body.shippingUs);
    if (shippingUs !== null) data.shippingUs = shippingUs;

    const stock = toInt(body.stock);
    if (stock !== null) data.stock = stock;

    if (typeof body.supplier === "string" || body.supplier === null) {
      data.supplier = body.supplier;
    }
    if (typeof body.externalId === "string" || body.externalId === null) {
      data.externalId = body.externalId;
    }
    if (typeof body.warehouseId === "string" || body.warehouseId === null) {
      data.warehouseId = body.warehouseId;
    }
    if (
      typeof body.warehouseCode === "string" ||
      body.warehouseCode === null
    ) {
      data.warehouseCode = body.warehouseCode;
    }
    if (
      typeof body.warehouseName === "string" ||
      body.warehouseName === null
    ) {
      data.warehouseName = body.warehouseName;
    }

    if (Array.isArray(body.tags)) {
      data.tags = body.tags;
    } else if (typeof body.tags === "string") {
      const parts = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      data.tags = parts;
    } else if (body.tags === null) {
      data.tags = [];
    }

    const galleryPatch = toStringArray(body.gallery);
    if (galleryPatch !== null) {
      const sanitisedGallery: string[] = [];
      for (const entry of galleryPatch) {
        const trimmed = entry.trim();
        if (trimmed.length > 0 && !sanitisedGallery.includes(trimmed)) {
          sanitisedGallery.push(trimmed);
        }
      }
      data.gallery = sanitisedGallery;
    } else if (body.gallery === null) {
      data.gallery = [];
    }

    // CJ passthrough setters
    const cjSellPrice = toDecimal(body.cjSellPrice as any);
    if (cjSellPrice !== null) data.cjSellPrice = cjSellPrice;
    const cjNowPrice = toDecimal(body.cjNowPrice as any);
    if (cjNowPrice !== null) data.cjNowPrice = cjNowPrice;
    const cjDiscountPrice = toDecimal(body.cjDiscountPrice as any);
    if (cjDiscountPrice !== null) data.cjDiscountPrice = cjDiscountPrice;
    const cjSuggestSellPrice = toDecimal(body.cjSuggestSellPrice as any);
    if (cjSuggestSellPrice !== null)
      data.cjSuggestSellPrice = cjSuggestSellPrice;
    if (typeof body.cjCurrency === "string" || body.cjCurrency === null) {
      data.cjCurrency = body.cjCurrency;
    }
    if (
      typeof body.cjProductName === "string" ||
      body.cjProductName === null
    ) {
      data.cjProductName = body.cjProductName;
    }
    if (
      typeof body.cjProductNameEn === "string" ||
      body.cjProductNameEn === null
    ) {
      data.cjProductNameEn = body.cjProductNameEn;
    }
    if (typeof body.cjSku === "string" || body.cjSku === null) {
      data.cjSku = body.cjSku;
    }
    if (typeof body.cjSpu === "string" || body.cjSpu === null) {
      data.cjSpu = body.cjSpu;
    }
    if (typeof body.cjCategoryId === "string" || body.cjCategoryId === null) {
      data.cjCategoryId = body.cjCategoryId;
    }
    if (
      typeof body.cjCategoryName === "string" ||
      body.cjCategoryName === null
    ) {
      data.cjCategoryName = body.cjCategoryName;
    }
    if (
      typeof body.cjProductType === "string" ||
      body.cjProductType === null
    ) {
      data.cjProductType = body.cjProductType;
    }
    if (
      typeof body.cjProductUnit === "string" ||
      body.cjProductUnit === null
    ) {
      data.cjProductUnit = body.cjProductUnit;
    }
    const cjProductWeight = toDecimal(body.cjProductWeight as any);
    if (cjProductWeight !== null) data.cjProductWeight = cjProductWeight;
    if (typeof body.cjDescription === "string" || body.cjDescription === null) {
      data.cjDescription = body.cjDescription;
    }
    if (typeof body.cjMaterial === "string" || body.cjMaterial === null) {
      data.cjMaterial = body.cjMaterial;
    }
    if (typeof body.cjPacking === "string" || body.cjPacking === null) {
      data.cjPacking = body.cjPacking;
    }
    if (typeof body.cjProductKey === "string" || body.cjProductKey === null) {
      data.cjProductKey = body.cjProductKey;
    }
    if (body.cjLogisticsProps !== undefined) {
      data.cjLogisticsProps = body.cjLogisticsProps;
    }
    if (Array.isArray(body.cjVideo)) data.cjVideo = body.cjVideo;
    if (body.cjVideo === null) data.cjVideo = [];

    const product = await prisma.product.update({
      where: { id: body.id },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}
