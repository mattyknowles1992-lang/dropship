import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncCjVariantsForProduct } from "@/lib/importers/cj";

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

  const results: Array<{
    productId: string;
    variantCount?: number;
    totalStock?: number;
    error?: string;
  }> = [];

  for (const product of products) {
    try {
      const result = await syncCjVariantsForProduct(product as { id: string; externalId: string });
      results.push({
        productId: product.id,
        variantCount: result.variantCount,
        totalStock: result.totalStock,
      });
    } catch (error) {
      console.error(`Failed to sync variants for product ${product.id}`, error);
      results.push({
        productId: product.id,
        error: error instanceof Error ? error.message : "Sync failed",
      });
    }
  }

  return NextResponse.json({
    processed: products.length,
    synced: results.filter((r) => !r.error).length,
    results,
  });
}
