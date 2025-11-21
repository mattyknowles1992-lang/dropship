import type { MetadataRoute } from "next";
import { getSeoForRegion, UK_DOMAIN, US_DOMAIN } from "@/lib/seo";
import { PUBLIC_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const seo = getSeoForRegion();
  const base = seo.metadataBase.toString().replace(/\/$/, "");
  const now = new Date();

  return PUBLIC_ROUTES.map((path) => {
    const url = `${base}${path}`;
    return {
      url,
      lastModified: now,
      changeFrequency: "daily",
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          "en-GB": `${UK_DOMAIN}${path}`,
          "en-US": `${US_DOMAIN}${path}`,
        },
      },
    };
  });
}
