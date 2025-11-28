import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-5" });
}


export default function GiftsForAge5Page() {
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
          Christmas Gifts for 5-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Five-year-olds are full of imagination, creativity and confidence as they begin exploring the world more independently. Our 2025 Gifts for 5-Year-Olds UK collection includes fun, educational and interactive toys perfect for children beginning school and developing new skills every day. Choose any 3 gifts for £20, and we’ll include a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Educational &amp; Imagination-Powered Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age five, kids love hands-on activities, pretend play, simple problem-solving games and creative expression. That’s why our Christmas collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Early learning toys</li>
              <li>Creative craft sets</li>
              <li>Imaginative play items</li>
              <li>Sensory toys</li>
              <li>Colourful accessories</li>
              <li>Bath and bedtime toys</li>
              <li>Build-and-play sets</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support early reading readiness, hand–eye coordination, creativity, independence and social development — all while keeping Christmas fun and exciting.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Both Boys &amp; Girls
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              This page includes gender-neutral gifts suitable for all 5-year-olds. Whether they love crafts, characters, puzzles, animals or colourful sensory fun, you’ll find something perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Stockings</li>
              <li>Christmas Eve boxes</li>
              <li>School-age hampers</li>
              <li>Family gift exchanges</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Ideal for parents, aunties, uncles, grandparents and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can mix and match fun and educational gifts without overspending. Fast UK delivery and guaranteed dispatch before 18 December 2025 ensures your presents arrive in time for Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build Their Perfect Christmas Bundle
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create a magical gift pack for your favourite 5-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Five-year-olds are imaginative, eager to learn and full of energy — making Christmas gifting extra exciting. Our 2025 Gifts for 5-Year-Olds USA collection offers fun, educational and creative toys ideal for kids entering kindergarten or early school-age learning. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Educational &amp; Play-Focused Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Children at age five love exploring, creating and problem-solving. That’s why our 2025 gift collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Learning toys</li>
              <li>Craft and creative kits</li>
              <li>Pretend-play items</li>
              <li>Sensory toys</li>
              <li>Colourful accessories</li>
              <li>Bath toys</li>
              <li>Build-and-play sets</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support early literacy, coordination, imagination, confidence and school readiness — while keeping playtime engaging and fun.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Age 5
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for a child who loves crafts, characters, animals, puzzles or imaginative fun, this collection includes something for every personality. These gifts work perfectly for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Christmas stockings</li>
              <li>Kindergarten-age bundles</li>
              <li>Family gift exchanges</li>
              <li>Classroom Secret Santa</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Suitable for parents, grandparents, relatives and close family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifting for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can build a creative and educational gift pack without stretching your holiday budget. Fast U.S. shipping ensures everything arrives before Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Create a Christmas They&apos;ll Never Forget
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and build a gift bundle that makes this Christmas magical for your favourite 5-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
