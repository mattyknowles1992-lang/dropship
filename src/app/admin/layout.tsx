import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/90 p-5 shadow-lg shadow-black/70 sm:p-8">
      <header className="flex items-center justify-between gap-4 border-b border-[#D9A441]/40 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Admin
          </p>
          <h1 className="text-lg font-bold text-[#FFF9F2]">Site Settings</h1>
        </div>
        <span className="rounded-full bg-[#111827] px-3 py-1 text-xs text-[#E5E7EB]">
          Basic CMS (preview)
        </span>
      </header>
      {children}
    </section>
  );
}
