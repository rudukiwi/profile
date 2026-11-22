import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { addExperience, removeExperience, updateExperience } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import { fmtMonth } from "@/lib/format";
import type { Experience } from "@/lib/types";

export default async function ExperienceAdmin({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const sb = await supabaseServer();
  const { data, error } = await sb.from("experience").select("*").order("start_date", { ascending: false });
  const items = (data ?? []) as Experience[];
  const cur = items.find((i) => i.id === edit);
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <section>
        <h1 className="text-3xl font-semibold">Kinh nghiệm</h1>
        {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}. Bạn đã chạy 002_experience_certificates.sql chưa?</p>}
        {!items.length && !error && <p className="mt-6 text-mute">Chưa có kinh nghiệm nào. Thêm mục đầu tiên ở form bên cạnh.</p>}
        <ul className="mt-6">
          {items.map((x) => (
            <li key={x.id} className="flex items-center gap-3 border-t border-line py-4">
              <div className="mr-auto">
                <p className="font-display font-semibold">{x.position}, {x.company}</p>
                <p className="font-display text-sm text-mute">{fmtMonth(x.start_date)} đến {fmtMonth(x.end_date)}</p>
              </div>
              <Link href={`/admin/experience?edit=${x.id}`} className="btn-ghost">Sửa</Link>
              <form action={removeExperience.bind(null, x.id)}>
                <ConfirmButton message={`Xóa "${x.position}, ${x.company}"?`} className="btn-ghost hover:!border-red-400">Xóa</ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <form key={cur?.id ?? "new"} action={cur ? updateExperience.bind(null, cur.id) : addExperience} className="space-y-3 self-start">
        <h2 className="text-xl font-semibold">{cur ? "Sửa kinh nghiệm" : "Thêm kinh nghiệm"}</h2>
        <input name="company" required defaultValue={cur?.company} placeholder="Công ty" className="field" />
        <input name="position" required defaultValue={cur?.position} placeholder="Vị trí" className="field" />
        <label className="block font-display text-sm text-mute">Bắt đầu<input name="start_date" type="date" required defaultValue={cur?.start_date} className="field mt-1" /></label>
        <label className="block font-display text-sm text-mute">Kết thúc (bỏ trống nếu đang làm)<input name="end_date" type="date" defaultValue={cur?.end_date ?? ""} className="field mt-1" /></label>
        <textarea name="description" defaultValue={cur?.description} rows={5} placeholder="Mô tả công việc và thành tựu" className="field" />
        <button className="btn">{cur ? "Lưu thay đổi" : "Thêm"}</button>
        {cur && <Link href="/admin/experience" className="btn-ghost ml-2">Hủy</Link>}
      </form>
    </div>
  );
}
