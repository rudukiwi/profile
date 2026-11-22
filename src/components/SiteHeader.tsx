"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  const home = usePathname() === "/";
  const nav = (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <Link href="/" className="hover:text-signal">Trang chủ</Link>
      <Link href="/about" className="hover:text-signal">Giới thiệu</Link>
      <Link href="/classic#software" className="hover:text-signal">Phần mềm</Link>
      <Link href="/classic#games" className="hover:text-signal">Game</Link>
      <Link href="/gallery" className="hover:text-signal">Thư viện</Link>
      <Link href="/contact" className="hover:text-signal">Liên hệ</Link>
      {!home && <ThemeToggle />}
    </nav>
  );
  // Trang chủ có thanh riêng của template, nên menu nổi ở đáy màn hình
  if (home)
    return (
      <header className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/15 bg-white/85 px-5 py-2 font-display text-sm text-neutral-800 shadow-lg backdrop-blur">
        {nav}
      </header>
    );
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 font-display text-sm">
      <Link href="/" className="font-semibold">Portfolio</Link>
      <div className="text-mute">{nav}</div>
    </header>
  );
}
