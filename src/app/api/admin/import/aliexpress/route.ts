import { NextResponse } from "next/server";
import type { Region } from "@/content/regions";
import {
  importAeProducts,
  fetchAeFeedAll,
  type AeApiProduct,
} from "@/lib/importers/aliexpress";

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

  try {
    const body = (await request.json().catch(() => ({}))) as {
      region?: Region;
      products?: unknown;
      page?: number;
      pageSize?: number;
      dryRun?: boolean;
    };

    const region: Region = body.region ?? "uk";
    const dryRun = body.dryRun ?? false;

    let feed: AeApiProduct[] = [];

    if (Array.isArray(body.products) && body.products.length > 0) {
      feed = body.products.filter(isAeApiProductPayload);
    } else {
      const fetched = await fetchAeFeedAll({
        page: body.page,
        pageSize: body.pageSize,
      });
      feed = fetched;
    }

    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        region,
        sourceCount: feed.length,
        sample: feed.slice(0, 5),
      });
    }

    const result = await importAeProducts(region, feed);

    return NextResponse.json({
      imported: result.imported,
      region,
      sourceCount: feed.length,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "AliExpress import failed";
    console.error("AliExpress import failed", message);
    return NextResponse.json(
      { error: "AliExpress import failed", detail: message },
      { status: 500 },
    );
  }
}

function isAeApiProductPayload(value: unknown): value is AeApiProduct {
  return !!value && typeof value === "object";
}

