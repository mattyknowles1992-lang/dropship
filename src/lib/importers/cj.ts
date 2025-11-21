import { prisma } from "@/lib/db";
import type { Region } from "@/content/regions";

type CjApiProduct = {
  id: string;
  name: string;
  description?: string;
  sellPrice?: number;
  retailPrice?: number;
  mainImage?: string;
  image?: string;
  url?: string;
  tags?: string[];
  showInUk?: boolean;
  showInUs?: boolean;
};

function toSlug(name: string, id: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${id.slice(0, 6)}`;
}

function normalizeProduct(input: CjApiProduct) {
  const price = input.sellPrice ?? input.retailPrice ?? 0;
  const compareAt =
    input.retailPrice && input.sellPrice && input.retailPrice > input.sellPrice
      ? input.retailPrice
      : null;

  return {
    externalId: input.id,
    title: input.name,
    slug: toSlug(input.name, input.id),
    description: input.description ?? null,
    price,
    compareAt,
    image: input.mainImage ?? input.image ?? "",
    imageAlt: input.name,
    showInUk: input.showInUk ?? true,
    showInUs: input.showInUs ?? true,
    tags: input.tags ?? [],
    supplier: "cjdropshipping",
    sourceUrl: input.url ?? null,
  };
}

export async function importCjProducts(
  region: Region,
  feed: CjApiProduct[],
): Promise<{ imported: number }> {
  const normalized = feed.map(normalizeProduct);

  let imported = 0;
  for (const product of normalized) {
    // Skip items not meant for this region if flags are provided.
    if (
      (region === "uk" && product.showInUk === false) ||
      (region === "us" && product.showInUs === false)
    ) {
      continue;
    }

    await prisma.product.upsert({
      where: { externalId: product.externalId },
      create: product,
      update: product,
    });
    imported += 1;
  }

  return { imported };
}

export async function fetchCjFeed(): Promise<CjApiProduct[]> {
  const url = process.env.CJ_API_URL;
  if (!url) {
    return [];
  }

  const token = process.env.CJ_API_TOKEN;
  if (!token) {
    throw new Error("CJ_API_TOKEN is not set");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "CJ-Access-Token": token,
  };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`CJ API returned ${res.status}`);
  }

  const data = (await res.json()) as CjApiProduct[] | { products?: CjApiProduct[] };
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as any).products)) return (data as any).products;
  throw new Error("Unexpected CJ API response shape");
}
