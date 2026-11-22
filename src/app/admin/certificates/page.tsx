import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { addCertificate, removeCertificate, updateCertificate } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import { fmtMonth } from "@/lib/format";
import type { Certificate } from "@/lib/types";

export default async function CertificatesAdmin({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const sb = await supabaseServer();
  const { data, error } = await sb.from("certificates").select("*").order("issued_on", { ascending: false, nullsFirst: false });
  const items = (data ?? []) as Certificate[];
  const cur = items.find((i) => i.id === edit);
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <section>
        <h1 className="text-3xl font-semibold">Chứng chỉ</h1>
        {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}. Bạn đã chạy 002_experience_certificates.sql chưa?</p>}
        {!items.length && !error && <p className="mt-6 text-mute">Chưa có chứng chỉ nào. Thêm chứng chỉ đầu tiên ở form bên cạnh.</p>}
        <ul className="mt-6">
          {items.map((c) => (
            <li key={c.id} className="flex items-center gap-3 border-t border-line py-4">
              <div className="mr-auto">
                <p className="font-display font-semibold">{c.title}</p>
                <p className="font-display text-sm text-mute">{c.issuer}{c.issued_on && `, ${fmtMonth(c.issued_on)}`}</p>
              </div>
              <Link href={`/admin/certificates?edit=${c.id}`} className="btn-ghost">Sửa</Link>
              <form action={removeCertificate.bind(null, c.id)}>
                <ConfirmButton message={`Xóa chứng chỉ "${c.title}"?`} className="btn-ghost hover:!border-red-400">Xóa</ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <form key={cur?.id ?? "new"} action={cur ? updateCertificate.bind(null, cur.id) : addCertificate} className="space-y-3 self-start">
        <h2 className="text-xl font-semibold">{cur ? "Sửa chứng chỉ" : "Thêm chứng chỉ"}</h2>
        <input name="title" required defaultValue={cur?.title} placeholder="Tên chứng chỉ" className="field" />
        <input name="issuer" required defaultValue={cur?.issuer} placeholder="Đơn vị cấp" className="field" />
        <label className="block font-display text-sm text-mute">Ngày cấp<input name="issued_on" type="date" defaultValue={cur?.issued_on ?? ""} className="field mt-1" /></label>
        <input name="credential_url" type="url" defaultValue={cur?.credential_url ?? ""} placeholder="Link xác minh (nếu có)" className="field" />
        <label className="block font-display text-sm text-mute">Ảnh chứng chỉ (JPG, PNG, WebP, tối đa 5MB)
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full" />
        </label>
        <button className="btn">{cur ? "Lưu thay đổi" : "Thêm"}</button>
        {cur && <Link href="/admin/certificates" className="btn-ghost ml-2">Hủy</Link>}
      </form>
    </div>
  );
}
