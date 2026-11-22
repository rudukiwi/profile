import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const head = {variable:""};
const display = {variable:""};
const hand = {variable:""};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Portfolio", template: "%s | Portfolio" },
  description: "Dự án phần mềm và game của tôi.",
  openGraph: { type: "website", siteName: "Portfolio", locale: "vi_VN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${head.variable} ${display.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}` }} />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
