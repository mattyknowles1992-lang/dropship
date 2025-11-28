import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas Gifts for Her 2025 | Holly Jolly Savings",
};

export default function ForHerPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          Christmas Gifts for Her 2025
        </h1>

        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding the perfect Christmas gift for her in 2025 has never been
              easier. Whether you&apos;re shopping for your girlfriend, wife, mum,
              sister, daughter or a close friend, our curated &quot;Gifts for
              Her&quot; collection is filled with thoughtful, stylish and
              affordable presents she&apos;ll truly love. Even better — you can
              choose any 3 gifts for just £20, and we&apos;ll add a FREE mystery
              Christmas gift with your first order.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Thoughtful, Cute &amp; Affordable Gift Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 range blends quality with affordability, offering
              handpicked gifts that fit perfectly into stockings, Christmas Eve
              boxes or gift bundles. Expect a mix of cosy self-care items,
              sentimental keepsakes, fun accessories, mini beauty treats,
              creative gifts and everyday essentials she&apos;ll actually use.
              Every product is selected to deliver maximum delight without
              stretching your Christmas budget.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Every Woman in Your Life
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Shopping for women can feel overwhelming, but this collection
              takes the guesswork out. Whether she prefers cute, practical,
              stylish or meaningful gifts, you&apos;ll find something that suits
              her personality. Perfect for mums, partners, sisters, Secret Santa
              swaps, teenagers, students, teachers and more.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Make Christmas 2025 Extra Special
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can build a personalised gift set
              or shop for multiple people at once. Fast UK delivery and
              guaranteed Christmas dispatch before 18 December 2025 ensures your
              gifts arrive on time, even for last-minute shoppers.
            </p>

            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect Stocking Fillers &amp; Secret Santa Gifts
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              This page is ideal for anyone looking for under-£10 gifts,
              stocking fillers or budget-friendly Christmas surprises. Explore
              the collection below and create the perfect 2025 Christmas gift
              bundle for her today.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Looking for the perfect Christmas gift for her in 2025? Whether
              you&apos;re shopping for your girlfriend, wife, mom, sister,
              daughter or a friend, our &quot;Gifts for Her&quot; collection brings
              together thoughtful, fun and affordable items she&apos;ll genuinely
              appreciate. Choose any 3 gifts for just $25, and we&apos;ll include a
              FREE bonus gift with your first order.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Cute, Practical &amp; Meaningful Gift Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 women&apos;s collection focuses on gifts that feel special
              without being expensive. Expect cosy accessories, self-care items,
              mini beauty treats, sentimental keepsakes, clever everyday
              essentials and stylish stocking stuffers. Every product is
              selected to be both affordable and delightful — perfect for
              building a personalised holiday bundle.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Every Woman on Your List
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether she loves comfort, creativity, humor or simple practical
              gifts, this collection includes something for every type of woman.
              Ideal for moms, partners, sisters, friends, teens, teachers,
              co-workers and Secret Santa exchanges.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Make Holiday Shopping Easy
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-$25 bundle deal lets you shop for multiple people at
              once or create a tailored set just for her. With fast U.S.
              shipping and a free first-order bonus gift, holiday gifting
              becomes effortless and more exciting.
            </p>

            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Stocking Stuffers, Secret Santa &amp; Last-Minute Gifts
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              These budget-friendly gift ideas are perfect for stockings,
              office gift swaps or quick last-minute holiday shopping. Browse
              the 2025 &quot;Gifts for Her&quot; collection below and build your
              holiday bundle today.
            </p>
          </>
        )}
      </section>
  );
}
