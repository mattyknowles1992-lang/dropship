import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-10" });
}


export default function GiftsForAge10Page() {
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
          Christmas Gifts for 10-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Ten-year-olds are growing more independent, curious and confident — making Christmas gifting both exciting and meaningful. Our 2025 Gifts for 10-Year-Olds UK collection includes creative, smart, fun and educational gifts perfect for pre-teens. Choose any 3 gifts for £20, and get a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Skill-Building &amp; Pre-Teen Friendly Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age ten, kids enjoy hands-on challenges, independent projects and fun activities that help them express their personality. That’s why this collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Craft & DIY kits</li>
              <li>Early STEM and science toys</li>
              <li>Puzzles & brain teasers</li>
              <li>Sensory and fidget items</li>
              <li>Build-and-play sets</li>
              <li>Practical accessories</li>
              <li>Imaginative gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These items help support problem-solving, creativity, confidence, early independence and school-ready skills — all while keeping Christmas fun.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Age 10
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy crafting, building, puzzles, characters or practical fun, this page includes gender-neutral gifts suitable for every child. Great for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Stocking fillers</li>
              <li>Christmas Eve boxes</li>
              <li>Pre-teen hampers</li>
              <li>Family gifting</li>
              <li>Sibling and cousin gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Ideal for parents, grandparents, aunties, uncles and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle makes it easy to build a personalised, meaningful gift set without overspending — especially for families shopping for multiple children. With fast UK delivery and guaranteed dispatch before 18 December 2025, you can shop stress-free.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Pre-Teen Christmas Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create an exciting gift pack for your favourite 10-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Ten-year-olds are imaginative, curious and becoming more independent than ever — making Christmas 2025 the perfect time to choose fun, educational and personality-filled gifts. Our 2025 Gifts for 10-Year-Olds USA collection includes creative projects, smart toys, puzzles and fun accessories. Pick any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Engaging, Creative &amp; Smart Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Children at this age enjoy independent projects, problem-solving challenges and activities that spark creativity. This collection features:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Craft & DIY kits</li>
              <li>Early STEM toys</li>
              <li>Brain puzzles</li>
              <li>Sensory toys</li>
              <li>Build-and-play activities</li>
              <li>Practical everyday items</li>
              <li>Imaginative accessories</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support creativity, problem-solving, coordination, early academic skills and confidence.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Boys &amp; Girls Age 10
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy characters, puzzles, building, crafting or imaginative fun, this page includes gender-neutral gifts ideal for:
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
              Thanks to our 3-for-$25 bundle, you can mix and match fun and educational items while staying within your holiday budget. Fast U.S. shipping guarantees everything arrives before Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Bundle They&apos;ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create an inspiring, exciting holiday gift pack for your favourite 10-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
