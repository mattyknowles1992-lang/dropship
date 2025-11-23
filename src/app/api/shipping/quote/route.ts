import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    countryCode?: string;
    postCode?: string;
    province?: string;
    city?: string;
    items?: { vid: string; quantity: number; weight?: number }[];
    vid?: string;
    quantity?: number;
    weight?: number;
  };

  const countryCode = body.countryCode?.toUpperCase();

  const items =
    Array.isArray(body.items) && body.items.length > 0
      ? body.items
      : body.vid
        ? [{ vid: body.vid, quantity: body.quantity && body.quantity > 0 ? body.quantity : 1, weight: body.weight }]
        : [];

  if (!countryCode) {
    return NextResponse.json({ error: "countryCode is required" }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "At least one item (vid + quantity) is required" }, { status: 400 });
  }

  // Freight calculation via CJ is temporarily disabled while the importer
  // focuses on catalog sync. This endpoint is kept as a stub so the build
  // succeeds and callers get a clear message.
  return NextResponse.json(
    {
      error: "CJ freight quote API is currently disabled",
    },
    { status: 503 },
  );
}
