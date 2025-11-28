import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true;
  const header = request.headers.get("x-admin-token");
  return header === token;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    groupId?: string;
    productId?: string;
  };

  if (!body.groupId || !body.productId) {
    return NextResponse.json(
      { error: "groupId and productId are required" },
      { status: 400 },
    );
  }

  const item = await prisma.productGroupItem.upsert({
    where: {
      groupId_productId: {
        groupId: body.groupId,
        productId: body.productId,
      },
    },
    update: {},
    create: {
      groupId: body.groupId,
      productId: body.productId,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const groupId = url.searchParams.get("groupId");
  const productId = url.searchParams.get("productId");

  if (!groupId || !productId) {
    return NextResponse.json(
      { error: "groupId and productId are required" },
      { status: 400 },
    );
  }

  await prisma.productGroupItem.deleteMany({
    where: { groupId, productId },
  });

  return NextResponse.json({ success: true });
}

