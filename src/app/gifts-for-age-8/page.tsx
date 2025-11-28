import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-8" });
}


export default function GiftsForAge8Page() {
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
          Christmas Gifts for 8-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Eight-year-olds are full of curiosity, confidence and creativity — making Christmas gifting a chance to inspire their growing interests. Our 2025 Gifts for 8-Year-Olds UK collection includes exciting, educational and imaginative gifts perfect for children in primary school. Choose any 3 gifts for £20, and enjoy a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Skill-Building &amp; Imagination-Friendly Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age eight, kids enjoy activities that challenge their minds, spark creativity and let them express their independence. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative craft kits</li>
              <li>Early STEM toys</li>
              <li>Sensory & fidget items</li>
              <li>Build-and-play sets</li>
              <li>Imaginative accessories</li>
              <li>Colourful puzzles</li>
              <li>Fun practical items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help encourage problem-solving, creativity, hand–eye coordination, early academic skills, and independent play.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Ideal Gifts for Boys &amp; Girls Age 8
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy building, crafting, collecting, puzzling or imaginary adventures, this page offers gender-neutral options suitable for every child. Perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Christmas stockings</li>
              <li>Christmas Eve boxes</li>
              <li>School-age gift bundles</li>
              <li>Family gift exchanges</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great for parents, grandparents, aunties, uncles and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can create a personalised Christmas gift set without overspending — or shop for multiple children at once. Fast UK delivery and Christmas dispatch before 18 December 2025 ensures everything arrives in time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Explore the 2025 collection below and create a gift pack that sparks fun, imagination and learning for your favourite 8-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Eight-year-olds are imaginative, energetic and eager to explore new interests — which makes Christmas gifting especially exciting. Our 2025 Gifts for 8-Year-Olds USA collection features creative, educational and fun toys designed for elementary-age children. Choose any 3 gifts for $25, and enjoy a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Smart &amp; Skill-Building Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age eight, kids love activities that challenge them, encourage creativity and inspire independent play. That’s why this collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Craft and creative kits</li>
              <li>Early STEM toys</li>
              <li>Fidgets & sensory toys</li>
              <li>Build-and-play sets</li>
              <li>Fun puzzles</li>
              <li>Imaginative accessories</li>
              <li>Colourful collectibles</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These toys help support problem-solving, creativity, coordination, early academic skills and curiosity.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Christmas Gifts for Boys &amp; Girls Age 8
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they’re into crafts, animals, building, characters or imagination, this page includes gender-neutral options perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Elementary-school gift bundles</li>
              <li>Classroom gift exchanges</li>
              <li>Family Christmas sets</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great for parents, grandparents, relatives and close family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Thanks to our 3-for-$25 bundle, you can mix and match multiple fun and educational items without going over budget. Fast U.S. shipping ensures your gifts arrive before Christmas — even for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Create a Christmas Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and build a creative, exciting holiday gift pack for your favourite 8-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
