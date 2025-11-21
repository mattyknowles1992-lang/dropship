import { Layout } from "@/components/Layout";
import Link from "next/link";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Ornament Collection | Special Tree Decorations",
  description:
    "Discover the Premium Ornament Collection from Holly Jolly Savings — special Christmas tree decorations ideal for keepsakes, first Christmas gifts and family traditions.",
};

export default function PremiumOrnamentCollectionPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Featured product
          </p>
          <h1 className="text-2xl font-bold text-[#FFF9F2] sm:text-3xl">
            Premium Ornament Collection
          </h1>
          <p className="text-sm text-[#E5E7EB]">
            Celebrate special memories with a collection of eye-catching Christmas
            ornaments — ideal for first Christmas keepsakes, family traditions and
            gifting between loved ones.
          </p>
        </header>

        <div className="space-y-4 text-sm text-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#FFF9F2]">How to build your set</h2>
          <p>
            Use the 3-for-{isUK ? "£20" : "$25"} offer to create a mini ornament
            collection that feels personal and meaningful. Combine:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>A standout statement ornament</li>
            <li>A cute character or child-friendly design</li>
            <li>A sentimental or year-marked decoration</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#FFF9F2]">Great for</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>First Christmas gifts for babies and newlyweds</li>
            <li>Grandparents who love meaningful tree decorations</li>
            <li>Friends or coworkers who adore Christmas decorating</li>
            <li>Building a new family ornament tradition</li>
          </ul>

          <p>
            For more ideas, explore
            {" "}
            <Link href="/stocking-fillers" className="underline text-[#D9A441]">
              stocking fillers
            </Link>
            {" "}
            and our
            {" "}
            <Link href="/birthday-gifts" className="underline text-[#D9A441]">
              birthday gifts
            </Link>
            {" "}
            page for ornaments and small keepsakes that work all year round.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#E5E7EB]">
              Turn a few special pieces into a tradition your family looks forward
              to every year.
            </p>
            <div className="flex gap-2">
              <Link
                href="/3-for-bundle"
                className="rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow hover:bg-[#b88c2a]"
              >
                Build ornament bundle
              </Link>
              <Link
                href="/deals"
                className="rounded-full border border-[#D9A441] px-5 py-2 text-sm font-semibold text-[#D9A441] hover:bg-[#D9A441] hover:text-black"
              >
                View Christmas deals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
