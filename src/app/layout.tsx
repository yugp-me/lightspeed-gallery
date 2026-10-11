import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { siteAssetUrl } from "@/lib/siteAssets";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ogImage = settings.ogImageFileName ? new URL(siteAssetUrl("og", settings.ogImageFileName), baseUrl) : undefined;
  return { metadataBase: new URL(baseUrl), title: settings.ogTitle, description: settings.ogDescription, icons: settings.faviconFileName ? { icon: siteAssetUrl("favicon", settings.faviconFileName) } : undefined, openGraph: { title: settings.ogTitle, description: settings.ogDescription, type: "website", images: ogImage ? [ogImage] : undefined }, twitter: { card: ogImage ? "summary_large_image" : "summary", title: settings.ogTitle, description: settings.ogDescription, images: ogImage ? [ogImage] : undefined } };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${spaceGrotesk.variable} ${dmMono.variable}`}>{children}</body></html>;
}