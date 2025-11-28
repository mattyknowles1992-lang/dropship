import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/stocking-fillers" });
}


export default function StockingFillersPage() {
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
          {isUK ? "Stocking Fillers for Christmas 2025" : "Stocking Stuffers for Christmas 2025"}
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make Christmas morning unforgettable with our 2025 Stocking Fillers UK collection — packed with fun, festive and affordable gifts for all ages. From kids and teens to mums, dads and grandparents, we’ve handpicked small but meaningful surprises that guarantee smiles. Even better: choose any 3 gifts for £20, and get a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Affordable &amp; Gift-Ready Stocking Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our stocking fillers are cute, practical, exciting and budget-friendly — perfect for last-minute gifting or adding extra joy to Christmas morning. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Fun novelty items</li>
              <li>Sensory toys & fidgets</li>
              <li>Creative surprises</li>
              <li>Cute accessories</li>
              <li>Practical mini essentials</li>
              <li>Small toys for kids</li>
              <li>Festive themed items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether you’re building stockings for your children, your partner or your whole family, these gifts fit perfectly into any Christmas stocking without breaking the bank.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Stocking Fillers for All Ages
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 stocking fillers are suitable for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids (ages 0–12)</li>
              <li>Teens</li>
              <li>Mums & dads</li>
              <li>Grandparents</li>
              <li>Friends & relatives</li>
              <li>Secret Santa budgets</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              We offer both fun novelty stocking fillers and practical little gifts that feel thoughtful and personal.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget-Friendly Christmas Stocking Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Thanks to our 3-for-£20 bundle, you can mix and match stocking fillers for multiple family members while keeping costs low. With fast UK dispatch and guaranteed delivery before 18 December 2025, you can shop confidently right up to Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build the Perfect Christmas Morning Stocking
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 stocking filler collection below and fill your family’s stockings with festive fun, surprises and excitement.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make Christmas morning magical with our 2025 Stocking Stuffers USA collection — filled with fun, festive and budget-friendly gifts for kids, teens and adults. From small surprises to practical mini essentials, these stocking stuffers are perfect for families who want thoughtful gifts without overspending. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Festive &amp; Affordable Stocking Stuffers
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our stocking stuffer selection includes everything from cute and creative items to playful toys and everyday little essentials. Discover:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Novelty holiday items</li>
              <li>Sensory toys & fidgets</li>
              <li>Creative mini gifts</li>
              <li>Cute accessories</li>
              <li>Practical small items</li>
              <li>Fun toys for kids</li>
              <li>Holiday-themed surprises</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for children, adults, friends and family members who love festive little extras.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Stocking Stuffers for All Ages
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              This 2025 collection is great for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids</li>
              <li>Tweens & teens</li>
              <li>Moms & dads</li>
              <li>Grandparents</li>
              <li>Friends</li>
              <li>Secret Santa gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether you want something fun, cute, practical or sentimental — we’ve got a stocking stuffer that fits perfectly.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget-Friendly Holiday Gifts 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can stock up on small gifts for the whole family without stressing over cost. Fast U.S. shipping ensures everything arrives well before Christmas — perfect for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Magical Christmas Morning
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 stocking stuffer collection below and fill your stockings with fun and festive surprises.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
