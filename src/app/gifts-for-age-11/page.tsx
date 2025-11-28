import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-11" });
}


export default function GiftsForAge11Page() {
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
          Christmas Gifts for 11-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Eleven-year-olds are right on the edge of their teenage years — independent, curious and full of growing personality. Our 2025 Gifts for 11-Year-Olds UK collection is designed to match that energy, offering fun, creative and confidence-building gifts perfect for pre-teens. Choose any 3 gifts for £20, and enjoy a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Smart &amp; Pre-Teen Approved Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age eleven, children enjoy more challenging activities, creative projects and gifts that reflect their personal style. That’s why this collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative craft & DIY kits</li>
              <li>Early STEM & science toys</li>
              <li>Puzzles & brain teasers</li>
              <li>Sensory fidgets</li>
              <li>Build-and-play sets</li>
              <li>Trendy accessories</li>
              <li>Fun novelty items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These items support problem-solving, creativity, fine motor skills, independence and growing confidence — while keeping things fun and age-appropriate.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Age 11
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for a sporty child, a creative one, a puzzle-lover or a collector, this page includes a wide range of gender-neutral gifts. Ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Stockings</li>
              <li>Christmas Eve boxes</li>
              <li>Pre-teen hampers</li>
              <li>Sibling & cousin gifts</li>
              <li>Family Secret Santa</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, grandparents, aunties, uncles and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle makes it easy to build a personalised pre-teen gift set without spending too much. Fast UK delivery and Christmas dispatch before 18 December 2025 keeps things stress-free.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build the Perfect Pre-Teen Gift Bundle
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Explore the full 2025 collection below and create a fun, exciting and meaningful Christmas gift set for your favourite 11-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Eleven-year-olds are creative, curious and becoming increasingly independent — making Christmas gifting especially fun. Our 2025 Gifts for 11-Year-Olds USA collection includes smart, creative and trendy gifts perfect for this in-between stage. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Smart &amp; Trendy Gifts for Pre-Teens
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Kids at age eleven love activities that match their growing maturity while still being fun. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Craft & DIY kits</li>
              <li>Early STEM toys</li>
              <li>Brain puzzles</li>
              <li>Sensory toys</li>
              <li>Build-and-play activities</li>
              <li>Trendy accessories</li>
              <li>Fun novelty items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support creativity, independence, problem-solving, focus and growing confidence — all while keeping Christmas exciting.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Boys &amp; Girls Age 11
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they love crafts, characters, puzzles, animals or creative activities, this page has gender-neutral options perfect for:
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
              Our 3-for-$25 bundle makes holiday gifting flexible and budget-friendly. Fast U.S. shipping guarantees your gifts arrive in time for Christmas — even for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Bundle They&apos;ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and create an exciting, creative and pre-teen-approved holiday gift set.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
