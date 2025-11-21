import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return buildPageMetadata(undefined, { path: "/christmas-eve-box-gifts" });
}


export default function ChristmasEveBoxGiftsPage() {
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
          Christmas Eve Box Gifts 2025
        </h1>
        {isUK ? (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Make Christmas Eve magical with our 2025 Christmas Eve Box Gifts UK collection — filled with cosy, fun and festive items perfect for building excitement before the big day. Whether you’re creating a box for children, teens or the whole family, you can choose any 3 gifts for £20, and receive a FREE mystery Christmas gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Festive, Cosy &amp; Family-Friendly Christmas Eve Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Christmas Eve boxes are all about comfort, excitement and creating memories. Our collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Festive mini toys</li>
              <li>Christmas-themed accessories</li>
              <li>Cute novelty items</li>
              <li>Sensory toys & fidgets</li>
              <li>Bedtime-friendly gifts</li>
              <li>Cosy themed surprises</li>
              <li>Practical essentials for Christmas Day</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for children of all ages — and even adults who love adding a little magic to Christmas Eve.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Christmas Eve Box Gifts for Kids, Teens &amp; Families
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These gifts are perfect for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Kids aged 0–12</li>
              <li>Teens</li>
              <li>Siblings & cousins</li>
              <li>Parents & grandparents</li>
              <li>Family Christmas Eve traditions</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Everything here fits easily into a Christmas Eve box and helps set the scene for a cosy, festive evening together.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Eve Box Fillers (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Thanks to our 3-for-£20 bundle, you can create beautiful Christmas Eve boxes for multiple children without overspending. With fast UK delivery and guaranteed dispatch before 18 December 2025, your Christmas Eve boxes will be ready on time.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Create a Magical Christmas Eve 2025
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the full 2025 collection below and fill your Christmas Eve box with festive fun and cosy surprises.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#E5E7EB]">
              Bring excitement and warmth to your holiday traditions with our 2025 Christmas Eve Box Gifts USA collection — filled with fun, festive and cosy items perfect for building the holiday mood. Choose any 3 gifts for $25, and receive a FREE bonus gift with your first order.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Festive, Fun &amp; Cozy Christmas Eve Ideas
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              Christmas Eve boxes are a growing family tradition in the US — and these small gifts help set the perfect mood. Our collection includes:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Holiday-themed toys</li>
              <li>Cute accessories</li>
              <li>Festive mini items</li>
              <li>Sensory toys</li>
              <li>Cozy bedtime-friendly gifts</li>
              <li>Fun novelty surprises</li>
              <li>Practical essentials for Christmas morning</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Perfect for kids, teens and parents wanting to build a memorable holiday experience.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Great for Kids, Teens &amp; Family Traditions
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              These gifts fit perfectly inside a Christmas Eve box and are ideal for:
            </p>
            <ul className="list-disc ml-6 text-sm text-[#E5E7EB]">
              <li>Young kids</li>
              <li>Pre-teens & teens</li>
              <li>Siblings</li>
              <li>Parents & grandparents</li>
              <li>Family Christmas Eve rituals</li>
            </ul>
            <p className="text-sm text-[#E5E7EB]">
              Whether you want something festive, fun or comforting — this collection has the perfect mix.
            </p>
            <h2 className="text-xl font-semibold text-[#FFF9F2]">
              Affordable Christmas Eve Box Gifts (2025)
            </h2>
            <p className="text-sm text-[#E5E7EB]">
              With our 3-for-$25 bundle, you can build Christmas Eve boxes for your entire family without going over budget. Fast U.S. shipping ensures everything arrives on time, even for last-minute planners.
            </p>
            <h3 className="text-lg font-semibold text-[#FFF9F2]">
              Build a Magical Christmas Eve
            </h3>
            <p className="text-sm text-[#E5E7EB]">
              Browse the 2025 collection below and fill your Christmas Eve box with festive fun and cozy surprises.
            </p>
          </>
        )}
      </section>
    </Layout>
  );
}
