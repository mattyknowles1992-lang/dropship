import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";

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

  // Legacy CJ promote flow depended on the old importCjProducts helper. That
  // path has been replaced by the listV2-based sync in /api/admin/cj-sync.
  return NextResponse.redirect(new URL("/admin/cj-raw?error=deprecated", request.url));
}

