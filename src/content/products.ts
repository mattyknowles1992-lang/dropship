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
};

const BASE_PRODUCTS: Product[] = [
  {
    id: "cozy-christmas-mug",
    slug: "cozy-christmas-mug",
    name: "Cozy Christmas Cocoa Mug",
    description:
      "A festive ceramic mug with a Christmas pattern, perfect for hot chocolate by the tree and winter evenings.",
    price: 14.99,
    image: "/products/cozy-mug.jpg",
    category: "gifts-for-her",
    badges: ["Best seller", "Stocking filler"],
    source: {
      supplier: "aliexpress",
      externalId: "cozy-christmas-mug-123",
      url: "https://www.aliexpress.com/",
    },
  },
  {
    id: "winter-knit-scarf",
    slug: "winter-knit-scarf",
    name: "Winter Knit Christmas Scarf",
    description:
      "Warm knit scarf with subtle Christmas colours – a classic Christmas gift for him or her.",
    price: 29.99,
    image: "/products/scarf.jpg",
    category: "gifts-for-him",
    badges: ["New", "Christmas essential"],
    source: {
      supplier: "cjdropshipping",
      externalId: "winter-knit-scarf-456",
      url: "https://cjdropshipping.com/",
    },
  },
  {
    id: "kids-activity-set",
    slug: "kids-activity-set",
    name: "Christmas Kids Activity Set",
    description:
      "A Christmas craft and colouring kit that keeps kids busy while waiting for Santa.",
    price: 19.99,
    image: "/products/activity-set.jpg",
    category: "gifts-for-kids",
    badges: ["Great for families"],
  },
  {
    id: "secret-santa-socks",
    slug: "secret-santa-socks",
    name: "Funny Christmas Secret Santa Socks",
    description:
      "Festive socks with a fun Christmas slogan – ideal Secret Santa gift under $20/£15.",
    price: 9.99,
    image: "/products/socks.jpg",
    category: "secret-santa",
    badges: ["Under 20", "Office favourite"],
  },
];

export function listProductsByCategory(
  region: Region,
  category: CategorySlug
): Product[] {
  const multiplier = region === "uk" ? 0.85 : 1;

  return BASE_PRODUCTS.filter((p) => p.category === category).map((p) => ({
    ...p,
    price: parseFloat((p.price * multiplier).toFixed(2)),
  }));
}

export function getProductBySlug(
  region: Region,
  slug: string
): Product | null {
  const multiplier = region === "uk" ? 0.85 : 1;
  const base = BASE_PRODUCTS.find((p) => p.slug === slug);
  if (!base) return null;
  return { ...base, price: parseFloat((base.price * multiplier).toFixed(2)) };
}
