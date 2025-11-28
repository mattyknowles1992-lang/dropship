import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("/api/categories GET failed", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
