import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro, Patrick_Hand } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { getLang } from "@/lib/i18n";

const head = Playfair_Display({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-head" });
const display = Be_Vietnam_Pro({ subsets: ["latin", "latin-ext", "vietnamese"], weight: ["300", "400", "500", "600"], variable: "--font-display" });
const hand = Patrick_Hand({ subsets: ["latin", "latin-ext", "vietnamese"], weight: "400", variable: "--font-hand" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Portfolio", template: "%s | Portfolio" },
  description: "Dự án phần mềm và game của tôi.",
  openGraph: { type: "website", siteName: "Portfolio", locale: "vi_VN" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${head.variable} ${display.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}` }} />
      </head>
      <body>
        <SiteHeader lang={lang} />
        {children}
      </body>
    </html>
  );
}
