export const PRODUCT_PAGE_OPTIONS = [
  { slug: "for-him", label: "For Him" },
  { slug: "for-her", label: "For Her" },
  { slug: "for-kids", label: "For Kids" },
  { slug: "deals", label: "Deals" },
] as const;

export type ProductPageSlug = (typeof PRODUCT_PAGE_OPTIONS)[number]["slug"];
