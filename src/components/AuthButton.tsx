"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[11px] text-[#111827] shadow-sm shadow-black/10"
        disabled
      >
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#D1D5DB]" />
        <span>Checking account...</span>
      </button>
    );
  }

  if (!session) {
    return (
      <Link
        href="/auth"
        className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-3.5 py-1.5 text-[11px] font-semibold text-[#F9FAFB] shadow-sm shadow-black/30 transition hover:bg-[#B3202A]"
      >
        <span>Sign in</span>
        <span className="hidden text-[10px] font-normal text-[#E5E7EB] sm:inline">
          / Register
        </span>
      </Link>
    );
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "";
  const initial = firstName ? firstName[0]?.toUpperCase() : "U";

  return (
    <button
      onClick={() => signOut()}
      className="inline-flex items-center gap-2 rounded-full bg-[#B3202A] px-3.5 py-1.5 text-[11px] font-semibold text-[#FFF9F2] shadow-sm shadow-black/30 transition hover:bg-[#991B1F]"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FEE2E2] text-[10px] font-bold text-[#B3202A]">
        {initial}
      </span>
      <span>Sign out</span>
    </button>
  );
}
