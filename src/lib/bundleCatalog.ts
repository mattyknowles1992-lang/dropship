import { Prisma } from "@prisma/client";
import type { Region } from "@/content/regions";
import { prisma } from "@/lib/db";
import { getBundleOptionForKey, type BundleKey } from "@/lib/bundles";

type BundleCatalogProduct = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  image: string;
  imageAlt: string;
  tags: string[];
};

export async function getProductsForBundle(region: Region, bundleKey: BundleKey): Promise<BundleCatalogProduct[]> {
  const option = getBundleOptionForKey(bundleKey, region);
  if (!option) {
    return [];
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(region === "uk" ? { showInUk: true } : { showInUs: true }),
        groupItems: {
          some: {
            group: {
              rules: {
                some: {
                  minQuantity: option.minQuantity,
                  bundlePrice: new Prisma.Decimal(option.bundlePrice),
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAt: product.compareAt ? Number(product.compareAt) : null,
      image: product.image,
      imageAlt: product.imageAlt ?? product.title,
      tags: product.tags ?? [],
    }));
  } catch (error) {
    console.warn("getProductsForBundle: Prisma unavailable, returning empty bundle set", error);
    return [];
  }
}
