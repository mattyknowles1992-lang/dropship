import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-under-10" });
}


export default function GiftsUnder10Page() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        {/* SEO: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSeoForRegion(region.id).jsonLd),
          }}
        />
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          {isUK ? "Gifts Under £10 — Christmas 2025" : "Gifts Under $10 — Christmas 2025"}
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding the perfect Christmas present doesn’t need to cost a fortune. Our Gifts Under £10 UK 2025 collection includes fun, thoughtful and festive gift ideas that look amazing — without the high price tag. Even better: choose any 3 gifts for £20, and get a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable, Fun &amp; High-Quality Gifts Under £10
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our handpicked collection proves that budget gifts can still feel exciting and meaningful. Discover:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative mini gifts</li>
              <li>Sensory toys & fidgets</li>
              <li>Cute accessories</li>
              <li>Practical stocking fillers</li>
              <li>Festive themed items</li>
              <li>Toys for kids</li>
              <li>Small surprises for adults</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for Secret Santa, stocking fillers, Christmas Eve boxes or last-minute gifts.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts Under £10 for All Ages
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids aged 0–12</li>
              <li>Teens</li>
              <li>Mums & dads</li>
              <li>Friends</li>
              <li>Coworkers</li>
              <li>Grandparents</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              …you’ll find something fun, festive and ready to gift.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Smart Budget Gifting for Christmas 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can pick up multiple gifts under £10 while saving even more — ideal for parents, big families or anyone buying several presents at once. Fast UK delivery and guaranteed dispatch before 18 December 2025 ensures everything arrives on time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Christmas Gifts Under £10
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and find affordable, high-quality gifts perfect for every stocking and Christmas list.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Holiday gifting doesn’t need to break the bank. Our Gifts Under $10 USA 2025 collection includes fun, meaningful and festive presents that feel special — all while staying under $10. And with our 3-for-$25 bundle, you’ll get even more value, plus a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Affordable &amp; Festive Gifts Under $10
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These small but exciting gifts are perfect for stocking stuffers, Secret Santa or last-minute holiday shopping. Discover:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Sensory toys & fidgets</li>
              <li>Mini creative gifts</li>
              <li>Practical everyday items</li>
              <li>Holiday-themed surprises</li>
              <li>Kids’ mini toys</li>
              <li>Fun novelty items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Affordable doesn’t mean boring — these are gifts people actually enjoy.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts Under $10 for All Ages
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids</li>
              <li>Tweens & teens</li>
              <li>Moms & dads</li>
              <li>Friends</li>
              <li>Coworkers</li>
              <li>Neighbors</li>
              <li>Secret Santa exchanges</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              This is your go-to collection for quick, easy and universally loved gifts.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget-Friendly Holiday Gifting 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can stock up on affordable gifts for the whole family while keeping spending low. Fast U.S. shipping ensures your order arrives before Christmas — ideal for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Christmas Gifts Under $10
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and fill stockings, gift bags and Secret Santa exchanges with fun and festive surprises.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
