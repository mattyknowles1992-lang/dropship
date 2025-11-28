import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import Link from "next/link";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/deals" });
}


export default function DealsPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        {/* SEO: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSeoForRegion(region.id).jsonLd),
          }}
        />
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Christmas deals {isUK ? "UK" : "USA"}
          </p>
          <h1 className="text-2xl font-bold text-[#FFF9F2] sm:text-3xl">
            Best Christmas Deals for {isUK ? "2025 UK" : "2025 USA"}
          </h1>
          <p className="text-sm text-[#E5E7EB]">
            Stretch your festive budget further with our best-value Christmas offers.
            Mix-and-match bundles, low-price gift picks and last-minute ideas, all in
            one place.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
              Flagship offer
            </p>
            <h2 className="mb-1 text-base font-semibold text-[#FFF9F2]">
              3-for-{isUK ? "£20" : "$25"} Christmas bundle
            </h2>
            <p className="mb-3 text-xs">
              Our most popular deal. Choose any 3 gifts across the site for one
              simple price, plus a free extra gift on your first order.
            </p>
            <Link
              href="/3-for-bundle"
              className="text-xs font-semibold text-[#D9A441] underline hover:text-[#facc6b]"
            >
              View 3-for-{isUK ? "£20" : "$25"} bundle
            </Link>
          </article>

          <article className="rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
              Budget heroes
            </p>
            <h2 className="mb-1 text-base font-semibold text-[#FFF9F2]">
              Gifts under {isUK ? "£10" : "$10"}
            </h2>
            <p className="mb-3 text-xs">
              Stocking fillers and small gifts that still feel special — ideal for
              classmates, coworkers and extended family.
            </p>
            <Link
              href="/gifts-under-10"
              className="text-xs font-semibold text-[#D9A441] underline hover:text-[#facc6b]"
            >
              Shop gifts under {isUK ? "£10" : "$10"}
            </Link>
          </article>

          <article className="rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
              Last-minute friendly
            </p>
            <h2 className="mb-1 text-base font-semibold text-[#FFF9F2]">
              Fast-shipping favourites
            </h2>
            <p className="mb-3 text-xs">
              Go-to picks that typically ship quickest, helping you stay calm even
              when you&apos;re shopping close to Christmas.
            </p>
            <Link
              href="/stocking-fillers"
              className="text-xs font-semibold text-[#D9A441] underline hover:text-[#facc6b]"
            >
              See stocking fillers
            </Link>
          </article>
        </div>

        <footer className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#E5E7EB]">
            New offers are added throughout the Christmas season. Check back for
            extra savings on bundles and themed gifts.
          </p>
          <Link
            href="/gifts"
            className="rounded-full border border-[#D9A441] px-5 py-2 text-sm font-semibold text-[#D9A441] hover:bg-[#D9A441] hover:text-black"
          >
            Browse all gifts
          </Link>
        </footer>
      </section>
  );
}
