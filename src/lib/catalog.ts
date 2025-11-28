import type { Region } from "@/content/regions";
import { prisma } from "@/lib/db";
import { BASE_PRODUCTS } from "@/content/products";

type CatalogProduct = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt?: number | null;
  image: string;
  imageAlt?: string | null;
  categoryId?: string | null;
  tags?: string[];
};

function isVisible(region: Region, showInUk: boolean, showInUs: boolean) {
  return (region === "uk" && showInUk) || (region === "us" && showInUs);
}

export async function getProductsForRegion(region: Region): Promise<CatalogProduct[]> {
  const mapSeedProducts = () =>
    BASE_PRODUCTS.filter((p) => !p.regions || p.regions.includes(region)).map((p) => ({
      id: p.id,
      title: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      image: p.image,
      imageAlt: p.name,
      tags: p.badges ?? [],
      compareAt: null,
      categoryId: null,
    }));

  try {
    const products = await prisma.product.findMany({
      where: region === "uk" ? { showInUk: true } : { showInUs: true },
      orderBy: { updatedAt: "desc" },
    });

    if (products.length === 0) {
      return mapSeedProducts();
    }

    return products
      .filter((p) => isVisible(region, p.showInUk, p.showInUs))
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        compareAt: p.compareAt ? Number(p.compareAt) : null,
        image: p.image,
        imageAlt: p.imageAlt,
        categoryId: p.categoryId,
        tags: p.tags ?? [],
      }));
  } catch (error) {
    console.warn("Falling back to seed catalog after Prisma error", error);
    return mapSeedProducts();
  }
}
