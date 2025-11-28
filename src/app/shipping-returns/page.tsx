import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns | Holly Jolly Savings",
};

export default function ShippingReturnsPage() {
  return (
      <section className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          Shipping &amp; Returns
        </h1>
        <p className="text-sm text-[#E5E7EB]">
          Clear information on Christmas delivery timing, tracking and how returns
          are handled so shoppers feel confident ordering.
        </p>
      </section>
  );
}
