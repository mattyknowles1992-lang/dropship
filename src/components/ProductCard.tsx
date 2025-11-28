import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/content/products";
import { getCurrentRegion } from "@/content/regions";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const region = getCurrentRegion();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-red-700/40 bg-black/40 shadow-lg shadow-red-950/40 transition hover:-translate-y-1 hover:border-red-400/70"
    >
      <div className="relative h-52 w-full overflow-hidden bg-red-950/60">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-sm font-semibold tracking-tight text-red-50">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs text-red-100/80">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span className="font-semibold text-red-200">
            {region.currencySymbol}
            {product.price.toFixed(2)}
          </span>
          <div className="flex flex-col items-end gap-1">
            <div className="flex flex-wrap justify-end gap-1">
              {product.badges?.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-red-800/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-red-100"
                >
                  {badge}
                </span>
              ))}
            </div>
            {product.source && (
              <span className="text-[9px] text-red-200/80">
                Fulfilled via {product.source.supplier === "aliexpress" ? "AliExpress" : "CJdropshipping"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
