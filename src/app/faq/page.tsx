import Link from "next/link";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas FAQs 2025 | Holly Jolly Savings",
};

export default function FaqPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">Frequently asked questions</h1>
          <p className="text-sm text-[#E5E7EB]">
            Quick answers to the most common Christmas shopping questions about delivery,
            returns and how our 3-for-{isUK ? "£20" : "$25"} bundle works.
          </p>
        </header>

        <div className="space-y-4 text-sm text-[#E5E7EB]">
          <div>
            <h2 className="text-base font-semibold text-[#FFF9F2]">How long does delivery take?</h2>
            <p>
              Delivery times vary slightly depending on the items in your order, but most
              parcels arrive within 7–14 days. We&apos;ll always show an estimated window at
              checkout, and you&apos;ll receive tracking once your order ships.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#FFF9F2]">Will my order arrive before Christmas?</h2>
            <p>
              We recommend ordering by the dates shown on our homepage banner for guaranteed
              delivery before Christmas in your region. The earlier you order, the more
              choice you&apos;ll have and the more relaxed you can be.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#FFF9F2]">How does the 3-for-{isUK ? "£20" : "$25"} deal work?</h2>
            <p>
              Simply add any 3 eligible gifts to your basket and your total will update to
              {" "}
              {isUK ? "£20" : "$25"} automatically. It&apos;s our easiest way to build a bundle for
              kids, family members or friends without overthinking it.
            </p>
            <p className="mt-1">
              You can read more and see examples on our
              {" "}
              <Link href="/3-for-bundle" className="underline text-[#D9A441]">
                3-for bundle page
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#FFF9F2]">What is your returns policy?</h2>
            <p>
              We offer extended Christmas returns so you can shop with confidence. If
              something arrives damaged or not as expected, contact us and we&apos;ll help put it
              right.
            </p>
            <p className="mt-1">
              Full details are available on our
              {" "}
              <Link href="/shipping-returns" className="underline text-[#D9A441]">
                Shipping &amp; Returns
              </Link>
              {" "}
              page.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#FFF9F2]">How can I contact you?</h2>
            <p>
              The fastest way to reach us is by email. Our support team typically replies
              within 24 hours, and often much quicker during peak season.
            </p>
            <p className="mt-1">
              Visit our
              {" "}
              <Link href="/contact" className="underline text-[#D9A441]">
                Contact
              </Link>
              {" "}
              page for details.
            </p>
          </div>
        </div>
      </section>
  );
}
