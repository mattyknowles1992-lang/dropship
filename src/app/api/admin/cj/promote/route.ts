import { NextResponse } from "next/server";
import type { Region } from "@/content/regions";

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
    region?: Region;
    overrides?: Record<string, unknown>;
  };

  const region: Region = body.region ?? "uk";
  const overrides = body.overrides ?? {};

  return NextResponse.json(
    {
      error: "CJ promote endpoint is deprecated. Edit products directly instead.",
      region,
      overrides,
    },
    { status: 410 },
  );
}

