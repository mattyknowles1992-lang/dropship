import { prisma } from "@/lib/db";
import { BASE_PRODUCTS } from "@/content/products";
import type { BundleOption } from "@/lib/bundles";

export type ProductDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  image: string;
  imageAlt: string | null;
  gallery: string[];
  tags: string[];
  pages: string[];
  shippingUk: number | null;
  shippingUs: number | null;
  supplier: string | null;
  sourceUrl: string | null;
  bundleOptions: BundleOption[];
  createdAt: Date;
  updatedAt: Date;
};

function mapBundleOptions(product: {
  groupItems: Array<{
    group: {
      id: string;
      name: string;
      rules: Array<{
        id: string;
        name: string | null;
        minQuantity: number;
        bundlePrice: unknown;
      }>;
    };
  }>;
}) {
  const options: BundleOption[] = [];

  for (const item of product.groupItems) {
    if (!item.group) continue;
    for (const rule of item.group.rules ?? []) {
      const priceNumber = Number(rule.bundlePrice);
      if (!Number.isFinite(priceNumber)) continue;
      const key = `${item.group.id}:${rule.id}`;
      options.push({
        key,
        groupId: item.group.id,
        ruleId: rule.id,
        minQuantity: rule.minQuantity,
        bundlePrice: priceNumber,
        name: rule.name ?? item.group.name ?? "Bundle",
      });
    }
  }

  return options;
}

function fromSeedProduct(slug: string): ProductDetail | null {
  const match = BASE_PRODUCTS.find((product) => product.slug === slug);
  if (!match) return null;

  return {
    id: match.id,
    title: match.name,
    slug: match.slug,
    description: match.description,
    price: match.price,
    compareAt: null,
    image: match.image,
    imageAlt: match.name,
    gallery: [],
    tags: match.badges ?? [],
    pages: match.pages ?? [],
    shippingUk: null,
    shippingUs: null,
    supplier: match.source?.supplier ?? null,
    sourceUrl: match.source?.url ?? null,
    bundleOptions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        groupItems: {
          include: {
            group: {
              include: {
                rules: {
                  orderBy: { minQuantity: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return fromSeedProduct(slug);
    }

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAt: product.compareAt ? Number(product.compareAt) : null,
      image: product.image,
      imageAlt: product.imageAlt,
      gallery: product.gallery ?? [],
      tags: product.tags ?? [],
      pages: product.pages ?? [],
      shippingUk: product.shippingUk ? Number(product.shippingUk) : null,
      shippingUs: product.shippingUs ? Number(product.shippingUs) : null,
      supplier: product.supplier ?? null,
      sourceUrl: product.sourceUrl ?? null,
      bundleOptions: mapBundleOptions(product),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  } catch (error) {
    console.warn("Falling back to seed product after Prisma error", error);
    return fromSeedProduct(slug);
  }
}
