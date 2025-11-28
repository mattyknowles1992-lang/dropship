import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo";
import { getCurrentRegion } from "@/content/regions";
import { getBundleLabel } from "@/lib/bundles";
import { getProductBySlug } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDelivery } from "@/components/product/ProductDelivery";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { FomoOverlay } from "@/components/product/FomoOverlay";

function formatCurrency(value: number, symbol: string) {
  return `${symbol}${value.toFixed(2)}`;
}

type ProductPageParams = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const { slug } = params;
  const region = getCurrentRegion();
  const product = await getProductBySlug(slug, region.id);
  if (!product) {
    return buildPageMetadata({ title: "Product not found" });
  }

  return buildPageMetadata(
    {
      title: `${product.title} | Christmas Gifts 2025`,
      description: product.description ?? `${product.title} – festive gift idea from Holly Jolly Savings.`,
      openGraph: {
        images: [product.image],
      },
    },
    { path: `/products/${product.slug}` },
  );
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = params;
  const region = getCurrentRegion();
  const product = await getProductBySlug(slug, region.id);

  if (!product) {
    notFound();
  }
  const currency = region.currencySymbol;
  const gallery = product.gallery.length > 0 ? product.gallery : [];
  const bundleOptions = product.bundleOptions;

  return (
    <>
      <FomoOverlay productName={product.title} />
      <main className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/90 p-5 shadow-lg shadow-black/70 sm:p-8 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery featured={product.image} gallery={gallery} alt={product.imageAlt ?? product.title} />

        <section className="space-y-5 rounded-3xl border border-[#374151] bg-black/70 p-5 text-sm text-[#E5E7EB]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Festive gift · Updated {product.updatedAt.toLocaleDateString("en-GB")}
            </p>
            <h1 className="text-3xl font-bold text-[#FFF9F2] sm:text-4xl">{product.title}</h1>
            {product.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#D9A441]/40 bg-black/60 px-2 py-0.5 text-[#FBBF24]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-1 text-lg font-semibold text-[#FBBF24]">
            <div>
              {formatCurrency(product.price, currency)}
              {product.compareAt ? (
                <span className="ml-2 text-base font-normal text-[#9CA3AF] line-through">
                  {formatCurrency(product.compareAt, currency)}
                </span>
              ) : null}
            </div>
            {bundleOptions.length > 0 ? (
              <p className="text-xs text-[#9CA3AF]">
                Qualifies for {bundleOptions.map((option) => getBundleLabel(option, region.id)).join(" · ")}
              </p>
            ) : (
              <p className="text-xs text-[#9CA3AF]">Eligible for our festive returns promise.</p>
            )}
          </div>

          {product.description ? (
            <p className="text-sm leading-relaxed text-[#E5E7EB]">{product.description}</p>
          ) : null}

          <div className="space-y-2 text-xs text-[#9CA3AF]">
            {product.supplier ? <p>Fulfilled via {product.supplier}</p> : null}
            {product.sourceUrl ? (
              <p>
                Source link: <a href={product.sourceUrl} className="text-[#FBBF24] underline" rel="noopener noreferrer" target="_blank">View supplier</a>
              </p>
            ) : null}
          </div>

          <ProductDetailActions
            id={product.id}
            slug={product.slug}
            title={product.title}
            image={product.image}
            price={product.price}
            bundleOptions={bundleOptions}
            currencySymbol={currency}
          />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ProductDelivery region={region} shippingUk={product.shippingUk} shippingUs={product.shippingUs} />
        <ProductReviews slug={product.slug} />
      </div>

      <section className="space-y-3 rounded-2xl border border-[#374151] bg-black/60 p-4 text-sm text-[#E5E7EB]">
        <h2 className="text-lg font-semibold text-[#FFF9F2]">More product photos</h2>
        {gallery.length === 0 ? (
          <p className="text-xs text-[#9CA3AF]">Additional photos are coming soon for this gift.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[product.image, ...gallery]
              .filter((src, index, arr) => arr.indexOf(src) === index)
              .map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#2B2B2B] bg-black/50"
                >
                  <Image src={src} alt={product.imageAlt ?? product.title} fill sizes="(min-width: 1024px) 300px, 100vw" className="object-cover" />
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
    </>
  );
}
