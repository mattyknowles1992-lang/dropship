import { NextResponse } from "next/server";
import type { Region } from "@/content/regions";
import { importAeProducts, fetchAeFeedAll } from "@/lib/importers/aliexpress";

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
    };

    const region: Region = body.region ?? "uk";

    let feed: any[] = [];

    if (Array.isArray(body.products) && body.products.length > 0) {
      feed = body.products as any[];
    } else {
      const fetched = await fetchAeFeedAll({
        page: body.page,
        pageSize: body.pageSize,
      });
      feed = fetched;
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

