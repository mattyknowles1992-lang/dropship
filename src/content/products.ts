import { Region } from "./regions";
import type { CategorySlug } from "./categories";
import type { SupplierProductSource } from "@/lib/suppliers";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategorySlug;
  badges?: string[];
  source?: SupplierProductSource;
  /** If set, restricts visibility by region; empty or undefined = all regions */
  regions?: Region[];
};


export const BASE_PRODUCTS: Product[] = [
  {
    id: "cozy-christmas-mug",
    slug: "cozy-christmas-mug",
    name: "Cozy Christmas Cocoa Mug",
    description:
      "A festive ceramic mug with a Christmas pattern, perfect for hot chocolate by the tree and winter evenings.",
    price: 14.99,
    image: "/uploads/cozy-mug.jpg",
    category: "gifts-for-her",
    badges: ["Best seller", "Stocking filler"],
    source: {
      supplier: "aliexpress",
      externalId: "cozy-christmas-mug-123",
      url: "https://www.aliexpress.com/",
    },
    regions: ["uk", "us"],
  },
  {
    id: "winter-knit-scarf",
    slug: "winter-knit-scarf",
    name: "Winter Knit Christmas Scarf",
    description:
      "Warm knit scarf with subtle Christmas colours – a classic Christmas gift for him or her.",
    price: 29.99,
    image: "/uploads/scarf.jpg",
    category: "gifts-for-him",
    badges: ["New", "Christmas essential"],
    source: {
      supplier: "cjdropshipping",
      externalId: "winter-knit-scarf-456",
      url: "https://cjdropshipping.com/",
    },
    regions: ["uk", "us"],
  },
  {
    id: "kids-activity-set",
    slug: "kids-activity-set",
    name: "Christmas Kids Activity Set",
    description:
      "A Christmas craft and colouring kit that keeps kids busy while waiting for Santa.",
    price: 19.99,
    image: "/uploads/activity-set.jpg",
    category: "gifts-for-kids",
    badges: ["Great for families"],
    regions: ["uk", "us"],
  },
  {
    id: "secret-santa-socks",
    slug: "secret-santa-socks",
    name: "Funny Christmas Secret Santa Socks",
    description:
      "Festive socks with a fun Christmas slogan – ideal Secret Santa gift under $20/£15.",
    price: 9.99,
    image: "/uploads/socks.jpg",
    category: "secret-santa",
    badges: ["Under 20", "Office favourite"],
    regions: ["uk", "us"],
  },
  {
    id: "santa-hats-velvet-green-trim",
    slug: "santa-hats-velvet-green-trim",
    name: "Santa Hats Velvet Christmas Hat Xmas Holiday Hat",
    description:
      "Fashionable Design: Comfortable lining and furry green cuffs provide warmth and comfort, making them a perfect Christmas dress to easily create a Christmas atmosphere. Comfortable Material: These fluffy Santa hats are made of plush, fluffy, and soft fur for warmth. They bring warmth and happiness during cold winters and are suitable for most adults, men, and women.",
    price: 3,
    image: "/uploads/santa-hat-model-1.jpg",
    category: "stocking-fillers",
    badges: ["New", "Stocking filler"],
    source: {
      supplier: "cjdropshipping",
      externalId: "CJYS255243501AZ",
      url: "https://cjdropshipping.com",
    },
    regions: ["uk", "us"],
  },
];

export function listProductsByCategory(
  region: Region,
  category: CategorySlug
): Product[] {
  const multiplier = region === "uk" ? 0.85 : 1;

  return BASE_PRODUCTS.filter((p) => {
    if (p.category !== category) return false;
    if (!p.regions || p.regions.length === 0) return true;
    return p.regions.includes(region);
  }).map((p) => ({
    ...p,
    price: parseFloat((p.price * multiplier).toFixed(2)),
  }));
}

export function getProductBySlug(
  region: Region,
  slug: string
): Product | null {
  const multiplier = region === "uk" ? 0.85 : 1;
  const base = BASE_PRODUCTS.find((p) => {
    if (p.slug !== slug) return false;
    if (!p.regions || p.regions.length === 0) return true;
    return p.regions.includes(region);
  });
  if (!base) return null;
  return { ...base, price: parseFloat((base.price * multiplier).toFixed(2)) };
}
