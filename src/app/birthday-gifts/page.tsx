import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/birthday-gifts" });
}


export default function BirthdayGiftsPage() {
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
          Birthday Gifts 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Celebrate their special day with fun, thoughtful and memorable gifts from our 2025 Birthday Gifts UK collection. Whether you&apos;re shopping for kids, teens, friends or family members, you&apos;ll find exciting mini gifts that make birthdays feel extra special. Even better — choose any 3 gifts for £20, and get a FREE surprise gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Fun, Creative &amp; Memorable Birthday Gift Ideas</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Sensory toys & fidgets</li>
              <li>Creative mini kits</li>
              <li>Fun novelty items</li>
              <li>Practical little presents</li>
              <li>Small toys for kids</li>
              <li>Festive birthday surprises</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for adding to gift bags, birthday hampers or party treats.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Birthday Gifts for All Ages (2025)</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Toddlers & young children</li>
              <li>Ages 0–12</li>
              <li>Teens</li>
              <li>Young adults</li>
              <li>Friends</li>
              <li>Parents</li>
              <li>Grandparents</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re buying for a family member or a classmate, we&apos;ve got something they&apos;ll love.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Affordable Birthday Presents on Any Budget</h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can mix and match multiple gifts for birthday celebrations without overspending — ideal for kids’ party season or big families. Fast UK delivery ensures your gifts arrive in time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">Shop the Best Birthday Gifts 2025</h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the UK collection below and make every birthday feel unforgettable.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make every birthday feel unforgettable with fun, thoughtful and exciting gifts from our 2025 Birthday Gifts USA collection. Perfect for kids, teens, friends, parents and everyone in between. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Fun, Cute &amp; Creative Birthday Presents</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Cute accessories</li>
              <li>Sensory & fidget toys</li>
              <li>Creative small kits</li>
              <li>Fun novelty items</li>
              <li>Practical mini gifts</li>
              <li>Kids’ birthday toys</li>
              <li>Little surprises for all ages</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Great for gift bags, birthday baskets or party treats.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Birthday Gifts for All Ages (2025)</h2>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids</li>
              <li>Tweens & teens</li>
              <li>Adults</li>
              <li>Moms & dads</li>
              <li>Grandparents</li>
              <li>Friends</li>
              <li>Coworkers</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether it&apos;s a small birthday surprise or an extra treat, we&apos;ve got the perfect pick.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">Budget-Friendly Birthday Gifts</h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-$25 bundle makes birthday gifting easy and affordable — especially for families or those celebrating multiple birthdays throughout the year. Fast U.S. shipping ensures on-time delivery.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">Shop the Best Birthday Gifts 2025</h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the USA birthday collection and make every celebration fun and memorable.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
