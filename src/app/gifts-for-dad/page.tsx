import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";

export default function GiftsForDadPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          Christmas Gifts for Dad 2025
        </h1>

        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding a Christmas gift for Dad that feels unique, thoughtful and genuinely useful can be challenging — but our 2025 Gifts for Dad collection makes it easy. Whether you’re shopping for your dad, step-dad, grandad, father-in-law or a father figure, this curated selection is designed to help you choose something he’ll truly appreciate. Pick any 3 gifts for £20, and enjoy a FREE mystery gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Practical, Funny &amp; Thoughtful Gifts He’ll Actually Use
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 range focuses on the kinds of gifts dads love — a mix of practical items, everyday essentials, clever gadgets, relaxing treats and light-hearted novelty gifts that bring a smile. These are perfect for building a customised gift pack or topping up his stocking with small but meaningful surprises.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Every Type of Dad
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether he’s the “DIY dad,” the “funny dad,” the “always organised dad,” the “sentimental dad,” or the “I don’t need anything” dad, you’ll find something that fits his personality. This page is also ideal for gifts for grandads and uncles, making Christmas shopping easier across the whole family.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle is perfect for building Dad a thoughtful gift set without stretching your budget. With fast, reliable UK delivery and Christmas dispatch guaranteed before 18 December 2025, even last-minute shoppers can relax.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect Stocking Fillers &amp; Family Gifting
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Looking for under-£10 gifts, stocking fillers or dad-friendly extras? You&apos;re in the right place.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Browse our 2025 collection below and create the perfect Christmas gift bundle for Dad.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding the right Christmas gift for Dad can be tough — but our 2025 Gifts for Dad collection makes it easy by combining practical, meaningful and fun items he&apos;ll actually enjoy. Whether you&apos;re buying for your dad, stepdad, grandpa, or father-in-law, you can choose any 3 gifts for $25, and we&apos;ll add a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Thoughtful, Useful &amp; Fun Gift Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 range includes everything dads love: handy tools, practical accessories, small gadgets, cosy items and funny stocking stuffers. These gifts strike the perfect balance between useful and personal, making them great for building a custom gift bundle or enhancing his stocking.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Every Kind of Dad
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether he&apos;s the practical type, the organised type, the sentimental type, or the always-joking type, this curated selection has something for him. It&apos;s also perfect for gifts for grandpas, uncles and family gift exchanges.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Simple, Affordable Holiday Shopping
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle deal, you can create a thoughtful gift set or shop for multiple family members at once. Fast U.S. shipping means your gifts arrive in plenty of time for Christmas, even if you&apos;re shopping last-minute. The FREE bonus gift is the perfect extra surprise.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Great Stocking Stuffers &amp; Secret Santa Gifts
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              If you&apos;re looking for under-$10 gifts or stocking stuffers for Dad, this is the perfect place to start.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Explore the full 2025 collection below and build the perfect holiday bundle for Dad.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
