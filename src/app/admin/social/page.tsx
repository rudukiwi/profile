import { supabaseServer } from "@/lib/supabase/server";
import { addSocial, removeSocial } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function SocialAdmin() {
  const sb = await supabaseServer();
  const { data, error } = await sb.from("social_links").select("*").order("created_at");
  const items = (data ?? []) as { id: string; label: string; url: string }[];
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <section>
        <h1 className="text-3xl font-semibold">Liên kết mạng xã hội</h1>
        {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}. Bạn đã chạy 005_social_ratelimit.sql chưa?</p>}
        {!items.length && !error && <p className="mt-6 text-mute">Chưa có liên kết nào. GitHub, LinkedIn và email nhập ở trang Thông tin và CV.</p>}
        <ul className="mt-6">
          {items.map((l) => (
            <li key={l.id} className="flex items-center gap-3 border-t border-line py-4">
              <div className="mr-auto"><p className="font-display font-semibold">{l.label}</p><p className="text-sm text-mute">{l.url}</p></div>
              <form action={removeSocial.bind(null, l.id)}><ConfirmButton message={`Xóa liên kết "${l.label}"?`} className="btn-ghost hover:!border-red-400">Xóa</ConfirmButton></form>
            </li>
          ))}
        </ul>
      </section>
      <form action={addSocial} className="space-y-3 self-start">
        <h2 className="text-xl font-semibold">Thêm liên kết</h2>
        <input name="label" required placeholder="Tên (vd: itch.io, YouTube)" className="field" />
        <input name="url" type="url" required placeholder="https://" className="field" />
        <button className="btn">Thêm</button>
      </form>
    </div>
  );
}
