import { NextResponse } from "next/server";
import type { Region } from "@/content/regions";
import { importCjProducts, fetchCjFeedAll } from "@/lib/importers/cj";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true; // No token configured = allow for now.
  const header = request.headers.get("x-admin-token");
  return header === token;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.CJ_API_TOKEN) {
    return NextResponse.json({ error: "CJ_API_TOKEN is not set" }, { status: 500 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      region?: Region;
      products?: unknown;
      pageSize?: number;
      maxPages?: number;
      throttleMs?: number;
      startPage?: number;
    };

    const region: Region = body.region ?? "uk";
    const feed =
      Array.isArray(body.products) && body.products.length > 0
        ? (body.products as any[])
        : await fetchCjFeedAll({
            pageSize: body.pageSize,
            maxPages: body.maxPages,
            throttleMs: body.throttleMs,
            startPage: body.startPage,
          });

    const result = await importCjProducts(region, feed);
    return NextResponse.json({ imported: result.imported, region, sourceCount: feed.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "CJ import failed";
    const isRateLimited = message.includes("429") || message.toLowerCase().includes("too many requests");
    console.error("CJ import failed", message);
    return NextResponse.json(
      { error: isRateLimited ? "CJ rate limit hit (1 req/sec). Retry in a second." : "CJ import failed", detail: message },
      { status: isRateLimited ? 429 : 500 },
    );
  }
}
