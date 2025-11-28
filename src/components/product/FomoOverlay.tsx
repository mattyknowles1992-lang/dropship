"use client";

import { useEffect, useMemo, useState } from "react";

const NAMES = [
  "Sarah from Leeds",
  "James in Manchester",
  "Emily from Glasgow",
  "Owen in Cardiff",
  "Liam from Dublin",
  "Sophie in Bristol",
  "Chloe from Edinburgh",
];

function pickRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function pickMinutes() {
  return Math.floor(Math.random() * 35) + 5; // 5–39 minutes
}

export function FomoOverlay({ productName }: { productName: string }) {
  const [visible, setVisible] = useState(false);

  const message = useMemo(() => {
    const name = pickRandom(NAMES);
    const minutes = pickMinutes();
    return `${name} ordered ${productName} ${minutes} minutes ago.`;
  }, [productName]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <aside className="fixed bottom-6 left-6 z-40 w-72 max-w-[90vw] rounded-3xl border border-[#D9A441]/70 bg-black/80 p-4 text-sm text-[#FFF9F2] shadow-2xl shadow-black/70 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FBBF24]">Hot right now</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="rounded-full border border-[#374151] px-2 py-0.5 text-[10px] text-[#9CA3AF] transition hover:border-[#F87171] hover:text-[#F87171]"
        >
          Close
        </button>
      </div>
      <p className="mt-3 text-xs text-[#E5E7EB]">{message}</p>
      <p className="mt-2 text-[11px] text-[#34D399]">165 people viewed this item in the last 24 hours.</p>
    </aside>
  );
}
