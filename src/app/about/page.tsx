import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { getLang, pick, T } from "@/lib/i18n";

export async function generateMetadata() { return { title: T[await getLang()].about }; }
export const revalidate = 60;

export default async function About() {
  const lang = await getLang();
  const t = T[lang];
  const sb = await supabaseServer();
  const { data } = await sb.from("profile").select("*").eq("id", 1).maybeSingle();
  const p = data as Profile | null;
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <p className="hand text-2xl">{pick(lang, p?.headline, p?.headline_en)}</p>
      <h1 className="mt-1 text-6xl"><span className="scribble">{p?.name ?? t.about}</span></h1>
      {p?.bio
        ? <div className="mt-10 whitespace-pre-line text-lg leading-relaxed text-paper/90">{pick(lang, p.bio, p.bio_en)}</div>
        : <p className="mt-10 text-mute">{t.noIntro}</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        {p?.cv_url && <a href={p.cv_url} className="btn">{t.downloadCv}</a>}
        <Link href="/contact" className="btn-ghost">{t.contact}</Link>
      </div>
    </main>
  );
}
