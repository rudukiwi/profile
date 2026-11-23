"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { setLang } from "@/lib/lang-action";
import { T, type Lang } from "@/lib/i18n-strings";

function LangSwitch({ lang }: { lang: Lang }) {
  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label="Language">
      {(["en", "vi"] as const).map((l, i) => (
        <form key={l} action={setLang.bind(null, l)} className="inline-flex items-center gap-1">
          {i > 0 && <span aria-hidden="true">/</span>}
          <button className={lang === l ? "font-semibold text-signal" : "hover:text-signal"} aria-pressed={lang === l}>{l.toUpperCase()}</button>
        </form>
      ))}
    </span>
  );
}

export default function SiteHeader({ lang }: { lang: Lang }) {
  const t = T[lang];
  const home = usePathname() === "/";
  const nav = (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <Link href="/" className="hover:text-signal">{t.home}</Link>
      <Link href="/about" className="hover:text-signal">{t.about}</Link>
      <Link href="/classic#software" className="hover:text-signal">{t.software}</Link>
      <Link href="/classic#games" className="hover:text-signal">{t.games}</Link>
      <Link href="/gallery" className="hover:text-signal">{t.gallery}</Link>
      <Link href="/contact" className="hover:text-signal">{t.contact}</Link>
      <LangSwitch lang={lang} />
      {!home && <ThemeToggle label={{ dark: t.dark, light: t.light }} />}
    </nav>
  );
  if (home)
    return (
      <header className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/15 bg-white/85 px-5 py-2 font-display text-sm text-neutral-800 shadow-lg backdrop-blur">
        {nav}
      </header>
    );
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 font-display text-sm">
      <Link href="/" className="font-semibold">{t.siteTitle}</Link>
      <div className="text-mute">{nav}</div>
    </header>
  );
}
