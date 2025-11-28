import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/3-for-bundle" });
}


export default function ThreeForBundlePage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-7 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8 lg:p-10">
        {/* SEO: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSeoForRegion(region.id).jsonLd),
          }}
        />
        <h1 className="text-3xl font-bold text-[#FFF9F2] sm:text-4xl">
          {isUK
            ? "3 for £20 Christmas Gifts 2025 — Mix & Match ANY 3 Gifts"
            : "3 for $25 Christmas Gifts 2025 — Mix & Match ANY 3 Gifts"}
        </h1>
        {isUK ? (
          <>
            <p className="text-base text-[#E5E7EB]">
              Welcome to our biggest Christmas deal of the year — the 3 for £20 Christmas Gift Bundle UK 2025! Choose ANY 3 gifts from our entire collection and build your own personalised Christmas bundle. Perfect for kids, teens, partners, friends, parents and stocking fillers. Plus, enjoy a FREE mystery Christmas gift with your first order.
            </p>
            <p className="text-base text-[#E5E7EB]">
              Whether you&apos;re buying for one person or building multiple gift bundles for the whole family — this is the easiest, cheapest and most fun way to shop for Christmas 2025.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2] mt-4">How the 3-for-£20 Bundle Works</h2>
            <ol className="list-decimal ml-6 text-base text-[#E5E7EB]">
              <li>Pick any 3 gifts from the site</li>
              <li>Automatically pay £20 total</li>
              <li>Get fast UK delivery</li>
              <li>Receive a FREE extra Christmas gift (first order only)</li>
              <li>Enjoy stress-free gifting &#127876;</li>
            </ol>
            <p className="text-base text-[#E5E7EB]">No hidden fees, no confusing bundles — just mix, match and save.</p>
            <h2 className="text-xl font-semibold text-[#FFF9F2] mt-4">Perfect For All Ages &amp; All Occasions</h2>
            <ul className="list-disc ml-6 text-base text-[#E5E7EB]">
              <li>Kids (ages 0–12)</li>
              <li>Teens</li>
              <li>Parents</li>
              <li>Friends</li>
              <li>Grandparents</li>
              <li>Teachers</li>
              <li>Secret Santa</li>
              <li>Stocking fillers</li>
              <li>Christmas Eve boxes</li>
            </ul>
            <p className="text-base text-[#E5E7EB]">
              You can create multiple personalised bundles for different family members at an unbeatable price.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2] mt-4">Why Choose the 3-for-£20 Bundle?</h2>
            <ul className="list-disc ml-6 text-base text-[#E5E7EB]">
              <li>Huge savings vs buying individually</li>
              <li>Complete flexibility in what you choose</li>
              <li>Stress-free Christmas planning</li>
              <li>Fun mix-and-match options</li>
              <li>Perfect for big families on a budget</li>
              <li>Gift sets that look premium without the cost</li>
            </ul>
            <p className="text-base text-[#E5E7EB]">
              It’s the simplest and most affordable way to build meaningful Christmas gifts in 2025.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2] mt-4">Guaranteed Christmas Delivery</h3>
            <p className="text-base text-[#E5E7EB]">
              Order by 18 December 2025 for guaranteed delivery before Christmas morning.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2] mt-4">Build Your 3-for-£20 Bundle</h3>
            <p className="text-base text-[#E5E7EB]">
              Browse our collection below and create the perfect gift pack for everyone on your list.
            </p>
          </>
        ) : (
          <>
            <p className="text-base text-[#E5E7EB]">
              Our most popular holiday deal is here — the 3 for $25 Christmas Gift Bundle USA 2025! Choose ANY 3 gifts across our entire range and build a personalised holiday gift set for kids, teens, parents, friends or coworkers. Every order also includes a FREE bonus holiday gift for first-time customers.
            </p>
            <p className="text-base text-[#E5E7EB]">
              One deal, thousands of combinations — easy, affordable and perfect for Christmas 2025.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2] mt-4">How the 3-for-$25 Bundle Works</h2>
            <ol className="list-decimal ml-6 text-base text-[#E5E7EB]">
              <li>Pick any 3 gifts from any category</li>
              <li>Your total becomes $25</li>
              <li>Fast U.S. nationwide shipping</li>
              <li>FREE bonus gift included</li>
              <li>Shop stress-free 🎅</li>
            </ol>
            <p className="text-base text-[#E5E7EB]">A flexible and fun way to save money during the holidays.</p>
            <h2 className="text-xl font-semibold text-[#FFF9F2] mt-4">Perfect for Every Age &amp; Every Holiday Moment</h2>
            <ul className="list-disc ml-6 text-base text-[#E5E7EB]">
              <li>Kids (ages 0–12)</li>
              <li>Teens</li>
              <li>Moms & dads</li>
              <li>Friends & coworkers</li>
              <li>Grandparents</li>
              <li>Teachers</li>
              <li>Stocking stuffers</li>
              <li>Holiday gift bags</li>
              <li>Secret Santa exchanges</li>
            </ul>
            <p className="text-base text-[#E5E7EB]">
              Build multiple bundles and make everyone’s Christmas unforgettable.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2] mt-4">Why Choose the 3-for-$25 Deal?</h2>
            <ul className="list-disc ml-6 text-base text-[#E5E7EB]">
              <li>Amazing value</li>
              <li>Complete choice and flexibility</li>
              <li>High-quality gifts for everyone</li>
              <li>Budget-friendly holiday shopping</li>
              <li>Perfect mix-and-match options</li>
              <li>Ideal for large families or multiple kids</li>
            </ul>
            <p className="text-base text-[#E5E7EB]">
              A premium-feeling gift bundle at a budget-friendly price.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2] mt-4">Holiday Delivery Guaranteed</h3>
            <p className="text-base text-[#E5E7EB]">
              Order before December 18, 2025 to receive your presents in time for Christmas.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2] mt-4">Build Your 3-for-$25 Bundle</h3>
            <p className="text-base text-[#E5E7EB]">
              Browse the USA collection below and customise the perfect holiday gift set today.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
