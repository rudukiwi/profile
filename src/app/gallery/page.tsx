import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import GalleryGrid from "@/components/GalleryGrid";
import type { Media } from "@/lib/types";
import { getLang, T } from "@/lib/i18n";

export async function generateMetadata() { return { title: T[await getLang()].gallery }; }
export const revalidate = 60;

export default async function Gallery({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const lang = await getLang();
  const t = T[lang];
  const { c } = await searchParams;
  const sb = await supabaseServer();
  const { data, error } = await sb.from("media").select("*").order("created_at", { ascending: false });
  const all = (data ?? []) as Media[];
  const cats = [...new Set(all.map((m) => m.category))];
  const items = c ? all.filter((m) => m.category === c) : all;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <h1 className="text-5xl"><span className="scribble">{t.gallery}</span></h1>
      {cats.length > 1 && (
        <nav className="mt-6 flex flex-wrap gap-2 font-display text-sm" aria-label="Lọc theo nhóm">
          <Link href="/gallery" className={`btn-ghost ${!c ? "!border-signal" : ""}`}>{t.all}</Link>
          {cats.map((k) => <Link key={k} href={`/gallery?c=${encodeURIComponent(k)}`} className={`btn-ghost ${c === k ? "!border-signal" : ""}`}>{k}</Link>)}
        </nav>
      )}
      <div className="mt-10">
        {error && <p role="alert" className="text-red-400">{t.galleryError}</p>}
        {!error && !items.length && <p className="text-mute">{t.galleryEmpty}</p>}
        {items.length > 0 && <GalleryGrid items={items} lang={lang} />}
      </div>
    </main>
  );
}
