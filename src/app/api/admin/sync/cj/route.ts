import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true; // Allow if not configured.
  const header = request.headers.get("x-admin-token");
  return header === token;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    productIds?: string[];
    limit?: number;
  };

  const where = {
    supplier: "cjdropshipping",
    externalId: { not: null },
    ...(Array.isArray(body.productIds) && body.productIds.length > 0
      ? { id: { in: body.productIds } }
      : {}),
  };

  const products = await prisma.product.findMany({
    where,
    select: { id: true, externalId: true },
    take: body.limit && body.limit > 0 ? body.limit : undefined,
  });

  // Variant-level sync via CJ is temporarily disabled while we stabilise the
  // main product catalog importer. This endpoint now reports what it *would*
  // act on without making external CJ calls.
  return NextResponse.json({
    processed: products.length,
    message: "CJ variant sync is currently disabled; no external calls were made.",
    productIds: products.map((p) => p.id),
  });
}
