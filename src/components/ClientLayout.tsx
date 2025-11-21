"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

type ClientLayoutProps = {
  children: ReactNode;
};

export function ClientLayout({ children }: ClientLayoutProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
