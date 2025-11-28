import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-6" });
}


export default function GiftsForAge6Page() {
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
          Christmas Gifts for 6-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Six-year-olds are imaginative, curious and bursting with new interests — making Christmas gifting both exciting and rewarding. Our 2025 Gifts for 6-Year-Olds UK collection features fun, educational and creative items designed to support early school learning, social development and imaginative play. Choose any 3 gifts for £20, and we’ll include a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Skill-Building &amp; Fun Gifts for Ages 6+
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At six, children enjoy activities that let them build, create, learn and explore. That’s why this collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative craft kits</li>
              <li>Early STEM toys</li>
              <li>Sensory items</li>
              <li>Problem-solving toys</li>
              <li>Imaginative play accessories</li>
              <li>Colourful collectibles</li>
              <li>Bath toys and fun essentials</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These toys help support reading readiness, fine motor skills, focus, creativity and confidence — while making playtime exciting and festive.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Both Boys &amp; Girls Age 6
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they love crafts, characters, animals, puzzles or imaginative adventures, this page includes gender-neutral gifts suitable for every child. These ideas are perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>School-age gift bundles</li>
              <li>Stockings</li>
              <li>Christmas Eve boxes</li>
              <li>Family gifting</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Ideal for parents, aunties, uncles, grandparents and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, parents can shop smart by mixing and matching high-quality gifts at great value. Fast UK delivery and Christmas dispatch before 18 December 2025 ensures your gifts arrive in plenty of time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Magical Christmas for Your 6-Year-Old
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and create a fun, creative and meaningful Christmas bundle they’ll love.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Six-year-olds are full of creativity, imagination and developing skills — which makes Christmas gifting extra fun. Our 2025 Gifts for 6-Year-Olds USA collection includes colourful, learning-focused and imaginative toys perfect for kids in early elementary school. Pick any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Educational &amp; Engaging Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At this age, children enjoy hands-on activities, simple problem-solving and imaginative fun. This collection features:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Creative craft kits</li>
              <li>Early STEM toys</li>
              <li>Sensory toys</li>
              <li>Bath items</li>
              <li>Build-and-play sets</li>
              <li>Pretend-play accessories</li>
              <li>Colourful collectibles</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help encourage early learning, creativity, fine motor development, focus and confidence — perfect for growing minds.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect Gifts for Boys &amp; Girls Age 6
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy arts, characters, animals, puzzles or imaginative adventures, you’ll find something they’ll love. These gifts are ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Elementary-school gift sets</li>
              <li>Classroom gift exchanges</li>
              <li>Family Christmas bundles</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great for parents, grandparents, relatives and family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, gifting becomes budget-friendly and flexible. Fast U.S. shipping ensures your gifts arrive before Christmas — even for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Make Christmas Magical for Your 6-Year-Old
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and build a joyful, creative and educational holiday gift bundle.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
