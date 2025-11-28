import type { MetadataRoute } from "next";
import { getSeoForRegion, UK_DOMAIN, US_DOMAIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const seo = getSeoForRegion();
  const base = seo.metadataBase.toString().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${base}/sitemap.xml`, `${UK_DOMAIN}/sitemap.xml`, `${US_DOMAIN}/sitemap.xml`],
    host: base,
  };
}
