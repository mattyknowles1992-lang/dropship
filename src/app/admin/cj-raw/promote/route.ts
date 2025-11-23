import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";
import { importCjProducts } from "@/lib/importers/cj";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return NextResponse.redirect(new URL("/admin/cj-raw?error=missing-id", request.url));
  }

  const raw = await prisma.rawCjProduct.findUnique({
    where: { id },
  });

  if (!raw) {
    return NextResponse.redirect(new URL("/admin/cj-raw?error=not-found", request.url));
  }

  const data = raw.data as any;
  const source = (data?.original as any) ?? data;
  const region: Region = (data?._region as Region) ?? "uk";

  if (!source || typeof source !== "object") {
    return NextResponse.redirect(new URL("/admin/cj-raw?error=bad-data", request.url));
  }

  await importCjProducts(region, [source]);

  return NextResponse.redirect(new URL("/admin/cj-raw?promoted=1", request.url));
}

