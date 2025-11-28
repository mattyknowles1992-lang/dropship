import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true;
  const header = request.headers.get("x-admin-token");
  return header === token;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groups = await prisma.productGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      rules: true,
      items: {
        select: {
          id: true,
          productId: true,
          product: {
            select: {
              title: true,
              slug: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    description?: string;
    minQuantity?: number;
    bundlePrice?: number;
  };

  if (!body.name) {
    return NextResponse.json(
      { error: "Group name is required" },
      { status: 400 },
    );
  }

  const minQuantity =
    typeof body.minQuantity === "number" && body.minQuantity > 0
      ? body.minQuantity
      : 3;
  const bundlePrice =
    typeof body.bundlePrice === "number" && body.bundlePrice > 0
      ? body.bundlePrice
      : 20;

  const created = await prisma.productGroup.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      rules: {
        create: {
          name: "Default",
          minQuantity,
          bundlePrice,
        },
      },
    },
    include: {
      rules: true,
      items: true,
    },
  });

  return NextResponse.json(created);
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    name?: string;
    description?: string;
    minQuantity?: number;
    bundlePrice?: number;
  };

  if (!body.id) {
    return NextResponse.json(
      { error: "Group id is required" },
      { status: 400 },
    );
  }

  const group = await prisma.productGroup.update({
    where: { id: body.id },
    data: {
      name: body.name ?? undefined,
      description: body.description ?? undefined,
    },
  });

  if (body.minQuantity || body.bundlePrice) {
    const existingRule = await prisma.productGroupRule.findFirst({
      where: { groupId: group.id },
      orderBy: { createdAt: "asc" },
    });

    if (existingRule) {
      await prisma.productGroupRule.update({
        where: { id: existingRule.id },
        data: {
          minQuantity:
            typeof body.minQuantity === "number" && body.minQuantity > 0
              ? body.minQuantity
              : existingRule.minQuantity,
          bundlePrice:
            typeof body.bundlePrice === "number" && body.bundlePrice > 0
              ? body.bundlePrice
              : existingRule.bundlePrice,
        },
      });
    }
  }

  const full = await prisma.productGroup.findUnique({
    where: { id: group.id },
    include: {
      rules: true,
      items: {
        select: {
          id: true,
          productId: true,
          product: {
            select: { title: true, slug: true, price: true },
          },
        },
      },
    },
  });

  return NextResponse.json(full);
}

