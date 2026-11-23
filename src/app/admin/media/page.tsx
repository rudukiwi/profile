import { supabaseServer } from "@/lib/supabase/server";
import ImageInput from "@/components/ImageInput";
import Link from "next/link";
import { addVideo, removeMedia, updateMedia, uploadMedia } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import type { Media } from "@/lib/types";

export default async function MediaAdmin({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const sb = await supabaseServer();
  const { data, error } = await sb.from("media").select("*").order("created_at", { ascending: false });
  const items = (data ?? []) as Media[];
  const cur = items.find((i) => i.id === edit);
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <section>
        <h1 className="text-3xl font-semibold">Thư viện media</h1>
        {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}. Bạn đã chạy 003_media.sql chưa?</p>}
        {!items.length && !error && <p className="mt-6 text-mute">Thư viện trống. Tải ảnh lên hoặc thêm link video ở form bên cạnh.</p>}
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((m) => (
            <li key={m.id} className="border border-line">
              {m.kind === "image"
                ? <img src={m.url} alt={m.title} loading="lazy" className="aspect-square w-full object-cover" />
                : <a href={m.url} className="flex aspect-square items-center justify-center bg-raise font-display text-mute hover:text-paper">Video</a>}
              <div className="p-2 font-display text-sm">
                <p className="truncate font-semibold">{m.title}</p>
                <p className="text-mute">{m.category}</p>
                <Link href={`/admin/media?edit=${m.id}`} className="mr-3 text-mute hover:text-paper">Sửa</Link>
                <form action={removeMedia.bind(null, m.id)} className="mt-1 inline">
                  <ConfirmButton message={`Xóa "${m.title}" khỏi thư viện?`} className="text-mute hover:text-red-400">Xóa</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div className="space-y-10 self-start">
        {cur && (
          <form key={cur.id} action={updateMedia.bind(null, cur.id)} className="space-y-3">
            <h2 className="text-xl font-semibold">Sửa media</h2>
            <input name="title" defaultValue={cur.title} placeholder="Tiêu đề" className="field" />
            <input name="category" defaultValue={cur.category} placeholder="Nhóm" className="field" />
            <button className="btn">Lưu thay đổi</button>
            <Link href="/admin/media" className="btn-ghost ml-2">Hủy</Link>
          </form>
        )}
        <form action={uploadMedia} className="space-y-3">
          <h2 className="text-xl font-semibold">Tải ảnh lên</h2>
          <ImageInput name="files" multiple required className="block w-full font-display text-sm" />
          <input name="category" placeholder="Nhóm (mặc định: Chung)" className="field" />
          <p className="font-display text-sm text-mute">Tối đa 20 ảnh mỗi lần, mỗi ảnh tối đa 5MB.</p>
          <button className="btn">Tải lên</button>
        </form>
        <form action={addVideo} className="space-y-3">
          <h2 className="text-xl font-semibold">Thêm link video</h2>
          <input name="url" type="url" required placeholder="Link YouTube hoặc video khác" className="field" />
          <input name="title" placeholder="Tiêu đề" className="field" />
          <input name="category" placeholder="Nhóm (mặc định: Chung)" className="field" />
          <button className="btn">Thêm video</button>
        </form>
      </div>
    </div>
  );
}
