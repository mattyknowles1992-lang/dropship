export type Review = {
  id: string;
  rating: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
};

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "review-1",
    rating: 5,
    title: "Perfect festive surprise",
    author: "Sophie M.",
    content:
      "Beautiful quality and arrived quicker than expected. Part of a 3-for bundle and every item felt premium.",
    createdAt: "2025-10-12",
  },
  {
    id: "review-2",
    rating: 4,
    title: "Great value for money",
    author: "James W.",
    content:
      "Picked up a bundle for Secret Santa gifts. The packaging was lovely and everything matched the photos.",
    createdAt: "2025-11-02",
  },
  {
    id: "review-3",
    rating: 5,
    title: "Would order again",
    author: "Priya K.",
    content:
      "The gift set was a hit with my family. Customer service kept me updated on delivery – very impressed!",
    createdAt: "2025-09-28",
  },
];

const PRODUCT_REVIEWS: Record<string, Review[]> = {
  default: DEFAULT_REVIEWS,
};

export function getReviewsForProduct(slug: string): Review[] {
  return PRODUCT_REVIEWS[slug] ?? PRODUCT_REVIEWS.default;
}
