import { supabaseServer } from "@/lib/supabase/server";
import { submitMessage } from "./actions";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Liên hệ" };

export default async function Contact({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const { sent, error } = await searchParams;
  const sb = await supabaseServer();
  const { data } = await sb.from("profile").select("email, github_url, linkedin_url").eq("id", 1).maybeSingle();
  const social = ((await sb.from("social_links").select("*").order("created_at")).data ?? []) as { id: string; label: string; url: string }[];
  const p = data as Pick<Profile, "email" | "github_url" | "linkedin_url"> | null;
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <h1 className="text-5xl"><span className="scribble">Liên hệ</span></h1>
      <p className="mt-4 text-xl text-paper/80">Cho mình biết bạn cần gì. Mình sẽ trả lời qua email.</p>
      {sent && <p role="status" className="mt-8 rounded-md border border-signal px-4 py-3 font-display text-signal">Đã gửi tin nhắn. Cảm ơn bạn.</p>}
      {error === "invalid" && <p role="alert" className="mt-8 font-display text-red-400">Vui lòng nhập tên, email hợp lệ và tin nhắn từ 10 ký tự.</p>}
      {error === "server" && <p role="alert" className="mt-8 font-display text-red-400">Chưa gửi được tin nhắn. Vui lòng thử lại sau hoặc gửi email trực tiếp.</p>}
      <form action={submitMessage} className="mt-8 max-w-xl space-y-3">
        <input name="name" required maxLength={100} placeholder="Họ tên" className="field" autoComplete="name" />
        <input name="email" type="email" required placeholder="Email" className="field" autoComplete="email" />
        <textarea name="message" required minLength={10} maxLength={3000} rows={6} placeholder="Tin nhắn" className="field" />
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
        <button className="btn">Gửi tin nhắn</button>
      </form>
      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-display">
        {p?.email && <a className="text-signal" href={`mailto:${p.email}`}>{p.email}</a>}
        {p?.github_url && <a href={p.github_url}>GitHub</a>}
        {p?.linkedin_url && <a href={p.linkedin_url}>LinkedIn</a>}
        {social.map((l) => <a key={l.id} href={l.url}>{l.label}</a>)}
      </div>
    </main>
  );
}
