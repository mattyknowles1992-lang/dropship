"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { getCurrentRegion } from "@/content/regions";

function formatCurrency(value: number, currencySymbol: string) {
  return `${currencySymbol}${value.toFixed(2)}`;
}

type CheckoutStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

export function CheckoutForm() {
  const { items, totals, clearCart } = useCart();
  const region = getCurrentRegion();
  const [status, setStatus] = useState<CheckoutStatus>({ state: "idle" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
  });

  const disabled = items.length === 0 || status.state === "submitting";

  const bundleSummary = useMemo(() => {
    if (totals.bundleSummaries.length === 0) return null;
    return totals.bundleSummaries
      .map((bundle) => `${bundle.bundleCount} × ${bundle.label}`)
      .join(" • ");
  }, [totals.bundleSummaries]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;

    const missingField = Object.entries(form).find(([, value]) => value.trim().length === 0);
    if (missingField) {
      setStatus({ state: "error", message: "Please complete all checkout fields." });
      return;
    }

    setStatus({ state: "submitting" });

    setTimeout(() => {
      setStatus({ state: "success" });
      clearCart();
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
    >
      <section className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 text-sm text-[#E5E7EB] shadow-lg shadow-black/70">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#FFF9F2]">Checkout</h1>
          <p className="text-xs text-[#9CA3AF]">Enter your delivery details so we can prepare your festive order.</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-xs">
            <span className="text-[#FBBF24]">Full name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-md border border-[#374151] bg-black/70 px-3 py-2 text-sm text-[#FFF9F2] focus:border-[#FBBF24] focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="text-[#FBBF24]">Email address</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-md border border-[#374151] bg-black/70 px-3 py-2 text-sm text-[#FFF9F2] focus:border-[#FBBF24] focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-xs sm:col-span-2">
            <span className="text-[#FBBF24]">Delivery address</span>
            <input
              type="text"
              required
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="w-full rounded-md border border-[#374151] bg-black/70 px-3 py-2 text-sm text-[#FFF9F2] focus:border-[#FBBF24] focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="text-[#FBBF24]">Town / City</span>
            <input
              type="text"
              required
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              className="w-full rounded-md border border-[#374151] bg-black/70 px-3 py-2 text-sm text-[#FFF9F2] focus:border-[#FBBF24] focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="text-[#FBBF24]">Postcode / ZIP</span>
            <input
              type="text"
              required
              value={form.postcode}
              onChange={(event) => setForm((prev) => ({ ...prev, postcode: event.target.value }))}
              className="w-full rounded-md border border-[#374151] bg-black/70 px-3 py-2 text-sm text-[#FFF9F2] focus:border-[#FBBF24] focus:outline-none"
            />
          </label>
        </div>

        <p className="text-[11px] text-[#9CA3AF]">
          Payments are processed securely. You&apos;ll receive a confirmation email once your order is packed.
        </p>

        {status.state === "error" ? (
          <p className="rounded-md border border-[#F87171]/60 bg-[#7F1D1D]/40 px-3 py-2 text-[11px] text-[#FECACA]">
            {status.message}
          </p>
        ) : null}
        {status.state === "success" ? (
          <p className="rounded-md border border-[#34D399]/60 bg-[#064E3B]/40 px-3 py-2 text-[11px] text-[#BBF7D0]">
            Thank you! Your order is confirmed. We&apos;ve emailed a receipt and will send tracking once it ships.
          </p>
        ) : null}
      </section>

      <aside className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 text-sm text-[#E5E7EB] shadow-lg shadow-black/70">
        <div>
          <h2 className="text-lg font-semibold text-[#FFF9F2]">Order summary</h2>
          <p className="text-xs text-[#9CA3AF]">You have {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} in your basket.</p>
        </div>

        <ul className="space-y-3 text-xs">
          {items.map((item) => (
            <li key={item.lineId} className="flex items-center justify-between gap-2">
              <span className="max-w-[70%] text-[#E5E7EB]">
                {item.quantity} × {item.title}
              </span>
              <span className="font-semibold text-[#FBBF24]">
                {formatCurrency(item.price * item.quantity, region.currencySymbol)}
              </span>
            </li>
          ))}
        </ul>

        {bundleSummary ? (
          <p className="rounded-2xl border border-[#374151] bg-black/70 p-3 text-[11px] text-[#34D399]">
            Bundle savings applied: {bundleSummary}
          </p>
        ) : null}

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#FBBF24]">
              {formatCurrency(totals.subtotal, region.currencySymbol)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Shipping</span>
            <span>Calculated at dispatch</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={disabled}
            className="flex w-full items-center justify-center rounded-full bg-[#D9A441] px-5 py-2 text-sm font-semibold text-black shadow transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.state === "submitting" ? "Processing..." : "Place order"}
          </button>
          <Link
            href="/basket"
            className="flex w-full items-center justify-center rounded-full border border-[#D9A441]/60 px-5 py-2 text-sm font-semibold text-[#FFF9F2] transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
          >
            Return to basket
          </Link>
        </div>
      </aside>
    </form>
  );
}
