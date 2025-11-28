"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import type { BundleOption } from "@/lib/bundles";

export type ProductActionPayload = {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  bundleOptions: BundleOption[];
  currencySymbol: string;
};

type StatusMessage = {
  type: "basket" | "bundle";
  message: string;
};

export function ProductDetailActions({
  id,
  slug,
  title,
  image,
  price,
  bundleOptions,
  currencySymbol,
}: ProductActionPayload) {
  const { addItem, addBundleItem } = useCart();
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const handleAddToBasket = () => {
    addItem(
      {
        productId: id,
        slug,
        title,
        image,
        price,
      },
      1,
    );
    setStatus({
      type: "basket",
      message: `Added to basket – ${currencySymbol}${price.toFixed(2)}`,
    });
  };

  const handleAddToBundle = (option: BundleOption) => {
    addBundleItem(
      {
        productId: id,
        slug,
        title,
        image,
        price,
      },
      option,
    );
    setStatus({
      type: "bundle",
      message: `Added to bundle: ${option.minQuantity} for ${currencySymbol}${option.bundlePrice.toFixed(2)}`,
    });
  };

  return (
    <section className="space-y-3 rounded-2xl border border-[#D9A441]/60 bg-black/85 p-4 text-sm text-[#E5E7EB]">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#FFF9F2]">Choose how you’d like to buy</h2>
        <p className="text-xs text-[#9CA3AF]">
          Mix and match with our festive bundles or add straight to your basket. Bundles automatically apply the best price once you collect enough qualifying items.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToBasket}
          className="rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-[#D9A441]/30 transition hover:bg-[#FBBF24]"
        >
          Add to basket – {currencySymbol}
          {price.toFixed(2)}
        </button>
        {bundleOptions.length > 0 ? (
          bundleOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleAddToBundle(option)}
              className="rounded-full border border-[#D9A441]/60 px-5 py-2 text-sm font-semibold text-[#FFF9F2] transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
            >
              Add to {option.minQuantity} for {currencySymbol}
              {option.bundlePrice.toFixed(2)} bundle
            </button>
          ))
        ) : (
          <span className="rounded-full border border-[#374151] px-5 py-2 text-center text-xs text-[#9CA3AF] sm:self-center">
            Bundle pricing not available for this item yet
          </span>
        )}
      </div>
      {status ? (
        <p
          className={`text-xs ${
            status.type === "basket" ? "text-[#FBBF24]" : "text-[#34D399]"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </section>
  );
}
