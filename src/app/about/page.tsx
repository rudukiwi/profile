import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Giới thiệu" };
export const revalidate = 60;

export default async function About() {
  const sb = await supabaseServer();
  const { data } = await sb.from("profile").select("*").eq("id", 1).maybeSingle();
  const p = data as Profile | null;
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <p className="hand text-2xl">{p?.headline}</p>
      <h1 className="mt-1 text-6xl"><span className="scribble">{p?.name ?? "Giới thiệu"}</span></h1>
      {p?.bio
        ? <div className="mt-10 whitespace-pre-line text-lg leading-relaxed text-paper/90">{p.bio}</div>
        : <p className="mt-10 text-mute">Chưa có phần giới thiệu. Thêm trong trang Thông tin và CV của admin.</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        {p?.cv_url && <a href={p.cv_url} className="btn">Tải CV</a>}
        <Link href="/contact" className="btn-ghost">Liên hệ</Link>
      </div>
    </main>
  );
}
