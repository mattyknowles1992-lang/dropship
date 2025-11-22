import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";

export type AliProductInput = {
  externalId?: string;
  title: string;
  slug?: string;
  description?: string | null;
  price: number;
  compareAt?: number | null;
  image: string;
  imageAlt?: string | null;
  tags?: string[];
  showInUk?: boolean;
  showInUs?: boolean;
  sourceUrl?: string | null;
  variants?: unknown;
  stock?: number | null;
};

function toSlug(name: string, id?: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (id) return `${base}-${id.slice(0, 6)}`;
  return base;
}

export async function importAliProducts(region: Region, feed: AliProductInput[]) {
  let imported = 0;

  for (const item of feed) {
    const showInUk = item.showInUk ?? true;
    const showInUs = item.showInUs ?? true;

    if ((region === "uk" && showInUk === false) || (region === "us" && showInUs === false)) {
      continue;
    }

    const externalId = item.externalId ?? item.sourceUrl ?? item.title;
    const slug = item.slug ?? toSlug(item.title, externalId);

    await prisma.product.upsert({
      where: { externalId },
      create: {
        externalId,
        title: item.title,
        slug,
        description: item.description ?? null,
        price: item.price,
        compareAt: item.compareAt ?? null,
        image: item.image,
        imageAlt: item.imageAlt ?? item.title,
        showInUk,
        showInUs,
        tags: item.tags ?? [],
        supplier: "aliexpress",
        sourceUrl: item.sourceUrl ?? null,
        variants: item.variants ?? undefined,
        stock: item.stock ?? null,
      },
      update: {
        title: item.title,
        slug,
        description: item.description ?? null,
        price: item.price,
        compareAt: item.compareAt ?? null,
        image: item.image,
        imageAlt: item.imageAlt ?? item.title,
        showInUk,
        showInUs,
        tags: item.tags ?? [],
        supplier: "aliexpress",
        sourceUrl: item.sourceUrl ?? null,
        variants: item.variants ?? undefined,
        stock: item.stock ?? null,
      },
    });

    imported += 1;
  }

  return { imported };
}
