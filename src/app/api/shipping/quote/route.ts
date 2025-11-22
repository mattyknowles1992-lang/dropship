import { NextResponse } from "next/server";
import { calculateCjFreightQuote } from "@/lib/importers/cj";

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

  try {
    const result = await calculateCjFreightQuote({
      countryCode,
      postCode: body.postCode,
      province: body.province,
      city: body.city,
      items,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to calculate CJ freight", error);
    return NextResponse.json({ error: "Failed to calculate freight" }, { status: 500 });
  }
}
