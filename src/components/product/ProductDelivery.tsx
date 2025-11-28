import type { RegionConfig } from "@/content/regions";

function formatCurrency(amount: number, currencySymbol: string) {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

type ProductDeliveryProps = {
  region: RegionConfig;
  shippingUk: number | null;
  shippingUs: number | null;
};

export function ProductDelivery({ region, shippingUk, shippingUs }: ProductDeliveryProps) {
  const isUK = region.id === "uk";
  const currency = region.currencySymbol;
  const shippingCost = isUK ? shippingUk : shippingUs;

  return (
    <section className="space-y-3 rounded-2xl border border-[#374151] bg-black/60 p-4 text-sm text-[#E5E7EB]">
      <h2 className="text-lg font-semibold text-[#FFF9F2]">Delivery &amp; Dispatch</h2>
      <ul className="space-y-2 text-xs sm:text-sm">
        <li>
          <span className="font-semibold text-[#FBBF24]">Dispatch:</span> Orders ship within 24 hours from our UK sorting hub.
        </li>
        <li>
          <span className="font-semibold text-[#FBBF24]">Estimated arrival:</span> {isUK ? "2-4 working days across the UK" : "4-7 working days across the USA"} with tracked courier partners.
        </li>
        <li>
          <span className="font-semibold text-[#FBBF24]">Delivery cost:</span> {shippingCost != null
            ? formatCurrency(shippingCost, currency)
            : `${currency}3.95 standard delivery (free on bundle orders)`}
        </li>
        <li>
          <span className="font-semibold text-[#FBBF24]">Christmas cut-off:</span> Guaranteed delivery before 24 December when you order by 18 December 2025.
        </li>
      </ul>
    </section>
  );
}
