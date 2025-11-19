import Image from "next/image";

export function TrustBadges() {
  return (
    <section className="mt-10 grid gap-4 rounded-3xl border border-red-800/60 bg-black/40 p-5 text-xs text-red-100 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)]">
      <div className="space-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
          Trusted Christmas shopping
        </h2>
        <ul className="space-y-1.5 text-[11px] leading-relaxed">
          <li>• Secure checkout with SSL encryption and trusted payment providers.</li>
          <li>• Klarna &quot;Buy now, pay later&quot; available at checkout where supported.</li>
          <li>• Clear tracking links for AliExpress and CJdropshipping orders.</li>
          <li>• Easy returns on damaged or incorrect Christmas gifts.</li>
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-900 shadow-sm">
          <span>Klarna</span>
          <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[9px] font-medium text-zinc-50">
            Pay in 3
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-zinc-900 shadow-sm">
          <span>Visa</span>
          <span>·</span>
          <span>Mastercard</span>
          <span>·</span>
          <span>PayPal</span>
        </div>
        <div className="relative h-7 w-14 overflow-hidden rounded bg-white/95">
          <Image
            src="/security-lock.png"
            alt="Secure checkout badge"
            fill
            sizes="56px"
            className="object-contain p-1.5"
          />
        </div>
      </div>
    </section>
  );
}
