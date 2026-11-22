import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import type { Entry } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const sb = await supabaseServer();
  // RLS: người lạ chỉ thấy published; admin đã đăng nhập xem được draft (preview an toàn)
  const { data } = await sb.from("entries").select("*").eq("slug", slug).maybeSingle();
  return data as Entry | null;
}

export async function generateMetadata({ params }: Props) {
  const e = await load((await params).slug);
  return {
    title: e?.title ?? "Không tìm thấy",
    description: e?.summary,
    openGraph: { title: e?.title, description: e?.summary, images: e?.cover_url ? [e.cover_url] : undefined },
  };
}

export default async function WorkPage({ params }: Props) {
  const e = await load((await params).slug);
  if (!e) notFound();
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <Link href="/" className="font-display text-sm text-mute hover:text-paper">Quay lại</Link>
      {e.status === "draft" && <p className="mt-6 rounded-md border border-signal px-3 py-2 font-display text-sm text-signal">Bản nháp: chỉ bạn nhìn thấy trang này.</p>}
      <h1 className="mt-6 text-5xl"><span className="scribble">{e.title}</span></h1>
      <p className="mt-4 text-xl text-paper/80">{e.summary}</p>
      {e.cover_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={e.cover_url} alt={e.title} className="mt-10 w-full rounded-2xl border border-line" />}
      <div className="mt-10 whitespace-pre-line">{e.body}</div>
      <p className="mt-10 font-display text-mute">{e.tech.join(", ")}</p>
      <div className="mt-6 flex gap-3">
        {e.link_url && <a className="btn" href={e.link_url}>{e.kind === "game" ? "Chơi thử" : "Mở demo"}</a>}
        {e.repo_url && <a className="btn-ghost" href={e.repo_url}>Mã nguồn</a>}
      </div>
    </main>
  );
}
