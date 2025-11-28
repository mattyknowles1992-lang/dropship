import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-3" });
}


export default function GiftsForAge3Page() {
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
          Christmas Gifts for 3-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              By age three, children are bursting with imagination, creativity and confidence — which makes choosing Christmas gifts for them incredibly fun. Our 2025 Gifts for 3-Year-Olds UK collection is filled with engaging, colourful and development-focused toys perfect for curious toddlers who love to play and explore. Choose any 3 gifts for £20, and we’ll include a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Imaginative, Educational &amp; Play-Focused Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Three-year-olds love pretend play, building, creating and discovering new things. That’s why our collection includes sensory toys, role-play items, early learning games, creative accessories, fun bath toys, stacking sets and imagination-building toys — all safe, durable and perfect for active little ones.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Early creativity</li>
              <li>Fine motor skills</li>
              <li>Colour and shape recognition</li>
              <li>Problem-solving</li>
              <li>Pretend play development</li>
              <li>Confidence and independence</li>
            </ul>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Ages 3+
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether you&apos;re shopping for a nursery-aged child, a preschooler or a lively three-year-old in the family, these gifts are ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Christmas stockings</li>
              <li>Toddler gift bundles</li>
              <li>Christmas Eve boxes</li>
              <li>Family gift exchanges</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              All gifts are suitable for both boys and girls, with lots of gender-neutral options included.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can build a personalised gift pack or shop for multiple kids at once. Enjoy fast UK delivery and guaranteed dispatch before 18 December 2025, making last-minute shopping stress-free.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Christmas Bundle They’ll Love
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and create a magical Christmas experience for your favourite 3-year-old.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Christmas is an exciting time for 3-year-olds — full of imagination, creativity and endless curiosity. Our 2025 Gifts for 3-Year-Olds USA collection includes fun, colourful and development-friendly toys perfect for preschool-aged children. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Educational &amp; Imagination-Filled Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Three-year-olds thrive on interactive play, pretend scenarios, hands-on creativity and sensory exploration. This collection includes pretend-play items, building toys, bath toys, creative accessories, early learning activities, colourful toys and fun toddler essentials — all designed to support healthy development while keeping playtime exciting.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help encourage:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Early learning</li>
              <li>Imagination</li>
              <li>Coordination</li>
              <li>Creative thinking</li>
              <li>Problem-solving</li>
              <li>Confidence and independence</li>
            </ul>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great for Boys &amp; Girls Ages 3+
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for toddlers and preschoolers, these gifts work well for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Christmas gift bundles</li>
              <li>Preschool-age gift sets</li>
              <li>Family gifting</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              All items are suitable for both boys and girls and chosen with safety and durability in mind.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match educational and fun toddler toys at great value. Fast U.S. shipping ensures your gifts arrive in plenty of time for Christmas, even for last-minute shoppers.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Create a Magical Christmas for Preschoolers
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and build a joyful holiday gift bundle for your favourite 3-year-old.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
