import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentRegion } from "@/content/regions";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ChristmasCountdown } from "@/components/ChristmasCountdown";
import { TrustBadges } from "@/components/TrustBadges";
import { getAssets } from "@/lib/assets";
import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/" });
}

export default async function HomePage() {
  const region = getCurrentRegion();
  const seo = getSeoForRegion(region.id);
  const currencySymbol = region.currencySymbol;
  const assets = await getAssets();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* SEO: JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.jsonLd),
        }}
      />

      {/* HERO COUNTDOWN (centered under header) */}
      <section className="mb-4 flex justify-center">
        <ChristmasCountdown />
      </section>

      {/* ORDER BY STRIP UNDER COUNTDOWN */}
      <section className="mb-8 flex justify-center">
        <div className="inline-flex max-w-sm items-center gap-2 rounded-2xl border border-[#D9A441]/60 bg-[#FFF9F2] px-3 py-2 text-[10px] text-[#1A1A1A] shadow-sm shadow-black/20">
          <span className="text-base" aria-hidden="true">
            🎁
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#B3202A]">
              Order by 20 December
            </p>
            <p className="text-[10px] text-[#1F2933]">
              Guaranteed UK Christmas delivery when you order before 20
              December.
            </p>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH HERO CAROUSEL */}
      <section className="mb-10">
        <HeroCarousel
          heroPrimary={assets.heroPrimary}
          heroSecondary={assets.heroSecondary}
        />
      </section>

      {/* HERO TEXT UNDER CAROUSEL */}
      <section className="mb-8 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Christmas Gifts UK 2025
          </p>
          <h1 className="text-3xl font-extrabold text-[#FFF9F2] sm:text-4xl">
            Christmas Gifts 2025 - 3 for {currencySymbol}
            20 + FREE Gift
          </h1>
          <p className="text-sm text-[#E5E7EB]">
            Build a personalised Christmas gift bundle for kids, teens, family
            and friends. Pick any 3 gifts for {currencySymbol}
            20 and get a FREE mystery gift with your first order.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/3-for-bundle"
              className="rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow transition hover:bg-[#b88c2a]"
            >
              Shop 3 for {currencySymbol}
              20
            </Link>
            <Link
              href="/gifts"
              className="rounded-full border border-[#D9A441]/70 px-5 py-2 text-sm font-semibold text-[#D9A441] transition hover:bg-[#D9A441] hover:text-black"
            >
              Shop all gifts
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Featured Collections */}
      <section className="mb-8 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        <h2 className="mb-4 text-xl font-bold text-[#D9A441]">
          Shop our most popular Christmas collections
        </h2>
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Link href="/gifts-for-age-0" className="category-link">
            Gifts for Kids (0-12)
          </Link>
          <Link href="/stocking-fillers" className="category-link">
            Stocking Fillers
          </Link>
          <Link href="/christmas-eve-box-gifts" className="category-link">
            Christmas Eve Box Gifts
          </Link>
          <Link href="/gifts-for-him" className="category-link">
            Gifts for Him
          </Link>
          <Link href="/gifts-for-her" className="category-link">
            Gifts for Her
          </Link>
          <Link href="/gifts-under-10" className="category-link">
            Gifts Under {currencySymbol}
            10
          </Link>
          <Link href="/gifts-for-teenagers" className="category-link">
            Gifts for Teens
          </Link>
          <Link href="/secret-santa-gifts" className="category-link">
            Secret Santa Gifts
          </Link>
        </div>
        <div className="text-center">
          <Link
            href="/categories"
            className="font-semibold text-[#D9A441] underline"
          >
            View All Categories
          </Link>
        </div>
      </section>

      {/* SECTION 3 - 3-for-20 Bundle */}
      <section className="mb-8 rounded-xl bg-[#FFF9F2] p-5 shadow">
        <h2 className="mb-2 text-xl font-bold text-[#D9A441]">
          The UK's favourite Christmas deal - any 3 gifts for {currencySymbol}
          20
        </h2>
        <p className="mb-2 text-base text-black">
          Build a personalised 3-item bundle from any gift on the site.
          Affordable, fun and perfect for Christmas gifting.
        </p>
        <ul className="mb-2 ml-6 list-disc text-black">
          <li>Mix &amp; match any 3 gifts</li>
          <li>Pay {currencySymbol}
          20 total</li>
          <li>FREE bonus gift (first order only)</li>
          <li>Perfect for kids, teens &amp; adults</li>
          <li>Ideal for stockings &amp; Christmas bundles</li>
          <li>Fast tracked UK delivery</li>
        </ul>
        <div className="mt-2 text-center">
          <Link
            href="/3-for-bundle"
            className="rounded-full bg-[#D9A441] px-6 py-2 text-sm font-bold text-black shadow transition hover:bg-[#b88c2a]"
          >
            Build my bundle
          </Link>
        </div>
      </section>

      {/* SECTION 4 - Trust & Reviews */}
      <section className="mb-10 space-y-6">
        <TrustBadges />

        <div className="rounded-3xl border border-[#D9A441]/40 bg-black/70 p-5 shadow-lg">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-[#D9A441]">
              Loved by families across the UK
            </h2>
            <p className="text-xs text-[#E5E7EB]">
              Trusted by UK families since 2020.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-black/60 p-4 text-sm text-[#E5E7EB]">
              <p className="mb-2 text-[#FBBF24]">★★★★★</p>
              <p className="mb-2">
                Christmas 2024 was so much easier with the 3 for {currencySymbol}
                20 bundle. The kids loved everything and delivery was faster than
                expected.
              </p>
              <p className="text-xs text-[#9CA3AF]">
                – Sarah M., UK customer, Christmas 2024
              </p>
            </article>
            <article className="rounded-2xl bg-black/60 p-4 text-sm text-[#E5E7EB]">
              <p className="mb-2 text-[#FBBF24]">★★★★★</p>
              <p className="mb-2">
                Great value for money and really fun gifts. I built two bundles
                for my nieces and nephew for Christmas 2024 and everything
                arrived in time.
              </p>
              <p className="text-xs text-[#9CA3AF]">
                – Daniel K., repeat customer since Christmas 2024
              </p>
            </article>
            <article className="rounded-2xl bg-black/60 p-4 text-sm text-[#E5E7EB]">
              <p className="mb-2 text-[#FBBF24]">★★★★★</p>
              <p className="mb-2">
                Loved the bonus gift and the quality of the items we ordered for
                Christmas 2024. We'll definitely be ordering again this
                Christmas.
              </p>
              <p className="text-xs text-[#9CA3AF]">
                – Jasmine R., Christmas 2024 customer
              </p>
            </article>
          </div>
          <div className="mt-4 flex justify-center">
            <Link
              href="/reviews"
              className="rounded-full border border-[#D9A441] px-5 py-2 text-sm font-semibold text-[#D9A441] transition hover:bg-[#D9A441] hover:text-black"
            >
              Read more reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Optional small SEO footer copy */}
      <footer className="mt-8 border-t border-[#D9A441]/40 pt-6 text-xs text-[#E5E7EB]">
        <h3 className="mb-1 text-sm font-semibold text-[#D9A441]">
          Holly Jolly Savings UK - Affordable Christmas gifts for every family
        </h3>
        <p>
          Discover the best Christmas gifts for kids, teens, parents and
          coworkers with our 3 for {currencySymbol}
          20 mix-and-match bundle. Shop stocking fillers, festive treats and
          budget-friendly Christmas gifts at Holly Jolly Savings.
        </p>
      </footer>
    </main>
  );
}

