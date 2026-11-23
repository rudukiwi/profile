import { supabaseServer } from "@/lib/supabase/server";
import ImageInput from "@/components/ImageInput";
import { removeCv, saveProfile, setActiveCv, uploadCv } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import type { Profile } from "@/lib/types";

type Cv = { id: string; label: string; url: string; created_at: string };

export default async function ProfilePage() {
  const sb = await supabaseServer();
  const [{ data }, { data: cvData }] = await Promise.all([
    sb.from("profile").select("*").eq("id", 1).maybeSingle(),
    sb.from("cv_versions").select("*").order("created_at", { ascending: false }),
  ]);
  const p = data as Profile | null;
  const cvs = (cvData ?? []) as Cv[];
  return (
    <div className="grid max-w-3xl gap-12 md:grid-cols-2">
      <form action={saveProfile} className="space-y-3">
        <h1 className="text-3xl font-semibold">Thông tin cá nhân</h1>
        <input name="name" required defaultValue={p?.name} placeholder="Họ tên" className="field" />
        <input name="headline" defaultValue={p?.headline} placeholder="Chức danh" className="field" />
        <textarea name="bio" rows={5} defaultValue={p?.bio} placeholder="Giới thiệu ngắn" className="field" />
        <details className="rounded-md border border-line p-3" open={Boolean(p?.headline_en || p?.bio_en)}>
          <summary className="cursor-pointer font-display text-sm text-mute">Bản tiếng Anh (không bắt buộc)</summary>
          <div className="mt-3 space-y-3">
            <input name="headline_en" defaultValue={p?.headline_en ?? ""} placeholder="Headline (English)" className="field" />
            <textarea name="bio_en" rows={5} defaultValue={p?.bio_en ?? ""} placeholder="Short bio (English)" className="field" />
          </div>
        </details>
        <label className="block font-display text-sm text-mute">Ảnh chân dung (JPG/PNG/WebP, ảnh lớn sẽ tự thu nhỏ)
          <ImageInput name="avatar" className="mt-1 block w-full" />
        </label>
        {p?.avatar_url && <img src={p.avatar_url} alt="Ảnh hiện tại" className="h-24 w-24 rounded-md object-cover" />}
        <input name="email" type="email" defaultValue={p?.email ?? ""} placeholder="Email liên hệ" className="field" />
        <input name="github_url" type="url" defaultValue={p?.github_url ?? ""} placeholder="Link GitHub" className="field" />
        <input name="linkedin_url" type="url" defaultValue={p?.linkedin_url ?? ""} placeholder="Link LinkedIn" className="field" />
        <button className="btn">Lưu thông tin</button>
      </form>
      <div className="space-y-8 self-start">
        <form action={uploadCv} className="space-y-3">
          <h2 className="text-xl font-semibold">Tải CV mới</h2>
          <input name="label" placeholder="Tên phiên bản (vd: CV 2026 tiếng Việt)" className="field" />
          <input name="cv" type="file" accept="application/pdf" required className="block w-full font-display text-sm" />
          <p className="font-display text-sm text-mute">PDF, tối đa 4MB. CV mới tải lên sẽ được dùng ngay.</p>
          <button className="btn">Tải CV lên</button>
        </form>
        <section>
          <h2 className="text-xl font-semibold">Các phiên bản CV</h2>
          {!cvs.length && <p className="mt-3 text-mute">Chưa có phiên bản nào được lưu.</p>}
          <ul className="mt-3">
            {cvs.map((c) => {
              const active = c.url === p?.cv_url;
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-2 border-t border-line py-3">
                  <div className="mr-auto">
                    <a href={c.url} className="font-display font-semibold hover:text-signal">{c.label}</a>
                    <p className="font-display text-sm text-mute">{new Date(c.created_at).toLocaleDateString("vi-VN")}{active && ", đang dùng"}</p>
                  </div>
                  {!active && (
                    <>
                      <form action={setActiveCv.bind(null, c.id)}><button className="btn-ghost">Dùng bản này</button></form>
                      <form action={removeCv.bind(null, c.id)}><ConfirmButton message={`Xóa "${c.label}"?`} className="btn-ghost hover:!border-red-400">Xóa</ConfirmButton></form>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
