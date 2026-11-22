import { supabaseServer } from "@/lib/supabase/server";
import { addSkill, removeSkill } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import type { Skill } from "@/lib/types";

export default async function Skills() {
  const sb = await supabaseServer();
  const { data, error } = await sb.from("skills").select("*").order("category").order("name");
  const skills = (data ?? []) as Skill[];
  const groups = skills.reduce<Record<string, Skill[]>>((a, s) => ((a[s.category] ??= []).push(s), a), {});
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
      <section>
        <h1 className="text-3xl font-semibold">Kỹ năng</h1>
        {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}</p>}
        {!skills.length && !error && <p className="mt-6 text-mute">Chưa có kỹ năng nào. Thêm kỹ năng đầu tiên ở form bên cạnh.</p>}
        {Object.entries(groups).map(([cat, list]) => (
          <div key={cat} className="mt-6 border-t border-line pt-4">
            <h2 className="font-display text-mute">{cat}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {list.map((s) => (
                <li key={s.id}>
                  <form action={removeSkill.bind(null, s.id)}>
                    <ConfirmButton message={`Xóa kỹ năng "${s.name}"?`} className="btn-ghost">{s.name} ×</ConfirmButton>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <form action={addSkill} className="space-y-3 self-start">
        <h2 className="text-xl font-semibold">Thêm kỹ năng</h2>
        <input name="category" required placeholder="Nhóm (vd: Ngôn ngữ, Framework)" className="field" />
        <input name="name" required placeholder="Tên kỹ năng" className="field" />
        <button className="btn">Thêm</button>
      </form>
    </div>
  );
}
