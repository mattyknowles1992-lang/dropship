import { Region } from "./regions";

export type CategorySlug =
  | "gifts-for-him"
  | "gifts-for-her"
  | "gifts-for-kids"
  | "secret-santa"
  | "stocking-fillers";

export type Category = {
  slug: CategorySlug;
  name: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
};

const baseCategories: Record<CategorySlug, Omit<Category, "name" | "intro">> = {
  "gifts-for-him": {
    slug: "gifts-for-him",
    seoTitle: "Christmas Gifts for Him 2025 | Festive Presents He'll Love",
    seoDescription:
      "Browse Christmas gifts for him 2025 – thoughtful holiday presents, cosy winter accessories and unique stocking fillers for men.",
  },
  "gifts-for-her": {
    slug: "gifts-for-her",
    seoTitle: "Christmas Gifts for Her 2025 | Cute & Cosy Gift Ideas",
    seoDescription:
      "Find Christmas gifts for her 2025 – cosy winter treats, self-care sets and personalised festive presents she will love.",
  },
  "gifts-for-kids": {
    slug: "gifts-for-kids",
    seoTitle: "Christmas Gifts for Kids 2025 | Fun Toys & Stocking Fillers",
    seoDescription:
      "Shop Christmas gifts for kids 2025 – fun toys, creative kits and magical stocking fillers for children of all ages.",
  },
  "secret-santa": {
    slug: "secret-santa",
    seoTitle: "Secret Santa Gifts 2025 | Funny & Affordable Christmas Presents",
    seoDescription:
      "Discover Secret Santa gifts 2025 – funny office presents, budget Christmas gifts and stocking fillers under $20/£15.",
  },
  "stocking-fillers": {
    slug: "stocking-fillers",
    seoTitle: "Stocking Fillers 2025 | Cheap & Fun Christmas Gifts",
    seoDescription:
      "Discover stocking fillers for Christmas 2025 – fun, affordable small gifts and last-minute Christmas treats for all ages.",
  },
};

export function getCategories(region: Region): Category[] {
  const regionPrefix = region === "uk" ? "UK " : "";

  return Object.values(baseCategories).map((cat) => {
    const nameBase = cat.slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      ...cat,
      name: `${regionPrefix}${nameBase}`,
      intro:
        "Explore Christmas gift ideas with fast UK Christmas delivery, from stocking fillers to thoughtful presents.",
    };
  });
}
