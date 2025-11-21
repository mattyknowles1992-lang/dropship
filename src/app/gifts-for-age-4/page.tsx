import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/gifts-for-age-4" });
}


export default function GiftsForAge4Page() {
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
          Christmas Gifts for 4-Year-Olds 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Four-year-olds are imaginative, energetic and full of personality — and Christmas is the perfect time to surprise them with fun and educational gifts that support early development. Our 2025 Gifts for 4-Year-Olds UK collection includes exciting toys, creative activities and playful accessories, all chosen to help spark curiosity and confidence.
            </p>
            <p className="text-sm text-[#E5E7EB]">
              Choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Creative &amp; Learning-Focused Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              At age four, children love hands-on play, pretend scenarios, pattern recognition and activities that allow them to express themselves. That’s why our collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Pretend-play toys</li>
              <li>Creative craft items</li>
              <li>Early learning activities</li>
              <li>Colourful sensory toys</li>
              <li>Bath toys</li>
              <li>Imagination-building sets</li>
              <li>Outdoor play accessories</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              All items are designed to help support fine motor skills, creativity, social skills and early problem-solving — while keeping fun at the centre of every moment.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great Gifts for Both Boys &amp; Girls
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they love dinosaurs, princesses, cars, animals, arts and crafts or sensory fun, this page includes gender-neutral gift ideas suitable for every child. These are perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Christmas stockings</li>
              <li>Christmas Eve boxes</li>
              <li>Preschool-aged gift bundles</li>
              <li>Family gift exchanges</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Ideal for parents, aunties, uncles, grandparents and godparents.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable, High-Value Christmas Gifts 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-£20 bundle, you can build a personalised gift set without overspending — or shop for multiple children at once. Fast UK delivery and guaranteed dispatch before 18 December 2025 means stress-free Christmas shopping.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Make Christmas Magical for Your 4-Year-Old
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and build a Christmas bundle filled with imagination, learning and joy.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Four-year-olds are at an exciting stage where creativity, imagination and early learning come together — and our 2025 Gifts for 4-Year-Olds USA collection is packed with fun, colourful and educational toys perfect for preschoolers. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Creative, Playful &amp; Development-Boosting Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Children at this age love activities that let them play pretend, explore creatively and learn new skills. This collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Pretend-play toys</li>
              <li>Craft and creative sets</li>
              <li>Early learning toys</li>
              <li>Sensory toys</li>
              <li>Imaginative accessories</li>
              <li>Colourful bath items</li>
              <li>Outdoor play toys</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These gifts help support early cognitive development, language skills, problem-solving, creativity and social play — while keeping things fun and exciting.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Perfect for Boys &amp; Girls Age 4
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether they love animals, cars, crafts, characters or colourful interactive toys, this page includes a variety of gender-neutral gifts. Ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday stockings</li>
              <li>Preschool gift bundles</li>
              <li>Family gift exchanges</li>
              <li>Classroom Secret Santa</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for parents, grandparents, aunties, uncles and family friends.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Holiday Gifts for 2025
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can mix and match fun, educational and practical toys without going over budget. Fast U.S. shipping ensures everything arrives before Christmas — even if you shop late.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Create a Magical Christmas for Your 4-Year-Old
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and build a Christmas gift bundle they’ll absolutely love.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
