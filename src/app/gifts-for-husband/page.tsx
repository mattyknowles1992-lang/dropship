import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-husband" });
}


export default function GiftsForHusbandPage() {
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
          Christmas Gifts for Husband 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make your husband feel appreciated this Christmas with thoughtful, fun and meaningful gifts from our 2025 Gifts for Husband UK collection. Whether he loves practical gadgets, funny surprises or small everyday luxuries, our curated selection makes it easy to find something he’ll genuinely enjoy. Choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Thoughtful, Practical &amp; Fun Gifts for Husbands
            </h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Useful everyday items</li>
              <li>Funny novelty gifts</li>
              <li>Sensory gadgets & fidgets</li>
              <li>Creative or personal accessories</li>
              <li>Practical mini tools</li>
              <li>Relaxation & cosy gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for husbands who love practicality, humour or sentimental surprises.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for Him (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle allows you to build a personalised gift pack — or pick up stocking fillers while keeping your budget in check. With fast UK delivery and guaranteed dispatch before 18 December 2025, last-minute gifting is stress-free.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Gifts for Your Husband
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and make your husband smile this Christmas.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Find the perfect Christmas gift for your husband with our 2025 Gifts for Husband USA collection. Whether he’s practical, funny, sentimental or a lover of small surprises, this range includes thoughtful and budget-friendly options. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Practical, Fun &amp; Thoughtful Gifts for Husbands
            </h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Everyday practical items</li>
              <li>Funny novelty gifts</li>
              <li>Sensory gadgets</li>
              <li>Small creative accessories</li>
              <li>Personal mini gifts</li>
              <li>Cozy or relaxing items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for husbands who appreciate both fun and usefulness.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for Him (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can build a meaningful gift set without spending too much. Fast U.S. shipping ensures your order arrives before Christmas — even for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Gifts for Your Husband
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below to find gifts your husband will love.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
