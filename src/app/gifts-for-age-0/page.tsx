import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";

import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-0" });
}


export default function GiftsForAge0Page() {
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
          Christmas Gifts for 0-Year-Olds 2025
        </h1>
        {/* ...existing code... */}
        {isUK ? (
          <>
            {/* ...existing code... */}
          </>
        ) : (
          <>
            {/* ...existing code... */}
          </>
        )}
      </section>
    </Layout>
  );
}
