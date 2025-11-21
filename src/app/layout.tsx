import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { buildPageMetadata } from "@/lib/seo";
import { ClientLayout } from "@/components/ClientLayout";
import { Layout } from "@/components/Layout";
import { getAssets } from "@/lib/assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return buildPageMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const assets = await getAssets();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <Layout assets={assets}>{children}</Layout>
        </ClientLayout>
      </body>
    </html>
  );
}
