import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";
import { importCjProducts } from "@/lib/importers/cj";

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
      id?: string;
      region?: Region;
      overrides?: Record<string, unknown>;
    };

    const id = body.id;
    if (!id) {
      return NextResponse.json(
        { error: "Missing RawCjProduct id" },
        { status: 400 },
      );
    }

    const raw = await prisma.rawCjProduct.findUnique({
      where: { id },
    });

    if (!raw) {
      return NextResponse.json(
        { error: "RawCjProduct not found" },
        { status: 404 },
      );
    }

    const data = raw.data as any;
    const source = (data?.original as any) ?? data;

    if (!source || typeof source !== "object") {
      return NextResponse.json(
        { error: "Raw CJ data is not in the expected format" },
        { status: 500 },
      );
    }

    const region: Region = body.region ?? (data?._region as Region) ?? "uk";
    const overrides = body.overrides ?? {};

    const feedItem = { ...source, ...overrides };

    const result = await importCjProducts(region, [feedItem]);

    return NextResponse.json({
      promoted: result.imported,
      region,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "CJ promote failed";
    console.error("CJ promote failed", message);
    return NextResponse.json(
      { error: "CJ promote failed", detail: message },
      { status: 500 },
    );
  }
}

