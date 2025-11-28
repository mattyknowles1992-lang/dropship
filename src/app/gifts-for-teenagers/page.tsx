import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";

export default function GiftsForTeenagersPage() {
  const region = getCurrentRegion();
  const isUK = region.id === "uk";

  return (
    <Layout>
      <section className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          Christmas Gifts for Teenagers 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Buying Christmas gifts for teenagers in 2025 doesn’t have to be impossible — even if they “don’t know what they want”! Our handpicked Gifts for Teenagers UK collection includes fun, trendy, practical and affordable presents for both teen boys and teen girls. Even better, you can choose any 3 gifts for £20, and we’ll include a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Trendy, Fun &amp; Practical Gifts Teens Actually Like
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Teenagers can be picky, but this collection focuses on gifts that are popular, useful and fun in 2025. From quirky accessories and mini gadgets to creative items, lifestyle essentials, sentimental pieces and stocking fillers, each gift is selected to feel modern and exciting. These are items teens love to use, personalise, show off and share on social media.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Teen Boys &amp; Teen Girls
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for your daughter, son, niece, nephew, older siblings or friends, this range covers every personality — sporty teens, creative teens, organised teens, gamer teens, fashion-lovers and more. The selection is also perfect for teens who claim they “don’t need anything” or “aren’t bothered,” making your gift search much easier.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle is ideal for parents shopping for multiple kids, siblings making gifts for one another or families building personalised Christmas bundles. With fast UK delivery and guaranteed dispatch before 18 December 2025, you can shop confidently even if you’ve left things late.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Perfect for Stockings, Secret Santa &amp; Christmas Eve Boxes
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              These gifts are ideal for under-£10 presents, stocking fillers and school or family Secret Santa gifts for teenagers.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 teen collection below and build a custom bundle they&apos;ll genuinely love.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Finding Christmas gifts for teenagers in 2025 doesn&apos;t have to be stressful — even if they&apos;re impossible to shop for! Our curated Gifts for Teenagers USA collection includes fun, aesthetic, practical and budget-friendly presents for both teen boys and teen girls. Choose any 3 gifts for $25, and we&apos;ll include a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Cool, Useful &amp; Aesthetic Gifts Teens Love
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 2025 teen range focuses on what&apos;s trending right now. Think creative items, mini gadgets, cute accessories, everyday essentials, funny stocking stuffers and cool pieces they&apos;ll want to show off online. These gifts are designed to feel modern, relevant and genuinely exciting — not boring or predictable.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Teen Boys &amp; Teen Girls
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for your son, daughter, niece, nephew, friend or sibling, this collection includes something for every type of teen — sporty, creative, organised, fashion-forward, or tech-loving. These are great gift ideas for teens who claim they “don’t care,” “don’t know,” or “want something different.”
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gift Ideas for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can create a personalised gift pack or shop for multiple teens at once. Fast U.S. shipping ensures your gifts arrive in plenty of time for Christmas, even if you’re a last-minute shopper. The FREE first-order bonus gift adds an extra surprise they’ll love.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Stocking Stuffers, Secret Santa &amp; Quick Holiday Gifts
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Looking for under-$10 presents or stocking stuffers? This page is the perfect place to start.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Explore the 2025 teen collection below and build a holiday bundle they’ll actually enjoy.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
