"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/for-him", label: "For Him" },
  { href: "/for-her", label: "For Her" },
  { href: "/for-kids", label: "For Kids" },
  { href: "/deals", label: "Deals" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];

export function MainNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-3">
      {/* Desktop nav */}
      <nav className="hidden items-center gap-5 text-xs font-medium text-[#374151] sm:flex">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-[#B3202A]">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop auth */}
      <div className="hidden sm:flex">
        <AuthButton />
      </div>

      {/* Mobile: menu button */}
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9A441]/60 bg-white/90 text-[#111827] shadow-sm shadow-black/30 sm:hidden"
      >
        <span className="sr-only">Toggle navigation</span>
        <span
          className={`block h-0.5 w-4 rounded-full bg-[#111827] transition-transform ${
            open ? "translate-y-[3px] rotate-45" : "-translate-y-[3px]"
          }`}
        />
        <span
          className={`block h-0.5 w-4 rounded-full bg-[#111827] transition-opacity ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-0.5 w-4 rounded-full bg-[#111827] transition-transform ${
            open ? "-translate-y-[3px] -rotate-45" : "translate-y-[3px]"
          }`}
        />
      </button>

      {/* Mobile menu panel */}
      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 rounded-2xl border border-[#D9A441]/70 bg-[#FFF9F2] p-4 text-xs text-[#111827] shadow-lg shadow-black/40 sm:hidden">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[#B3202A]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[#E5E7EB] pt-3">
            <AuthButton />
          </div>
        </div>
      )}
    </div>
  );
}

