import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { getCurrentRegion } from "@/content/regions";
import { Snowfall } from "@/components/Snowfall";
import { MainNav } from "@/components/MainNav";
import type { AssetConfig } from "@/content/assets";
import { defaultAssets } from "@/content/assets";

type LayoutProps = {
  children: ReactNode;
  assets?: AssetConfig;
};

export function Layout({ children, assets }: LayoutProps) {
  const region = getCurrentRegion();
  const resolvedAssets = assets ?? defaultAssets;

  return (
    <div className="relative min-h-screen text-[#1A1A1A]">
      <div
        className="fixed inset-0 -z-10 bg-[url('/backgrounds/bg-main.jpg')] bg-cover bg-center bg-no-repeat bg-black"
        aria-hidden="true"
      />
      <Snowfall />
      <div className="border-b border-[#D9A441]/40 bg-[rgba(255,8,0,0.85)] text-[11px] text-[#FFF9F2]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <p>
            🎁 Order by <span className="font-semibold">22 December</span> for guaranteed
            Christmas delivery across the UK.
          </p>
          <p className="flex gap-3">
            <span>Free Christmas returns until 15 January</span>
            <span className="hidden border-l border-[#D9A441]/40 pl-3 sm:inline">
              24/7 support via email & chat
            </span>
          </p>
        </div>
      </div>
      <header className="sticky top-0 z-20 border-b border-[#D9A441]/40 bg-[#FFF9F2]/95 text-[#1A1A1A] shadow-md shadow-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src={resolvedAssets.logo}
              alt="Holly Jolly Savings logo"
              width={100}
              height={100}
              className="rounded-full object-cover shadow-[0_0_40px_rgba(179,32,42,1)]"
            />
            <div className="leading-tight">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F3D2E]">
                Holly Jolly Savings
              </div>
              <div className="text-[11px] text-[#4B5563]">
                Warm, trusted gifts for UK Christmas shoppers
              </div>
            </div>
          </Link>
          <MainNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-14 text-[#FFF9F2]">{children}</main>
      <footer className="border-t border-[#D9A441]/40 bg-[rgba(255,8,0,0.9)] py-8 text-[11px] text-[#FFF9F2]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-[2fr_1.5fr_1.5fr]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
              About {region.siteName}
            </p>
            <p>
              Curated Christmas gifts, stocking fillers and Secret Santa ideas with
              tracked delivery across the UK.
            </p>
          </div>
          <div className="space-y-2" id="shipping">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Customer care
            </p>
            <ul className="space-y-1.5">
              <li>Shipping & Christmas delivery</li>
              <li>Returns & exchanges</li>
              <li>Order tracking</li>
              <li>Contact support</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Trust & security
            </p>
            <ul className="space-y-1.5">
              <li>Secure payments (Visa, Mastercard, PayPal, Klarna)</li>
              <li>Encrypted checkout</li>
              <li>Verified suppliers & tracking</li>
              <li>Extended Christmas returns</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {region.siteName}. All rights reserved.
          </p>
          <p>
            Optimised for UK Christmas gift buyers looking for trusted online presents.
          </p>
        </div>
      </footer>
    </div>
  );
}
