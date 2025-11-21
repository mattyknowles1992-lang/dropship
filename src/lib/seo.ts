import type { Metadata } from "next";
import { getCurrentRegion, REGIONS } from "@/content/regions";

export type RegionId = "uk" | "us";

export const UK_DOMAIN = "https://hollyjollysavings.co.uk";
export const US_DOMAIN = "https://hollyjollysavings.com";

export const seoUK = {
  metadataBase: new URL(UK_DOMAIN),
  title: {
    default: "Christmas Gifts UK 2025 | 3 Gifts for £20 + FREE Gift",
    template: "%s | Christmas Gifts UK 2025",
  },
  description:
    "Shop the best Christmas gifts in the UK for 2025! Choose any 3 gifts for £20 + get a FREE mystery gift. Gift ideas for him, her, mum, dad, boys, girls & kids aged 0-12. Fast UK delivery. Order by 18 Dec 2025.",
  keywords: [
    "christmas gifts uk 2025",
    "3 for 20 gifts uk",
    "gifts for him uk",
    "gifts for her uk",
    "kids christmas gifts uk",
    "gifts for mum",
    "gifts for dad",
    "stocking fillers uk",
    "gifts for 10 year olds uk",
    "gifts for 6 year olds uk",
    "christmas presents 2025",
  ],
  openGraph: {
    title: "Christmas Gifts UK 2025 | 3 Gifts for £20 + FREE Gift",
    description:
      "Top UK Christmas gifts for 2025 - mix & match any 3 gifts for £20 + get a free bonus gift. For him, her, kids, mum, dad, teens & more.",
    url: UK_DOMAIN,
    type: "website",
    locale: "en_GB",
    images: ["/og-image-uk.jpg"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Christmas Gifts UK 2025 | Best Value Gift Deals",
    description:
      "3 gifts for £20 + free gift for first-time customers. Fast UK delivery. Shop now.",
    images: ["/og-image-uk.jpg"],
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Holly Jolly Savings UK",
    url: UK_DOMAIN,
    image: `${UK_DOMAIN}/logo-holly-jolly.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
  },
};

export const seoUS = {
  metadataBase: new URL(US_DOMAIN),
  title: {
    default: "Christmas Gifts USA 2025 | 3 Gifts for $25 + FREE Gift",
    template: "%s | Christmas Gifts USA 2025",
  },
  description:
    "Shop top Christmas gifts in the USA for 2025! Mix & match any 3 gifts for $25 and get a FREE bonus gift. Gift ideas for him, her, mom, dad, boys, girls & kids 0-12. Fast U.S. shipping.",
  keywords: [
    "christmas gifts usa 2025",
    "3 for 25 gifts",
    "gifts for him usa",
    "gifts for her usa",
    "gifts for mom",
    "gifts for dad",
    "kids gifts usa",
    "stocking stuffers usa",
    "holiday gifts 2025",
  ],
  openGraph: {
    title: "Christmas Gifts USA 2025 | 3 Gifts for $25 + Free Gift",
    description:
      "Holiday gifts for him, her, mom, dad & kids (0-12). Get 3 gifts for $25 + free first-order bonus gift.",
    url: US_DOMAIN,
    type: "website",
    locale: "en_US",
    images: ["/og-image-us.jpg"],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Christmas Gifts USA 2025 | Holiday Deals",
    description:
      "3 gifts for $25 + free gift with first order. Fast U.S. shipping. Shop now.",
    images: ["/og-image-us.jpg"],
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Holly Jolly Savings USA",
    url: US_DOMAIN,
    image: `${US_DOMAIN}/logo-holly-jolly.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  },
};

export function getSeoForRegion(regionEnv?: string) {
  const region = (regionEnv || process.env.NEXT_PUBLIC_REGION || "uk").toLowerCase();
  return region === "us" ? seoUS : seoUK;
}

type BuildOptions = {
  path?: string;
  region?: "uk" | "us";
};

export function buildPageMetadata(
  overrides?: Partial<Metadata>,
  options?: BuildOptions,
): Metadata {
  const region =
    REGIONS[(options?.region as "uk" | "us") ?? getCurrentRegion().id] ??
    REGIONS.uk;
  const seo = region.id === "us" ? seoUS : seoUK;

  const path = options?.path ?? "/";
  const canonical = `${seo.metadataBase.toString().replace(/\/$/, "")}${path}`;
  const ogBase = { ...seo.openGraph, url: canonical };

  return {
    metadataBase: seo.metadataBase,
    title: overrides?.title ?? seo.title,
    description: overrides?.description ?? seo.description,
    keywords: overrides?.keywords ?? seo.keywords,
    openGraph: {
      ...ogBase,
      ...(overrides?.openGraph ?? {}),
    },
    twitter: {
      ...seo.twitter,
      ...(overrides?.twitter ?? {}),
    },
    alternates: {
      canonical,
      languages: {
        "en-GB": `${UK_DOMAIN}${path}`,
        "en-US": `${US_DOMAIN}${path}`,
      },
    },
    ...overrides,
  };
}
