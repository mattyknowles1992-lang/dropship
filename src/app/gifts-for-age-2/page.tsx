import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-2" });
}


export default function GiftsForAge2Page() {
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
          Christmas Gifts for 2-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Two-year-olds are full of curiosity, energy and imagination — which makes Christmas gifting so much fun. Our 2025 Gifts for 2-Year-Olds UK collection includes colourful, safe and engaging toys designed to support early learning and playful discovery. Whether you’re buying for your toddler or a family friend’s child, you can choose any 3 gifts for £20, and we’ll include a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Creative &amp; Imagination-Building Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age two, children love exploring shapes, sounds, movement and pretend play. That’s why our collection focuses on toddler-safe toys that inspire creativity and build early skills. Expect stacking toys, sensory items, bath toys, imagination-building accessories, colourful objects, activity toys and adorable toddler essentials — all perfect for independent or shared play.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Unisex Gifts for Active Toddlers
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These gifts are ideal for both boys and girls, with a range of gender-neutral options included. Whether you’re building a Christmas hamper or looking for budget-friendly stocking fillers, this collection suits:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Active toddlers</li>
              <li>Sensory seekers</li>
              <li>Early learners</li>
              <li>Pretend-play lovers</li>
              <li>Nursery-aged children</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, aunties, uncles, grandparents and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Toddler Gifts for Christmas 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can mix and match high-quality toddler toys without overspending. Plus, with fast UK shipping and guaranteed Christmas dispatch before 18 December 2025, you can enjoy stress-free holiday shopping.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stockings, Christmas Eve Boxes &amp; Toddler Bundles
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create a Christmas gift bundle that little ones will love.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Two-year-olds bring energy and excitement to every moment — making Christmas 2025 the perfect time to give fun, safe and engaging gifts. Our Gifts for 2-Year-Olds USA collection includes playful, colourful and developmental toys designed for early learning and toddler-friendly fun. Pick any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Educational &amp; Imagination-Boosting Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              This collection focuses on toddler-safe toys that encourage imagination, curiosity and early skill-building. Expect sensory toys, stacking sets, pretend-play items, bath toys, creative objects, colourful accessories and fun toddler activities — perfect for growing minds and busy little hands.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Boys and Girls
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re buying for a toddler boy or girl, these gifts are ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Toddler Christmas stockings</li>
              <li>Holiday gift bundles</li>
              <li>Family gift exchanges</li>
              <li>First preschool-age toys</li>
              <li>Imaginative play</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great for parents, grandparents, relatives and friends looking for meaningful toddler gifts.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match practical toddler toys and fun surprises without overspending. Fast U.S. shipping ensures your gifts arrive before Christmas — perfect for last-minute shopping.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stocking Stuffers &amp; Toddler Gift Bundles
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Adorable, safe and toddler-approved — these gifts make Christmas magical for curious 2-year-olds.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and build your toddler bundle today.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
