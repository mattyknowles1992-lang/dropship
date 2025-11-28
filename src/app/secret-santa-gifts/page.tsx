import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/secret-santa-gifts" });
}


export default function SecretSantaGiftsPage() {
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
          Secret Santa Gifts 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Shopping for Secret Santa in 2025 doesn’t need to be stressful — or expensive. Our Secret Santa Gifts UK 2025 collection includes fun, thoughtful and budget-friendly presents perfect for coworkers, classmates, friends and family. Choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Smart &amp; Budget-Friendly Secret Santa Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether your Secret Santa budget is £5, £10 or £20, we’ve got a gift that fits. Our collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Funny novelty gifts</li>
              <li>Practical mini items</li>
              <li>Cute accessories</li>
              <li>Sensory toys & fidgets</li>
              <li>Creative surprises</li>
              <li>Festive themed items</li>
              <li>Universal “safe” gifts</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              These are perfect when you don’t know the person well — or when you want something fun without being awkward or boring.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Secret Santa Gifts for Work, School &amp; Family
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These gifts work for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Office Secret Santa</li>
              <li>Work colleagues</li>
              <li>Managers & team members</li>
              <li>School Secret Santa</li>
              <li>Friends & family</li>
              <li>Neighbours and club groups</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether you want funny, practical or thoughtful, this page has something for every personality.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Christmas Gifts That Stay Within Budget (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-£20 bundle makes it easy to buy for multiple Secret Santa exchanges or get backup gifts just in case. With fast UK delivery and guaranteed dispatch before 18 December 2025, you can relax knowing your Secret Santa gift will arrive on time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Find the Perfect Secret Santa Gift 2025
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse our 2025 selection and pick a Secret Santa gift that gets a smile — without going over budget.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make your Secret Santa gift unforgettable with our Secret Santa Gifts USA 2025 collection — packed with fun, thoughtful and budget-friendly ideas perfect for coworkers, classrooms, friends and family. Choose any 3 gifts for $25, and get a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Fun, Affordable &amp; Crowd-Pleasing Secret Santa Gifts
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Whether your Secret Santa limit is $5, $10 or $20, we’ve got great options. Our collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Funny novelty gifts</li>
              <li>Practical everyday items</li>
              <li>Cute accessories</li>
              <li>Sensory toys & fidgets</li>
              <li>Creative mini gifts</li>
              <li>Festive holiday items</li>
              <li>“Safe” gifts for anyone</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for when you don’t know the person well — or when you want something that works for every personality.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Gifts for Work, School &amp; Family Secret Santa
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These Secret Santa gifts work for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Office holiday parties</li>
              <li>Coworkers & bosses</li>
              <li>School gift exchanges</li>
              <li>Family gatherings</li>
              <li>Friends & neighbors</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether you’re shopping for a colleague, a classmate or a family member, these gifts are designed to be fun, simple and universally liked.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Budget-Friendly Holiday Gifts (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Our 3-for-$25 bundle lets you mix and match multiple gifts for Secret Santa exchanges without overspending. Fast U.S. shipping ensures everything arrives before the holidays.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Shop the Best Secret Santa Gifts 2025
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and choose a Secret Santa gift that’s fun, festive and budget-friendly.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
