import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-grandma" });
}


export default function GiftsForGrandmaPage() {
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
          {isUK ? "Christmas Gifts for Grandma / Nan 2025" : "Christmas Gifts for Grandma 2025"}
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make your grandma or nan feel truly cherished this Christmas with thoughtful, sweet and meaningful gifts from our 2025 Gifts for Grandma / Nan UK collection. These small festive surprises are perfect as stocking fillers, extra treats or heartfelt add-ons to her main present. Enjoy any 3 gifts for £20, plus a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Cute, Heartfelt &amp; Comforting Gifts for Grandmas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Cosy and relaxing items</li>
              <li>Sentimental mini gifts</li>
              <li>Festive themed surprises</li>
              <li>Everyday thoughtful items</li>
              <li>Fun novelty gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect whether your nan loves comfort, humour or thoughtful details.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Ideal for All Types of Grandmas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Nans</li>
              <li>Grans</li>
              <li>Grandmas</li>
              <li>Great-grandmas</li>
              <li>Step-grandmas</li>
              <li>“Young at heart” grandmas</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Small gifts can create beautiful Christmas moments she’ll remember.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Affordable Christmas Gifts for Grandma (2025)</h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can build a custom Christmas pack for your grandma without overspending. Fast UK delivery guarantees arrival before 18 December 2025.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">Shop the Best Gifts for Grandma / Nan</h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 UK collection and pick out something she’ll love.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Show your grandma how much she means to you with sweet, thoughtful and heartwarming gifts from our 2025 Gifts for Grandma USA collection. These mini presents are perfect for stockings, Christmas Eve boxes or small holiday add-ons. Choose any 3 gifts for $25, and enjoy a FREE bonus gift.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Cute, Cozy &amp; Sentimental Gifts for Grandmas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Cozy comfort items</li>
              <li>Sentimental mini gifts</li>
              <li>Holiday-themed surprises</li>
              <li>Practical daily essentials</li>
              <li>Fun novelty treats</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for grandmas who love cosy and heartfelt gifts.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Gifts for All Types of Grandmas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Grandmas</li>
              <li>Nanas</li>
              <li>Grannies</li>
              <li>Abuelas (non-identifying context)</li>
              <li>Step-grandmas</li>
              <li>Great-grandmas</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Small gifts can make grandma’s Christmas truly special.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Affordable Holiday Gifts for Grandma (2025)</h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can treat your grandma without overspending. Fast U.S. shipping ensures everything arrives before Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">Shop the Best Gifts for Grandma 2025</h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 USA collection to find the perfect gift for your grandma.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
