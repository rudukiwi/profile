import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { removeEntry, saveEntry, setStatus } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import EntryForm from "@/components/EntryForm";
import type { Entry } from "@/lib/types";

const KINDS = { projects: { kind: "project", label: "Dự án" }, games: { kind: "game", label: "Game" } } as const;

type Props = { params: Promise<{ kind: string }>; searchParams: Promise<{ q?: string; status?: string; saved?: string }> };

export default async function Manage({ params, searchParams }: Props) {
  const cfg = KINDS[(await params).kind as keyof typeof KINDS];
  if (!cfg) notFound();
  const { q = "", status = "", saved = "" } = await searchParams;

  const sb = await supabaseServer();
  let query = sb.from("entries").select("*").eq("kind", cfg.kind).order("created_at", { ascending: false });
  if (q) query = query.ilike("title", `%${q.replace(/[%_]/g, "")}%`);
  if (status === "draft" || status === "published") query = query.eq("status", status);
  const { data, error } = await query;
  const { data: imgs } = await sb.from("media").select("id, url, title").eq("kind", "image").order("created_at", { ascending: false }).limit(60);
  const images = imgs ?? [];
  const items = (data ?? []) as Entry[];
  const filtering = Boolean(q || status);
  const base = cfg.kind === "game" ? "/admin/games" : "/admin/projects";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <section>
        <h1 className="text-3xl font-semibold">{cfg.label}</h1>
        {saved && <p role="status" className="mt-4 rounded-md border border-signal px-3 py-2 font-display text-sm text-signal">{saved.startsWith("published") ? "Đã lưu và xuất bản. Mục này đã hiện trên trang chủ (có thể chậm tới 1 phút)." : "Đã lưu dưới dạng bản nháp. Bấm \"Xuất bản\" bên dưới để hiện trên trang chủ."}</p>}
        <form className="mt-6 flex gap-2" role="search">
          <input name="q" defaultValue={q} placeholder="Tìm theo tên" className="field" />
          <select name="status" defaultValue={status} className="field !w-40">
            <option value="">Tất cả</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
          <button className="btn-ghost">Lọc</button>
        </form>
        {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}</p>}
        {!items.length && !error && (
          <p className="mt-6 text-mute">{filtering ? "Không có mục nào khớp bộ lọc." : "Chưa có mục nào. Thêm mục đầu tiên ở form bên cạnh."}</p>
        )}
        <ul className="mt-6">
          {items.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 border-t border-line py-4">
              <div className="mr-auto">
                <Link href={`/work/${e.slug}`} className="font-display font-semibold hover:text-signal">{e.title}</Link>
                <p className="font-display text-sm text-mute">{e.status === "published" ? "Đã xuất bản" : "Bản nháp"}</p>
              </div>
              <Link href={`${base}/${e.id}`} className="btn-ghost">Sửa</Link>
              <form action={setStatus.bind(null, e.id, e.status === "published" ? "draft" : "published")}>
                <button className="btn-ghost">{e.status === "published" ? "Gỡ xuống" : "Xuất bản"}</button>
              </form>
              <form action={removeEntry.bind(null, e.id)}>
                <ConfirmButton message={`Xóa "${e.title}"? Không thể hoàn tác.`} className="btn-ghost hover:!border-red-400">Xóa</ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <div>
        <h2 className="mb-3 text-xl font-semibold">Thêm {cfg.label.toLowerCase()}</h2>
        <EntryForm key={saved} action={saveEntry.bind(null, cfg.kind)} kind={cfg.kind} submitLabel="Lưu" images={images} />
      </div>
    </div>
  );
}
