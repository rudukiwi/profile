import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import type { Entry } from "@/lib/types";
import { getLang, pick, T } from "@/lib/i18n";

type Props = { params: Promise<{ name: string }> };

function decode(s: string) {
  try { return decodeURIComponent(s); } catch { return s; }
}

export async function generateMetadata({ params }: Props) {
  return { title: decode((await params).name) };
}

export default async function SkillPage({ params }: Props) {
  const lang = await getLang();
  const t = T[lang];
  const name = decode((await params).name);
  const sb = await supabaseServer();
  const { data } = await sb.from("entries").select("*").eq("status", "published").order("created_at", { ascending: false });
  const items = ((data ?? []) as Entry[]).filter((e) => e.tech.some((t) => t.toLowerCase() === name.toLowerCase()));
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <Link href="/" className="font-display text-sm text-mute hover:text-paper">{t.back}</Link>
      <h1 className="mb-8 mt-6 text-5xl"><span className="scribble">{name}</span></h1>
      {!items.length && <p className="text-mute">{t.nothingWith(name)}</p>}
      <ul>
        {items.map((e) => (
          <li key={e.id} className="border-t border-line">
            <Link href={`/work/${e.slug}`} className="group block py-5">
              <h2 className="text-3xl transition group-hover:text-signal">{pick(lang, e.title, e.title_en)}</h2>
              <p className="text-mute">{pick(lang, e.summary, e.summary_en)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
