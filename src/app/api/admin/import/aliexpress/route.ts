import { NextResponse } from "next/server";
import type { Region } from "@/content/regions";
import { importAliProducts, type AliProductInput } from "@/lib/importers/aliexpress";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true; // allow if not configured
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
      products?: AliProductInput[];
    };

    const region: Region = body.region ?? "uk";
    const feed = Array.isArray(body.products) ? body.products : [];

    if (feed.length === 0) {
      return NextResponse.json({ error: "products array is required" }, { status: 400 });
    }

    const result = await importAliProducts(region, feed);
    return NextResponse.json({ imported: result.imported, region, sourceCount: feed.length });
  } catch (error) {
    console.error("AliExpress import failed", error);
    return NextResponse.json({ error: "AliExpress import failed" }, { status: 500 });
  }
}
