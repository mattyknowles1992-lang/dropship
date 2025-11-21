import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(products);
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      image?: string;
      title?: string;
      showInUk?: boolean;
      showInUs?: boolean;
      categoryId?: string | null;
    };

    if (!body.id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (typeof body.image === "string") data.image = body.image.trim();
    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.showInUk === "boolean") data.showInUk = body.showInUk;
    if (typeof body.showInUs === "boolean") data.showInUs = body.showInUs;
    if (body.categoryId === null) data.categoryId = null;
    if (typeof body.categoryId === "string") data.categoryId = body.categoryId;

    const product = await prisma.product.update({
      where: { id: body.id },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
