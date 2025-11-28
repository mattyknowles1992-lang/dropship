import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Layout } from "@/components/Layout";
import { getCurrentRegion } from "@/content/regions";
import type { Region } from "@/content/regions";
import { buildPageMetadata, getSeoForRegion } from "@/lib/seo";
import { getProductsForBundle } from "@/lib/bundleCatalog";
import { getBundleOptionForKey, type BundleKey } from "@/lib/bundles";

const BUNDLE_PATHS: Record<BundleKey, string> = {
  "3for20": "/3-for-20",
  "3for30": "/3-for-30",
  "3for50": "/3-for-50",
};

function formatBundleHeading(bundleKey: BundleKey, region: Region) {
  const option = getBundleOptionForKey(bundleKey, region);
  const priceString = option
    ? `${region === "uk" ? "£" : "$"}${option.bundlePrice.toFixed(2)}`
    : region === "uk"
      ? "£0"
      : "$0";

  const baseTitle = `3 for ${priceString.replace(/\.00$/, "")}`;
  return {
    tagline: region === "uk" ? "Christmas Gifts UK 2025" : "Christmas Gifts USA 2025",
    heading:
      region === "uk"
        ? `${baseTitle} Christmas Gift Bundle`
        : `${baseTitle} Holiday Gift Bundle`,
    description:
      region === "uk"
        ? "Build a personalised Christmas bundle for kids, teens, friends and family. Pick any qualifying gifts in this collection to unlock the bundle price — your first order still includes a FREE mystery gift."
        : "Create your own holiday bundle for kids, teens, friends and family. Choose any qualifying gifts in this collection to unlock the bundle price, plus enjoy a FREE surprise gift with your first order.",
  };
}

export async function buildBundleMetadata(bundleKey: BundleKey): Promise<Metadata> {
  const regionConfig = getCurrentRegion();
  const { heading } = formatBundleHeading(bundleKey, regionConfig.id);
  return buildPageMetadata(
    {
      title: `${heading} | Holly Jolly Savings`,
      description: formatBundleHeading(bundleKey, regionConfig.id).description,
    },
    { path: BUNDLE_PATHS[bundleKey], region: regionConfig.id },
  );
}

type BundleProductCardProps = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  image: string;
  imageAlt: string;
  tags: string[];
};

export async function renderBundlePage(bundleKey: BundleKey) {
  const regionConfig = getCurrentRegion();
  const region = regionConfig.id;
  const bundleProducts = await getProductsForBundle(region, bundleKey);
  const option = getBundleOptionForKey(bundleKey, region);
  const { tagline, heading, description } = formatBundleHeading(bundleKey, region);
  const seo = getSeoForRegion(region);
  const baseUrl = seo.metadataBase.toString().replace(/\/$/, "");
  const url = `${baseUrl}${BUNDLE_PATHS[bundleKey]}`;

  return (
    <Layout>
      <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8 lg:p-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              url,
              name: heading,
              itemListElement: bundleProducts.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${baseUrl}/products/${product.slug}`,
                name: product.title,
                image: product.image,
              })),
            }),
          }}
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
          {tagline}
        </p>
        <h1 className="text-3xl font-extrabold text-[#FFF9F2] sm:text-4xl">{heading}</h1>
        <p className="text-sm text-[#E5E7EB]">{description}</p>
        {option ? (
          <div className="flex flex-wrap gap-3 text-xs text-[#9CA3AF]">
            <span>
              Mix &amp; match any {option.minQuantity} items in this collection to unlock {regionConfig.currencySymbol}
              {option.bundlePrice.toFixed(2).replace(/\.00$/, "")}. The best price is applied automatically at checkout.
            </span>
            <span>First order bonus: FREE mystery gift.</span>
          </div>
        ) : (
          <p className="text-xs text-[#9CA3AF]">
            Bundle pricing isn&apos;t available for this region yet, but you can still browse the curated products below.
          </p>
        )}
      </section>

      <section className="mt-6 space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8 lg:p-10">
        <h2 className="text-xl font-semibold text-[#FFF9F2] sm:text-2xl">
          {bundleProducts.length > 0 ? "Bundle-ready gifts" : "Bundle is being stocked"}
        </h2>
        {bundleProducts.length === 0 ? (
          <p className="text-sm text-[#9CA3AF]">
            We&apos;re adding products to this bundle right now. Check back soon or explore other collections.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bundleProducts.map((product) => (
              <BundleProductCard key={product.id} product={product} currencySymbol={regionConfig.currencySymbol} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

type BundleProductCardComponentProps = {
  product: BundleProductCardProps;
  currencySymbol: string;
};

function BundleProductCard({ product, currencySymbol }: BundleProductCardComponentProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group space-y-3 rounded-2xl border border-[#374151] bg-black/70 p-3 text-sm text-[#E5E7EB] transition hover:-translate-y-1 hover:border-[#D9A441]/70"
    >
      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#374151] bg-black/60">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 300px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-[#FFF9F2]">{product.title}</h3>
        <p className="text-xs text-[#9CA3AF] line-clamp-2">
          {product.description ?? "Festive favourite chosen for this limited-time bundle."}
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#FBBF24]">
          {currencySymbol}
          {product.price.toFixed(2)}
          {product.compareAt ? (
            <span className="text-xs text-[#9CA3AF] line-through">
              {currencySymbol}
              {product.compareAt.toFixed(2)}
            </span>
          ) : null}
        </div>
        {product.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 text-[11px] uppercase tracking-wide text-[#D9A441]">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#D9A441]/40 bg-black/40 px-2 py-0.5 text-[10px] text-[#FFF9F2]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
