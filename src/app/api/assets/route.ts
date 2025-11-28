import { NextResponse } from "next/server";
import type { AssetKeys } from "@/content/assets";
import { prisma } from "@/lib/db";
import { getAssets } from "@/lib/assets";

function isAssetKey(value: unknown): value is AssetKeys {
  return value === "logo" || value === "heroPrimary" || value === "heroSecondary";
}

export async function GET() {
  const assets = await getAssets();
  return NextResponse.json(assets);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      key?: unknown;
      path?: unknown;
    };

    if (!isAssetKey(body.key)) {
      return NextResponse.json({ error: "Invalid asset key" }, { status: 400 });
    }

    if (typeof body.path !== "string" || body.path.trim().length === 0) {
      return NextResponse.json({ error: "Image path is required" }, { status: 400 });
    }

    const sanitizedPath = body.path.trim();

    const asset = await prisma.asset.upsert({
      where: { key: body.key },
      create: { key: body.key, path: sanitizedPath },
      update: { path: sanitizedPath },
    });

    return NextResponse.json({ key: asset.key, path: asset.path });
  } catch (error) {
    console.error("Error saving asset", error);
    return NextResponse.json({ error: "Failed to save asset" }, { status: 500 });
  }
}
