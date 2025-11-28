import { NextResponse } from "next/server";
import { syncCjProducts } from "@/lib/importers/cj";

function assertAdminAuth(request: Request) {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    throw new Error("ADMIN_API_TOKEN is not set");
  }

  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || token !== expected) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      pageSize?: number;
      maxPages?: number;
      countryCodes?: string[];
      excludeCategoryIds?: string[];
      startInventory?: number;
    };

    const summary = await syncCjProducts({
      pageSize: body.pageSize,
      maxPages: body.maxPages,
      countryCodes: body.countryCodes,
      excludeCategoryIds: body.excludeCategoryIds,
      startInventory: body.startInventory,
    });

    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    console.error("CJ sync failed", error);
    return NextResponse.json(
      { error: "CJ sync failed" },
      { status: 500 },
    );
  }
}
