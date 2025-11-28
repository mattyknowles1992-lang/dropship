import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews | Holly Jolly Savings",
  description:
    "Read real customer reviews of Holly Jolly Savings. See why families across the UK and USA trust us for Christmas gifts, stocking fillers and holiday bundles.",
};

export default function ReviewsPage() {
  const region = getCurrentRegion();

  return (
    <Layout>
      <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Customer reviews
          </p>
          <h1 className="text-2xl font-bold text-[#FFF9F2] sm:text-3xl">
            What families say about {region.siteName}
          </h1>
          <p className="text-sm text-[#E5E7EB]">
            We love helping families create magical Christmas moments on a sensible budget. Here are a few of the reviews we’ve received from shoppers across the UK and USA.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="space-y-2 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="text-[#FBBF24]">★★★★★</p>
            <p>
              &quot;Very happy with the 3-for bundle. I managed to sort out gifts for all three of my kids without going over budget.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">— Emma L., Manchester (UK)</p>
          </article>

          <article className="space-y-2 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="text-[#FBBF24]">★★★★★</p>
            <p>
              &quot;The gifts were better than I expected for the price. Perfect for stocking fillers and little extras.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">— Daniel K., Ohio (USA)</p>
          </article>

          <article className="space-y-2 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="text-[#FBBF24]">★★★★★</p>
            <p>
              &quot;Shipping to the U.S. was faster than I expected and the bundle deal made it really affordable to treat all my nieces and nephews. Love the mix of practical and fun gifts.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">— Amanda C., New York (USA)</p>
          </article>

          <article className="space-y-2 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="text-[#FBBF24]">★★★★★</p>
            <p>
              &quot;Customer support were really helpful when I had a question about delivery times. Everything turned up well before Christmas and the kids were over the moon with their gifts.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">— Priya S., Birmingham (UK)</p>
          </article>

          <article className="space-y-2 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="text-[#FBBF24]">★★★★★</p>
            <p>
              &quot;The site makes it really easy to find age-appropriate gifts. I loved the ideas for Christmas Eve boxes and stocking stuffers. Everything felt thought-through and festive.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">— Kelly R., Chicago (USA)</p>
          </article>

          <article className="space-y-2 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]">
            <p className="text-[#FBBF24]">★★★★★</p>
            <p>
              &quot;Great selection, clear prices and no nasty surprises at checkout. The 3-for deal is perfect for big families like ours. Highly recommend.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">— James T., Glasgow (UK)</p>
          </article>
        </div>

        <footer className="space-y-2 border-t border-[#D9A441]/30 pt-4 text-sm text-[#E5E7EB]">
          <p>
            We aim to keep every experience smooth, from browsing and checkout to delivery and unboxing on Christmas morning. If you ever have an issue with your order, our support team is on hand to help.
          </p>
        </footer>
      </section>
    </Layout>
  );
}
