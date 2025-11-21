import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-grandad" });
}


export default function GiftsForGrandadPage() {
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
          {isUK ? "Christmas Gifts for Grandad 2025" : "Christmas Gifts for Grandpa 2025"}
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding a meaningful Christmas gift for your grandad has never been easier. Our 2025 Gifts for Grandad UK collection includes thoughtful, practical and fun items he’ll use and enjoy. Choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Practical, Fun &amp; Thoughtful Gifts for Grandads</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Practical everyday items</li>
              <li>Funny novelty surprises</li>
              <li>Cosy comfort gifts</li>
              <li>Sensory or fidget toys</li>
              <li>Creative accessories</li>
              <li>Festive mini treats</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect whether he’s a relaxed grandad, a helpful grandad, or one who loves a laugh.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Great for All Types of Grandads</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Grandads</li>
              <li>Grandfathers</li>
              <li>Gramps</li>
              <li>Great-grandads</li>
              <li>Step-grandads</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These small gifts make grandads feel appreciated and remembered.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Affordable Gifts for Grandad (2025)</h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle makes gifting simple and budget-friendly. Fast UK shipping ensures everything arrives before Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">Shop the Best Gifts for Grandad</h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 UK collection and find the perfect Christmas surprise.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make your grandpa smile this holiday season with thoughtful, practical and fun gifts from our 2025 Gifts for Grandpa USA collection. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Useful, Fun &amp; Heartwarming Gifts for Grandpas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Practical everyday items</li>
              <li>Cozy comfort gifts</li>
              <li>Funny novelty items</li>
              <li>Sensory gadgets</li>
              <li>Festive surprises</li>
              <li>Creative accessories</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for grandpas of all personalities.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Great for All Types of Grandpas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Grandpas</li>
              <li>Granddads</li>
              <li>Papas</li>
              <li>Pop-pops</li>
              <li>Step-grandpas</li>
              <li>Great-grandpas</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These small gifts help you show love and appreciation.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Affordable Holiday Gifts for Grandpa (2025)</h2>
            <p className="text-sm text-[#E5E7EB]">
              Thanks to our 3-for-$25 bundle, gifting your grandpa is easy and budget-friendly. Fast U.S. shipping ensures everything arrives before the holiday rush.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">Shop the Best Gifts for Grandpa 2025</h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 USA collection and choose something your grandpa will truly enjoy.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
