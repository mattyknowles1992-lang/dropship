import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCurrentRegion } from "@/content/regions";
import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { getProductsForRegion } from "@/lib/catalog";

export function generateMetadata(): Metadata {
  return buildPageMetadata(
    {
      title: "Christmas Gifts 2025 | Browse All Gifts",
      description:
        "Browse all Christmas gifts 2025 at Holly Jolly Savings. Find gifts for him, her, kids, teens, Secret Santa and more, with 3-for bundle savings.",
    },
    { path: "/gifts" },
  );
}

export default async function GiftsPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";
  const products = await getProductsForRegion(region.id);
  const seo = getSeoForRegion(region.id);
  const baseUrl = seo.metadataBase.toString().replace(/\/$/, "");

  return (
    <main className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
          All gifts {isUK ? "UK" : "USA"}
        </p>
        <h1 className="text-2xl font-bold text-[#FFF9F2] sm:text-3xl">
          Christmas Gifts 2025 - Shop All Gifts
        </h1>
        <p className="text-sm text-[#E5E7EB]">
          Explore our full Christmas collection for {isUK ? "UK" : "USA"} families. Start with a
          3-for-{isUK ? "£20" : "$25"} bundle, or jump straight into gifts by age, theme or budget.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
          <h2 className="mb-1 text-base font-semibold text-[#FFF9F2]">Gifts by age</h2>
          <p className="mb-3 text-xs">Hand-picked Christmas gifts for little ones and big kids.</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/gifts-for-age-0" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Gifts for age 0-1
            </Link>
            <Link href="/gifts-for-age-2" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Age 2-3
            </Link>
            <Link href="/gifts-for-age-4" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Age 4-5
            </Link>
            <Link href="/gifts-for-age-6" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Age 6-7
            </Link>
            <Link href="/gifts-for-age-8" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Age 8-9
            </Link>
            <Link href="/gifts-for-age-10" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Age 10-12
            </Link>
          </div>
        </article>

        <article className="rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
          <h2 className="mb-1 text-base font-semibold text-[#FFF9F2]">Gifts by theme</h2>
          <p className="mb-3 text-xs">Pick a Christmas vibe and shop curated picks.</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/christmas-eve-box-gifts" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Christmas Eve box
            </Link>
            <Link href="/secret-santa-gifts" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Secret Santa
            </Link>
            <Link href="/stocking-fillers" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Stocking fillers
            </Link>
            <Link href="/cozy-winter-gift-set" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Cosy winter gifts
            </Link>
            <Link href="/premium-ornament-collection" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Premium ornaments
            </Link>
          </div>
        </article>

        <article className="rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
          <h2 className="mb-1 text-base font-semibold text-[#FFF9F2]">Gifts by budget</h2>
          <p className="mb-3 text-xs">Keep it affordable with stocking fillers and bundle savings.</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/gifts-under-5" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Gifts under {isUK ? "£5" : "$10"}
            </Link>
            <Link href="/gifts-under-10" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              Gifts under {isUK ? "£10" : "$15"}
            </Link>
            <Link href="/3-for-bundle" className="rounded-full bg-[#D9A441] px-3 py-1 text-black">
              3 for {isUK ? "£20" : "$25"} bundle
            </Link>
          </div>
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[#FFF9F2]">Featured gifts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">No products available yet.</p>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="space-y-2 rounded-2xl border border-[#374151] bg-black/70 p-3 text-sm text-[#E5E7EB]"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#374151] bg-black/60">
                  <Image
                    src={product.image}
                    alt={product.imageAlt ?? product.title}
                    fill
                    sizes="(min-width: 1024px) 300px, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-base font-semibold text-[#FFF9F2]">{product.title}</h3>
                <p className="text-xs text-[#9CA3AF] line-clamp-2">
                  {product.description ?? "Festive gift idea picked for this season."}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#FBBF24]">
                  {isUK ? "£" : "$"}
                  {product.price.toFixed(2)}
                  {product.compareAt ? (
                    <span className="text-xs text-[#9CA3AF] line-through">
                      {isUK ? "£" : "$"}
                      {product.compareAt.toFixed(2)}
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            url: `${baseUrl}/gifts`,
            name: "Gift ideas",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${baseUrl}/products/${product.slug}`,
              name: product.title,
              image: product.image,
              offers: {
                "@type": "Offer",
                priceCurrency: isUK ? "GBP" : "USD",
                price: product.price.toFixed(2),
                availability: "https://schema.org/InStock",
              },
            })),
          }),
        }}
      />
    </main>
  );
}
