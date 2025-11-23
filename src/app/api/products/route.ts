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

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(products);
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

    const created = await prisma.product.create({
      data: {
        title: body.title.trim(),
        slug: slugBase,
        description: body.description ?? null,
        image: body.image ?? "/uploads/placeholder.jpg",
        imageAlt: body.title.trim(),
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
