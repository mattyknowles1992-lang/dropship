import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true;
  const header = request.headers.get("x-admin-token");
  return header === token;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const params = url.searchParams;

  const takeParam = Number(params.get("limit") ?? "50");
  const skipParam = Number(params.get("offset") ?? "0");

  const take = Number.isFinite(takeParam) && takeParam > 0 ? takeParam : 50;
  const skip = Number.isFinite(skipParam) && skipParam >= 0 ? skipParam : 0;

  const rows = await prisma.rawCjProduct.findMany({
    orderBy: { lastSeenAt: "desc" },
    take,
    skip,
  });

  return NextResponse.json(rows);
}

