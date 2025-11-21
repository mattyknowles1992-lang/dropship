import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-1" });
}


export default function GiftsForAge1Page() {
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
          Christmas Gifts for 1-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Shopping for a 1-year-old at Christmas is all about fun, discovery and early development — and our 2025 Gifts for 1-Year-Olds UK collection is designed exactly for that. Whether you&apos;re buying for your own toddler or a loved one&apos;s child, this range includes safe, colourful and engaging gifts perfect for little hands and growing curiosity.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Choose any 3 gifts for £20, and we’ll include a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Safe &amp; Development-Friendly Christmas Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age one, children are exploring textures, sounds, shapes and movement. Our collection focuses on early learning toys, sensory items, soft play accessories, colourful objects and cute toddler-friendly gifts that encourage imagination and motor skills. Every item is chosen with safety and enjoyment in mind.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Unisex Gifts for Little Explorers
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These gifts work perfectly for both baby boys and girls. Whether you&apos;re building a toddler Christmas hamper or looking for stocking fillers, this page includes adorable and practical ideas ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>First steps and motor skills</li>
              <li>Early sensory play</li>
              <li>Bedtime or calm time</li>
              <li>Christmas Eve boxes</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, aunties, uncles, grandparents and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Toddlers grow fast — so affordable gifts make perfect sense. With our 3-for-£20 bundle, you can mix and match toys and essentials at great value. Plus, with fast UK delivery and guaranteed Christmas dispatch before 18 December 2025, you won’t need to worry about last-minute shopping.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stockings &amp; Toddler Gift Bundles
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and build a thoughtful Christmas bundle that both toddlers and parents will appreciate.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Christmas with a 1-year-old is full of excitement and new discoveries. Our 2025 Gifts for 1-Year-Olds USA collection includes adorable, safe and engaging presents perfect for toddlers beginning to explore the world. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Toddler-Safe, Fun &amp; Developmental Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At one year old, children love textures, colours, sounds and movement. This collection includes sensory toys, early learning items, soft accessories and fun stocking stuffers designed to encourage curiosity and development — all while keeping safety at the forefront.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Cute &amp; Practical Gifts for Boys and Girls
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for a baby boy or girl, these gifts are ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Toddler holiday stockings</li>
              <li>First Christmas gift sets</li>
              <li>Family gift exchanges</li>
              <li>Toddler playtime essentials</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, grandparents, relatives, friends and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match practical items and cute toddler toys without overspending. Fast U.S. shipping ensures your gifts arrive before Christmas, even if you shop late.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stockings &amp; Toddler Gift Bundles
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Soft, colourful and toddler-approved — these gifts make Christmas 2025 magical for little explorers.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Browse the collection below and build your toddler gift bundle today.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
