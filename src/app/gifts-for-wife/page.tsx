import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-wife" });
}


export default function GiftsForWifePage() {
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
          Christmas Gifts for Wife 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Show your wife how special she is with meaningful, fun and thoughtful gifts from our 2025 Gifts for Wife UK collection. These small festive surprises are perfect as stocking fillers, mini gifts or part of a cosy Christmas bundle. Choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Cute, Cosy &amp; Heartfelt Gifts for Wives
            </h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Relaxing or cosy gifts</li>
              <li>Creative or sentimental items</li>
              <li>Festive mini surprises</li>
              <li>Practical everyday treats</li>
              <li>Fun novelty gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for wives who love thoughtful details, comfort, creativity or festive cheer.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget-Friendly Christmas Gifts for Her (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle makes it simple to build a personalised gift set for your wife — without overspending. Fast UK delivery and pre-Christmas dispatch mean your gifts arrive right on time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Gifts for Your Wife
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 UK collection below and treat your wife to something she’ll love this Christmas.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make your wife feel special this holiday season with our 2025 Gifts for Wife USA collection — filled with cute, cosy and sentimental little gifts she’ll adore. These small presents are perfect for stockings, Christmas Eve boxes or a personalised gift bundle. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Cute, Cozy &amp; Meaningful Gifts for Wives
            </h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Cozy or relaxing items</li>
              <li>Mini sentimental gifts</li>
              <li>Festive surprises</li>
              <li>Creative or fun accessories</li>
              <li>Everyday thoughtful items</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for wives who appreciate small gestures packed with meaning.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Gifts for Her (Christmas 2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match gifts she’ll love — while keeping your budget happy. Fast U.S. shipping ensures everything arrives on time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Gifts for Your Wife
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 USA collection and treat your wife to something special this Christmas.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
