"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { getCurrentRegion } from "@/content/regions";

function formatCurrency(value: number, currencySymbol: string) {
  return `${currencySymbol}${value.toFixed(2)}`;
}

export function CartPageContent() {
  const { items, totals, updateQuantity, removeLine, clearCart } = useCart();
  const region = getCurrentRegion();

  if (items.length === 0) {
    return (
      <div className="space-y-5 rounded-3xl border border-[#D9A441]/60 bg-black/80 p-6 text-sm text-[#E5E7EB] shadow-lg shadow-black/60">
        <h1 className="text-2xl font-semibold text-[#FFF9F2]">Your basket is empty</h1>
        <p className="text-xs text-[#9CA3AF]">
          Start building your Christmas basket with gifts and festive bundles. Everything ships with tracked delivery across the {region.id === "uk" ? "UK" : "USA"}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/gifts"
            className="rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow hover:bg-[#FBBF24]"
          >
            Browse all gifts
          </Link>
          <Link
            href="/deals"
            className="rounded-full border border-[#D9A441]/60 px-5 py-2 text-sm font-semibold text-[#FFF9F2] hover:border-[#FBBF24]"
          >
            View Christmas deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 text-sm text-[#E5E7EB] shadow-lg shadow-black/70">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#FFF9F2]">Your Christmas basket</h1>
          <p className="text-xs text-[#9CA3AF]">
            Review, adjust or remove items. Bundle pricing is applied automatically when you hit the qualifying quantity.
          </p>
        </header>

        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.lineId}
              className="grid gap-3 rounded-2xl border border-[#374151] bg-black/70 p-4 sm:grid-cols-[120px_minmax(0,1fr)_auto]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#2B2B2B] bg-black/60">
                <Image src={item.image} alt={item.title} fill sizes="120px" className="object-cover" />
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-[#FFF9F2] underline">
                  {item.title}
                </Link>
                <p className="text-[#9CA3AF]">
                  Line total: {formatCurrency(item.price * item.quantity, region.currencySymbol)}
                </p>
                {item.bundleKey ? (
                  <p className="text-[11px] text-[#FBBF24]">Bundle savings applied</p>
                ) : null}
              </div>
              <div className="flex flex-col items-end justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 text-[11px] text-[#9CA3AF]">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.lineId, Number(event.target.value))}
                    className="w-14 rounded-md border border-[#374151] bg-black/80 px-2 py-1 text-right text-[#FFF9F2]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeLine(item.lineId)}
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F87171] hover:text-[#FCA5A5]"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9CA3AF]">
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-[#374151] px-4 py-1 text-[#F87171] transition hover:border-[#F87171] hover:text-[#FCA5A5]"
          >
            Clear basket
          </button>
          <span className="rounded-full border border-[#374151] px-4 py-1 text-[#9CA3AF]">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} saved for later
          </span>
        </div>
      </section>

      <aside className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 text-sm text-[#E5E7EB] shadow-lg shadow-black/70">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[#FFF9F2]">Order summary</h2>
          <p className="text-xs text-[#9CA3AF]">Subtotal updates automatically as you change quantities.</p>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold text-[#FBBF24]">
              {formatCurrency(totals.subtotal, region.currencySymbol)}
            </dd>
          </div>
        </dl>

        {totals.bundleSummaries.length > 0 ? (
          <div className="space-y-2 rounded-2xl border border-[#374151] bg-black/70 p-3 text-[11px]">
            <p className="font-semibold text-[#FBBF24]">Bundle savings</p>
            <ul className="space-y-1 text-[#9CA3AF]">
              {totals.bundleSummaries.map((bundle) => (
                <li key={bundle.key}>
                  {bundle.label} · {bundle.bundleCount} bundle{bundle.bundleCount === 1 ? "" : "s"}
                  {bundle.remainderQuantity > 0
                    ? ` + ${bundle.remainderQuantity} at full price`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow transition hover:bg-[#FBBF24]"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/gifts"
            className="flex w-full items-center justify-center rounded-full border border-[#D9A441]/60 px-5 py-2 text-sm font-semibold text-[#FFF9F2] transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}
