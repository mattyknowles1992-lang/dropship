import { NextResponse } from "next/server";
import type { Region } from "@/content/regions";
import { importCjProducts, fetchCjFeedAll } from "@/lib/importers/cj";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true; // No token configured = allow for now.
  const header = request.headers.get("x-admin-token");
  return header === token;
}

type ImportOptions = {
  region?: Region;
  pageSize?: number;
  pages?: number;
  startPage?: number;
  throttleMs?: number;
  categoryId?: string;
  countryCode?: string;
  keyWord?: string;
  startSellPrice?: number;
  endSellPrice?: number;
};

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.CJ_API_TOKEN) {
    return NextResponse.json({ error: "CJ_API_TOKEN is not set" }, { status: 500 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as ImportOptions;
    const region: Region = body.region ?? "uk";

    const pageSize = body.pageSize && body.pageSize > 0 ? body.pageSize : 20;
    const pages = body.pages && body.pages > 0 ? body.pages : 5;
    const startPage = body.startPage && body.startPage > 0 ? body.startPage : 1;
    const throttleMs = body.throttleMs && body.throttleMs > 0 ? body.throttleMs : 3000;

    const feed = await fetchCjFeedAll({
      pageSize,
      maxPages: pages,
      startPage,
      throttleMs,
      categoryId: body.categoryId,
      countryCode: body.countryCode,
      keyWord: body.keyWord,
      startSellPrice: body.startSellPrice,
      endSellPrice: body.endSellPrice,
    });

    const result = await importCjProducts(region, feed);
    return NextResponse.json({
      imported: result.imported,
      region,
      sourceCount: feed.length,
      startPage,
      pages,
      pageSize,
      throttleMs,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "CJ slow import failed";
    const isRateLimited = message.includes("429") || message.toLowerCase().includes("too many requests");
    console.error("CJ slow import failed", message);
    return NextResponse.json(
      {
        error: isRateLimited ? "CJ rate limit hit (1 req/sec). Retry after a pause." : "CJ slow import failed",
        detail: message,
      },
      { status: isRateLimited ? 429 : 500 },
    );
  }
}
