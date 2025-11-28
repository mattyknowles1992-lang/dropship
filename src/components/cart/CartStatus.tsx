"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/components/cart/CartContext";
import { getCurrentRegion } from "@/content/regions";

export function CartStatus() {
  const { totals } = useCart();
  const region = getCurrentRegion();

  const itemLabel = useMemo(() => {
    if (totals.itemCount === 0) return "Basket";
    if (totals.itemCount === 1) return "1 item";
    return `${totals.itemCount} items`;
  }, [totals.itemCount]);

  const subtotal = useMemo(() => {
    if (totals.subtotal <= 0) return "0.00";
    return totals.subtotal.toFixed(2);
  }, [totals.subtotal]);

  return (
    <Link
      href="/basket"
      className="group relative flex items-center gap-2 rounded-full border border-[#D9A441]/60 bg-black/80 px-3 py-1.5 text-[11px] font-semibold text-[#FBBF24] shadow-lg shadow-black/40 transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
      aria-label={`Open basket – ${itemLabel}`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9A441] text-[10px] font-bold text-black transition group-hover:bg-[#FBBF24]">
        {totals.itemCount}
      </span>
      <div className="flex flex-col leading-none text-left">
        <span>{itemLabel}</span>
        <span className="text-[10px] font-normal text-[#FFECD1]/80">
          {region.currencySymbol}
          {subtotal}
        </span>
      </div>
    </Link>
  );
}
