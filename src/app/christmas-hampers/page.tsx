import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/christmas-hampers" });
}


export default function ChristmasHampersPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        {/* SEO: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSeoForRegion(region.id).jsonLd),
          }}
        />
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Featured product
          </p>
          <h1 className="text-2xl font-bold text-[#FFF9F2] sm:text-3xl">
            Christmas Hampers {isUK ? "2025 UK" : "2025 USA"}
          </h1>
          <p className="text-sm text-[#E5E7EB]">
            Build or choose a ready-made Christmas hamper filled with treats,
            small gifts and stocking fillers — perfect for families, hosts and
            coworkers.
          </p>
        </header>

        <div className="space-y-4 text-sm text-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#FFF9F2]">What&apos;s inside</h2>
          <p>
            Our Christmas hamper ideas combine small, joyful items that feel
            generous when presented together. Use the 3-for-{isUK ? "£20" : "$25"}
            bundle to mix and match:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Festive toys and trinkets for kids</li>
            <li>Cosy winter accessories and self-care treats</li>
            <li>Fun stocking fillers and Secret Santa-style surprises</li>
            <li>Practical little goodies that actually get used</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#FFF9F2]">Who this is perfect for</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Families you want to spoil with one big bundle</li>
            <li>Grandparents who love unwrapping lots of little surprises</li>
            <li>Hosts, neighbours and coworkers</li>
            <li>Teachers and support staff</li>
          </ul>

          <p>
            Pair your hamper with themed pages like
            {" "}
            <Link href="/stocking-fillers" className="underline text-[#D9A441]">
              stocking fillers
            </Link>
            {" "}
            and
            {" "}
            <Link href="/christmas-eve-box-gifts" className="underline text-[#D9A441]">
              Christmas Eve box gifts
            </Link>
            {" "}
            to fill every festive moment.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#E5E7EB]">
              Start with a 3-for-{isUK ? "£20" : "$25"} bundle, then add extras to
              build your own hamper.
            </p>
            <div className="flex gap-2">
              <Link
                href="/3-for-bundle"
                className="rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow hover:bg-[#b88c2a]"
              >
                Build hamper bundle
              </Link>
              <Link
                href="/deals"
                className="rounded-full border border-[#D9A441] px-5 py-2 text-sm font-semibold text-[#D9A441] hover:bg-[#D9A441] hover:text-black"
              >
                View all deals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
