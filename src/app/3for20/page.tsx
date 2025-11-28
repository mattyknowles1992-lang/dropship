import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "3 for £20 Christmas Gifts | Holly Jolly Savings",
};

async function loadProductsForGroup(name: string) {
  try {
    const group = await prisma.productGroup.findFirst({
      where: { name },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!group) return [];

    return group.items
      .map((item) => item.product)
      .filter((p) => !!p && p.showInUk)
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        image: p.image,
        imageAlt: p.imageAlt ?? p.title,
        tags: p.tags ?? [],
      }));
  } catch (error) {
    console.warn("3-for-20 bundle: Prisma unavailable, returning empty group", error);
    return [];
  }
}

export default async function ThreeFor20Page() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";
  const products = await loadProductsForGroup("3-for-20");

  return (
    <Layout>
      <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#FFF9F2] sm:text-4xl">
          3 for {isUK ? "£20" : "$25"} Gifts
        </h1>
        <p className="text-sm text-[#E5E7EB]">
          Hand-picked gifts that qualify for our 3-for-
          {isUK ? "£20" : "$25"} bundle. Add any three of these items to your basket and
          your total will be adjusted automatically at checkout.
        </p>

        {products.length === 0 ? (
          <p className="text-sm text-[#9CA3AF]">
            No products have been assigned to this bundle yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group space-y-3 rounded-2xl border border-[#374151] bg-black/70 p-3 text-sm text-[#E5E7EB] transition hover:-translate-y-1 hover:border-[#D9A441]/70"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#374151] bg-black/60">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 300px, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-[#FFF9F2]">
                    {product.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-[#9CA3AF]">
                    {product.description ?? "Bundle-eligible festive gift."}
                  </p>
                  <div className="flex items-center justify-between text-sm font-semibold text-[#FBBF24]">
                    <span>
                      {region.currencySymbol}
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
