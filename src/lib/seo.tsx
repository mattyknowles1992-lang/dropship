import { ReactNode } from "react";
import { getCurrentRegion } from "@/content/regions";
import type { Metadata } from "next";

export function buildPageMetadata(
  overrides?: Partial<Metadata>
): Metadata {
  const region = getCurrentRegion();

  const baseTitle = region.defaultTitle;
  const baseDescription = region.defaultDescription;

  return {
    title: overrides?.title ?? baseTitle,
    description: overrides?.description ?? baseDescription,
    openGraph: {
      title: overrides?.title ?? baseTitle,
      description: overrides?.description ?? baseDescription,
      siteName: region.siteName,
    },
    ...overrides,
  };
}

type SeoSectionProps = {
  children: ReactNode;
};

export function ChristmasKeywordBlock({ children }: SeoSectionProps) {
  return (
    <section className="mt-10 space-y-4 text-sm text-zinc-200">
      {children}
    </section>
  );
}
