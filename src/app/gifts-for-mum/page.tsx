import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";

export default function GiftsForMumOrMomPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          {isUK ? "Christmas Gifts for Mum 2025" : "Christmas Gifts for Mom 2025"}
        </h1>

        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Nothing feels better than finding a Christmas gift that truly shows
              Mum how much she means to you. Our 2025 Gifts for Mum collection is
              filled with thoughtful, sentimental and practical presents she&apos;ll
              love — all at incredible value. Choose any 3 gifts for £20, and
              we&apos;ll include a FREE mystery Christmas gift with your first
              order.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Whether your mum loves cosy comforts, heartfelt keepsakes,
              self-care treats or something fun and unexpected, this curated
              selection makes it easy to find the perfect present without
              overspending.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Thoughtful, Heartfelt &amp; Affordable Gift Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              From relaxing home items and small pampering gifts to meaningful
              accessories and everyday essentials, each product has been chosen
              to make Mum smile. These gifts are perfect for Christmas stockings,
              Christmas Eve boxes, Secret Santa within the family or building a
              personalised gift bundle just for her.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Every Type of Mum
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether she&apos;s the organised type, the sentimental type, the
              practical type or the &quot;I don&apos;t need anything&quot; type, we&apos;ve
              included options she&apos;ll genuinely appreciate. Great for new mums,
              busy mums, grandmothers, step-mums and mother-figures in your life.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Make Christmas 2025 Extra Special
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle makes gifting simple, flexible and affordable
              — ideal for creating a personalised gift pack or sharing gifts
              across multiple family members. With fast UK delivery and Christmas
              dispatch guaranteed before 18 December 2025, you can shop
              last-minute without stress.
            </p>

            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stockings &amp; Family Gift Bundles
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              &quot;Little extras&quot; that make Christmas morning feel more special.
              Mum-approved surprises, you&apos;re in the right place. Explore the
              collection below and create a Christmas gift Mum will truly love in
              2025.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make Christmas 2025 extra special for Mom with a gift that shows
              how much you appreciate her. Our curated &quot;Gifts for Mom&quot; collection
              includes thoughtful, comforting and fun presents — all at great
              value. Pick any 3 gifts for just $25, and we&apos;ll include a FREE
              bonus gift with your first order.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for your mom, stepmom, grandmother or a
              mother-figure in your life, you&apos;ll find something here that feels
              personal, meaningful and perfect for the holidays.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Thoughtful, Meaningful &amp; Budget-Friendly Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              From self-care treats and cosy home items to sentimental
              accessories and everyday essentials, each item is chosen to bring
              joy without breaking your budget. These items make great stocking
              stuffers, small holiday surprises, or a perfectly curated gift
              bundle just for her.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Every Type of Mom
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether she loves calming moments, cute accessories, practical
              gifts or anything that makes life a bit easier, this collection
              offers something she&apos;ll truly appreciate. Great for moms of all
              ages — new moms, grandmas, stepmoms and beyond.
            </p>

            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Easy Holiday Shopping for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-$25 bundle deal makes gifting simple and cost-effective.
              Build a personalised set or shop for multiple people at the same
              time. With fast U.S. shipping and a free bonus gift for new
              customers, holiday gifting becomes stress-free and fun.
            </p>

            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stocking Stuffers &amp; Last-Minute Gifts
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              If you&apos;re looking for under-$10 gifts or affordable stocking
              stuffers, this page is the perfect place to start. Browse the full
              2025 collection below and build a gift bundle Mom will love.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
