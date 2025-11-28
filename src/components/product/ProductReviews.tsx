import { getReviewsForProduct } from "@/content/reviews";

type ProductReviewsProps = {
  slug: string;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${filled ? "text-[#FBBF24]" : "text-[#4B5563]"}`}
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function ProductReviews({ slug }: ProductReviewsProps) {
  const reviews = getReviewsForProduct(slug);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0;

  return (
    <section className="space-y-4 rounded-2xl border border-[#374151] bg-black/60 p-4 text-sm text-[#E5E7EB]">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-[#FFF9F2]">Customer reviews</h2>
        {reviews.length > 0 ? (
          <div className="flex items-center gap-1 text-[#FBBF24]">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">
              {averageRating.toFixed(1)} / 5 ({reviews.length})
            </span>
          </div>
        ) : (
          <span className="text-xs text-[#9CA3AF]">Be the first to review this item.</span>
        )}
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="space-y-2 rounded-xl border border-[#2B2B2B] bg-black/70 p-3 shadow-inner shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#FBBF24]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} filled={index < review.rating} />
                ))}
              </div>
              <p className="text-xs text-[#9CA3AF]">
                {new Date(review.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <h3 className="text-sm font-semibold text-[#FFF9F2]">{review.title}</h3>
            <p className="text-xs text-[#E5E7EB]">{review.content}</p>
            <p className="text-[11px] text-[#9CA3AF]">— {review.author}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
