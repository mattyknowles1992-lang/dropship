import Link from "next/link";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import { getCategories } from "@/content/categories";
import { listProductsByCategory } from "@/content/products";
import { ChristmasKeywordBlock } from "@/lib/seo";
import { ChristmasCountdown } from "@/components/ChristmasCountdown";
import { TrustBadges } from "@/components/TrustBadges";
import { HeroCarousel } from "@/components/HeroCarousel";

export default function Home() {
  const region = getCurrentRegion();
  const categories = getCategories(region.id);

  const heroCategory = categories[0];
  const heroProducts = listProductsByCategory(
    region.id,
    heroCategory.slug,
  ).slice(0, 3);

  return (
    <Layout>
      {/* Top hero: countdown between header and carousel, then messaging */}
      <section className="space-y-6">
        <div className="flex justify-center">
          <ChristmasCountdown />
        </div>
        <div className="rounded-3xl border border-[#D9A441]/60 bg-black/80 p-3 shadow-lg shadow-black/70 sm:p-4 md:p-5">
          <HeroCarousel />
        </div>
        <div className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/90 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
          <p className="inline-flex rounded-full bg-red-800/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-red-100">
            Christmas {new Date().getFullYear()} • {" "}
            {region.id === "uk" ? "UK Christmas Gifts" : "US Christmas Gifts"}
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#FFF9F2] sm:text-4xl md:text-5xl">
            Christmas gifts that arrive in time—and feel unforgettable.
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-[#E5E7EB]">
            Choose ready-to-gift Christmas presents, cosy stocking fillers and
            Secret Santa ideas that ship with tracking. We focus on reliable
            {" "}
            {region.id === "uk" ? "UK" : "US"} Christmas delivery so your gifts
            land under the tree, not after it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/for-him"
              className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/70 transition hover:-translate-y-0.5 hover:bg-red-400"
            >
              Gifts for him
            </Link>
            <Link
              href="/for-her"
              className="rounded-full border border-red-300/70 bg-red-950/40 px-6 py-2.5 text-sm font-semibold text-red-100 transition hover:border-red-200 hover:bg-red-900/60"
            >
              Gifts for her
            </Link>
            <Link
              href="/for-kids"
              className="rounded-full border border-emerald-300/70 bg-emerald-950/40 px-6 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-900/60"
            >
              Gifts for kids
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-[#D9A441]/60 bg-black/80 p-3 shadow-lg shadow-black/70 sm:p-4 md:p-5">
          <HeroCarousel />
        </div>
      </section>
    </Layout>
  );
}

