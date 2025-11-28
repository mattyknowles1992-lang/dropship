import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas Gifts for Him 2025 | Holly Jolly Savings",
};

export default function ForHimPage() {
  const region = getCurrentRegion();

  const isUK = region.id === "uk";

  return (
    <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          Christmas Gifts for Him 2025
        </h1>

        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding the perfect Christmas gift for him doesn&apos;t have to be
              difficult. Whether you&apos;re shopping for your boyfriend,
              husband, dad, brother, son, or a friend, our 2025 collection is
              packed with unique, affordable and meaningful presents designed to
              make him smile. Even better — you can choose any 3 gifts for just
              £20, and we&apos;ll include a FREE mystery gift with your first
              order.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Our curated &quot;Gifts for Him&quot; range includes everything from
              funny stocking fillers to practical everyday items, small gadgets,
              lifestyle accessories, and thoughtful keepsakes. Each product is
              selected with quality and value in mind, making it easy to find
              something he&apos;ll genuinely enjoy without overspending this
              Christmas.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gift Ideas for Every Type of Man
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether he loves tech, enjoys a bit of humour, prefers cosy
              comforts, or appreciates useful items, this page brings together
              the best gift ideas for men in 2025. Great for partners, dads,
              brothers, Secret Santa exchanges, or last-minute Christmas
              shoppers across the UK.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable &amp; High-Quality Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              We believe Christmas gifts don&apos;t need to be expensive to feel
              special. Our 3-for-£20 bundle allows you to mix and match gifts so
              you can shop for multiple people at once or build the perfect
              stocking for him. Add fast UK delivery and guaranteed Christmas
              dispatch by 18 December 2025, and gifting becomes completely
              stress-free.
            </p>

            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stockings, Secret Santa &amp; Last-Minute Shopping
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              This page is ideal for discovering stocking fillers, under-£10
              gifts, and budget-friendly Christmas ideas he&apos;ll actually use.
              Browse the full collection below and create the perfect 2025 gift
              bundle for him today.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Shopping for the perfect Christmas gift for him in 2025? Whether
              you&apos;re buying for your boyfriend, husband, dad, brother, son or
              a close friend, our curated &quot;Gifts for Him&quot; collection
              makes holiday shopping simple, fun, and affordable. Choose any 3
              gifts for just $25, and get a FREE bonus gift with your first
              order.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 range focuses on gifts that men actually use and enjoy —
              from practical gadgets and funny stocking stuffers to cosy
              accessories and everyday essentials. Each item is selected for
              quality and value, making this the easiest way to score great
              gifts without the stress.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gift Ideas for Every Man
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether he&apos;s into humor, practicality, creativity or comfort,
              you&apos;ll find something he&apos;ll genuinely appreciate. These
              gifts are ideal for dads, partners, brothers, sons, co-workers and
              Secret Santa swaps.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifting Made Easy
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can shop for multiple people at
              once or build a perfectly curated gift set just for him. Fast U.S.
              shipping makes last-minute Christmas gifting easy, and the FREE
              first-order gift adds an extra surprise under the tree.
            </p>

            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Great for Stocking Stuffers, Secret Santa &amp; Family Gifting
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              These budget-friendly gifts are perfect for stockings, office
              exchanges, or anyone who loves a fun, thoughtful holiday
              surprise. Browse the full 2025 collection below and build your
              gift bundle for him today.
            </p>
          </>
        )}
      </section>
  );
}
