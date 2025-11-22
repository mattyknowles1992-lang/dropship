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

  try {
    const body = (await request.json().catch(() => ({}))) as {
      region?: Region;
      products?: unknown;
    };

    const region: Region = body.region ?? "uk";
    const feed =
      Array.isArray(body.products) && body.products.length > 0
        ? (body.products as any[])
        : await fetchCjFeedAll({
            pageSize: body.pageSize,
            maxPages: body.maxPages,
          });

    const result = await importCjProducts(region, feed);
    return NextResponse.json({ imported: result.imported, region, sourceCount: feed.length });
  } catch (error) {
    console.error("CJ import failed", error);
    return NextResponse.json({ error: "CJ import failed" }, { status: 500 });
  }
}
