import { Layout } from "@/components/Layout";
import Link from "next/link";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cozy Winter Gift Set | Warm & Relaxing Gifts",
  description:
    "Explore the Cozy Winter Gift Set from Holly Jolly Savings — a curated mix of warm, relaxing Christmas gifts for friends, partners and parents.",
};

export default function CozyWinterGiftSetPage() {
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
            Cozy Winter Gift Set
          </h1>
          <p className="text-sm text-[#E5E7EB]">
            A calm, comforting bundle of winter gifts ideal for partners,
            parents, grandparents and close friends who deserve a little extra
            relaxation this Christmas.
          </p>
        </header>

        <div className="space-y-4 text-sm text-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#FFF9F2]">Gift set idea</h2>
          <p>
            Use the 3-for-{isUK ? "£20" : "$25"} deal to put together a cosy trio, for
            example:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Soft winter accessories or cosy socks</li>
            <li>A relaxing self-care or pamper item</li>
            <li>A small feel-good treat or bedtime extra</li>
          </ul>

          <h2 className="text-lg font-semibold text-[#FFF9F2]">Perfect for</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Husbands, wives and partners</li>
            <li>Mums / moms and dads</li>
            <li>Grandparents who love a quiet cosy night in</li>
            <li>Friends or coworkers who need a little pick-me-up</li>
          </ul>

          <p>
            Pair this set with ideas from
            {" "}
            <Link href="/gifts-for-her" className="underline text-[#D9A441]">
              gifts for her
            </Link>
            {" "}
            and
            {" "}
            <Link href="/gifts-for-him" className="underline text-[#D9A441]">
              gifts for him
            </Link>
            {" "}
            or browse
            {" "}
            <Link href="/gifts-under-10" className="underline text-[#D9A441]">
              gifts under {isUK ? "£10" : "$10"}
            </Link>
            {" "}
            to add thoughtful little extras.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#E5E7EB]">
              Create a gift that feels like a warm hug in a box.
            </p>
            <div className="flex gap-2">
              <Link
                href="/3-for-bundle"
                className="rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow hover:bg-[#b88c2a]"
              >
                Build cozy set
              </Link>
              <Link
                href="/gifts"
                className="rounded-full border border-[#D9A441] px-5 py-2 text-sm font-semibold text-[#D9A441] hover:bg-[#D9A441] hover:text-black"
              >
                Browse all gifts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
