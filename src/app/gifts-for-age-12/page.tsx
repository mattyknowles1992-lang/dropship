import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-12" });
}


export default function GiftsForAge12Page() {
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
          Christmas Gifts for 12-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Twelve-year-olds are entering full pre-teen mode — independent, expressive, social and developing strong interests. Our 2025 Gifts for 12-Year-Olds UK collection is designed to match their growing personality, confidence and creativity. Choose any 3 gifts for £20, and enjoy a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Trendy, Creative &amp; Pre-Teen Approved Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Children at age 12 enjoy gifts that feel “grown-up”, expressive and fun. That’s why this collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative & DIY kits</li>
              <li>Early STEM toys & puzzles</li>
              <li>Sensory & fidget toys</li>
              <li>School-friendly accessories</li>
              <li>Room décor & fun novelty items</li>
              <li>Build-and-play sets</li>
              <li>Trendy personal items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts support creativity, independence, confidence, focus and early teen development — while keeping Christmas fun and age-appropriate.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Ideal Gifts for Boys &amp; Girls Age 12
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they’re into crafts, puzzles, collecting, character gifts or expressive accessories, this page includes gender-neutral options for all personalities. Perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Stocking fillers</li>
              <li>Christmas Eve boxes</li>
              <li>Pre-teen hampers</li>
              <li>Family gifting</li>
              <li>Cousin or sibling gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, grandparents, aunties, uncles and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle gives you the freedom to build a personalised, pre-teen-approved Christmas gift set without overspending. Fast UK delivery and Christmas dispatch before 18 December 2025 makes holiday gifting stress-free.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Pre-Teen Christmas Bundle They&apos;ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create a fun, creative and expressive gift set for your favourite 12-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Twelve-year-olds are expressive, creative and increasingly independent — making Christmas 2025 a perfect chance to choose gifts that feel fun, personal and age-appropriate. Our 2025 Gifts for 12-Year-Olds USA collection includes smart, trendy and engaging gifts designed for pre-teens. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Trendy &amp; Pre-Teen Friendly Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Children at this age love gifts that feel more mature and match their developing interests. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative & DIY kits</li>
              <li>Early STEM toys</li>
              <li>Puzzles & mind games</li>
              <li>Sensory fidgets</li>
              <li>Room décor & accessories</li>
              <li>Build-and-play sets</li>
              <li>Fun novelty items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support creativity, early learning, independence, confidence and focus — while keeping Christmas exciting.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Boys &amp; Girls Age 12
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy puzzles, crafts, collectibles, characters, or creative hobbies, this page includes gender-neutral options perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Pre-teen gift bundles</li>
              <li>Classroom gift exchanges</li>
              <li>Family Christmas sets</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, grandparents, relatives and close family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match creative and educational items without going over budget. Fast U.S. shipping ensures everything arrives on time, even for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Bundle They&apos;ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 pre-teen collection below and create a fun, expressive holiday gift pack for your favourite 12-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
