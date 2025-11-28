import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-7" });
}


export default function GiftsForAge7Page() {
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
          Christmas Gifts for 7-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Seven-year-olds are imaginative, creative and eager to learn — making Christmas gifting especially fun. Our 2025 Gifts for 7-Year-Olds UK collection includes educational toys, creative kits, sensory items, fun accessories and playful surprises perfect for children in early primary school. Choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Educational &amp; Skill-Building Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age seven, kids love challenges, hands-on activities, creative projects and toys that let them express their growing independence. Our 2025 collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative craft sets</li>
              <li>Early STEM toys</li>
              <li>Sensory fidgets & gadgets</li>
              <li>Build-and-play sets</li>
              <li>Imaginative accessories</li>
              <li>Colourful puzzles</li>
              <li>Practical fun essentials</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These toys help support problem-solving, creativity, coordination, confidence and school-age learning — while keeping Christmas playful and exciting.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Age 7
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy crafts, characters, animals, puzzles or colourful collectibles, this page includes gender-neutral gifts suitable for every child. These items are perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Christmas stockings</li>
              <li>Christmas Eve boxes</li>
              <li>School-age bundles</li>
              <li>Family gifting</li>
              <li>Siblings & cousins</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Ideal for parents, aunties, uncles, grandparents and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can mix and match high-quality gifts without overspending — ideal for families shopping for multiple children. Fast UK delivery and guaranteed Christmas dispatch before 18 December 2025 ensures everything arrives in time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Gift Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and build a magical Christmas gift set for your 7-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Seven-year-olds are active, imaginative and curious — which makes Christmas gifting exciting and full of possibilities. Our 2025 Gifts for 7-Year-Olds USA collection includes creative activities, educational toys and fun stocking stuffers perfect for early elementary-age kids. Pick any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Engaging, Creative &amp; Educational Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age seven, children love challenges, hands-on fun and toys that help them explore their growing interests. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative craft kits</li>
              <li>Early STEM toys</li>
              <li>Sensory fidgets</li>
              <li>Build-and-play items</li>
              <li>Bath & fun essentials</li>
              <li>Colourful puzzles</li>
              <li>Imaginative accessories</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These toys help support creativity, coordination, problem-solving, early academic skills and confidence.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great for Boys &amp; Girls Age 7
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy characters, crafts, puzzles, animals or imaginative play, this page includes gender-neutral items perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Elementary-age bundles</li>
              <li>Classroom gift exchanges</li>
              <li>Family gift sets</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great for parents, grandparents, relatives and close family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match fun and educational items while staying on budget. Fast U.S. shipping ensures everything arrives before Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Holiday Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create a joyful Christmas bundle for your favourite 7-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
