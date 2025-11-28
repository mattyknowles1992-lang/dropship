import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-9" });
}


export default function GiftsForAge9Page() {
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
          Christmas Gifts for 9-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Nine-year-olds are creative, curious and becoming far more independent — making Christmas 2025 the perfect time to choose gifts that challenge their minds and spark their imagination. Our 2025 Gifts for 9-Year-Olds UK collection includes fun, educational and confidence-boosting toys perfect for primary school children. Choose any 3 gifts for £20, and enjoy a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Skill-Building &amp; Engaging Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Children at age nine love hands-on challenges, creative activities and gifts that help them develop new hobbies. That’s why our collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Craft & DIY kits</li>
              <li>Early STEM and science toys</li>
              <li>Puzzles & brain teasers</li>
              <li>Sensory and fidget items</li>
              <li>Build-and-play sets</li>
              <li>Imaginative accessories</li>
              <li>Practical school-friendly items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support problem-solving, creativity, independence, focus and early academic development — while keeping Christmas fun and exciting.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Boys &amp; Girls Age 9
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy building, crafting, puzzling, collecting or imaginative play, this page includes gender-neutral gifts suitable for every type of child. Perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Stockings</li>
              <li>Christmas Eve boxes</li>
              <li>School-age hampers</li>
              <li>Sibling and cousin gifts</li>
              <li>Family gift exchanges</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Ideal for parents, grandparents, aunties, uncles and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Thanks to our 3-for-£20 bundle, you can mix and match high-quality, engaging gifts without stretching your Christmas budget. Fast UK delivery and guaranteed dispatch before 18 December 2025 ensures your presents arrive in time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Gift Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and create an exciting, creative gift set for your favourite 9-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Nine-year-olds are full of imagination, curiosity and growing independence — making Christmas 2025 an exciting opportunity to choose gifts that inspire creativity and learning. Our 2025 Gifts for 9-Year-Olds USA collection includes smart, creative and engaging toys perfect for elementary-age children. Pick any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Engaging, Educational &amp; Creative Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age nine, kids love activities that challenge them and spark independent play. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Craft & DIY kits</li>
              <li>Early STEM toys</li>
              <li>Puzzles & brain challenges</li>
              <li>Sensory fidgets</li>
              <li>Build-and-play items</li>
              <li>Imaginative accessories</li>
              <li>School-friendly essentials</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support creativity, problem-solving, coordination, focus and early academic skills.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Age 9
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they enjoy characters, crafts, animals, puzzles or imagination, this page includes gender-neutral items ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Elementary-age gift sets</li>
              <li>Family Christmas bundles</li>
              <li>Classroom Secret Santa</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, grandparents, relatives and family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match creative and educational items while keeping Christmas affordable. Fast U.S. shipping ensures everything arrives before the holidays.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Bundle They’ll Remember
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create a fun, creative holiday gift bundle for your favourite 9-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
