import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-under-5" });
}


export default function GiftsUnder5Page() {
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
          {isUK ? "Gifts Under £5 — Christmas 2025" : "Gifts Under $5 — Christmas 2025"}
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Christmas gifting doesn’t need to be expensive to feel thoughtful. Our Gifts Under £5 UK 2025 collection includes fun, festive and meaningful presents that deliver huge smiles for a tiny price. These low-cost gifts are perfect for stocking fillers, children’s gifts, Secret Santa and budget-friendly Christmas bundles. Even better — choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Cute, Fun &amp; Affordable Gifts Under £5
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re looking for last-minute Christmas ideas or small add-on presents, this collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Sensory toys & fidgets</li>
              <li>Cute accessories</li>
              <li>Mini creative toys</li>
              <li>Festive themed items</li>
              <li>Practical budget-friendly essentials</li>
              <li>Small toys for kids</li>
              <li>Fun novelty gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts may be inexpensive, but they still feel exciting, fun and full of Christmas spirit.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts Under £5 for All Ages
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These ultra-budget items are perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Children & toddlers</li>
              <li>Ages 0–12 gift bundles</li>
              <li>Teens</li>
              <li>Stocking fillers</li>
              <li>Classroom Secret Santa</li>
              <li>Family gifting</li>
              <li>Colleagues & friends</li>
              <li>Christmas Eve boxes</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              They’re low-cost, high-impact gifts that work for anyone.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget Christmas Shopping Made Easy (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can pick up multiple £5 gifts at an even better value — ideal for big families or anyone buying for several children. Fast UK delivery and guaranteed dispatch before 18 December 2025 makes Christmas shopping stress-free.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Gifts Under £5
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and find fun, festive and wallet-friendly gifts perfect for every stocking and Christmas list.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Holiday gifting on a budget just got easier. Our Gifts Under $5 USA 2025 collection includes fun, festive and meaningful gifts that cost less than a coffee — but feel thoughtful and exciting. Perfect for stocking stuffers, Secret Santa, children’s gifts and last-minute holiday surprises. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Cute &amp; Affordable Gifts Under $5
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These low-cost gifts deliver great value and holiday cheer. Discover:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Sensory & fidget toys</li>
              <li>Cute accessories</li>
              <li>Mini creative gifts</li>
              <li>Holiday-themed items</li>
              <li>Useful everyday essentials</li>
              <li>Small toys for kids</li>
              <li>Novelty fun surprises</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great quality, tiny price — and always festive.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts Under $5 for All Ages
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for gifting:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids & toddlers</li>
              <li>Tweens & teens</li>
              <li>Moms & dads</li>
              <li>Teachers & classmates</li>
              <li>Friends & coworkers</li>
              <li>Stocking stuffers</li>
              <li>Secret Santa</li>
              <li>Family gatherings</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts make it easy to spread Christmas cheer without overspending.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget-Friendly Holiday Gifting 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-$25 bundle lets you stock up on multiple under-$5 gifts while saving more. Fast U.S. shipping ensures your presents arrive in time for Christmas — ideal for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Gifts Under $5
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and fill stockings, gift bags and Secret Santa exchanges with fun and festive surprises.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
