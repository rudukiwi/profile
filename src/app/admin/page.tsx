import { supabaseServer } from "@/lib/supabase/server";

export default async function Overview() {
  const sb = await supabaseServer();
  const count = async (table: string, col?: string, val?: string, col2?: string, val2?: string) => {
    let q = sb.from(table).select("id", { count: "exact", head: true });
    if (col && val) q = q.eq(col, val);
    if (col2 && val2) q = q.eq(col2, val2);
    return (await q).count ?? 0;
  };
  const [p, pp, g, gp, img, vid, cert] = await Promise.all([
    count("entries", "kind", "project"), count("entries", "kind", "project", "status", "published"),
    count("entries", "kind", "game"), count("entries", "kind", "game", "status", "published"),
    count("media", "kind", "image"), count("media", "kind", "video"), count("certificates"),
  ]);
  const stats = [
    ["Dự án", p, `${pp} đã xuất bản, ${p - pp} bản nháp`],
    ["Game", g, `${gp} đã xuất bản, ${g - gp} bản nháp`],
    ["Hình ảnh", img, "trong thư viện"],
    ["Video", vid, "trong thư viện"],
    ["Chứng chỉ", cert, "đang hiển thị"],
  ] as const;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Tổng quan</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, n, note]) => (
          <div key={label} className="border-t border-line pt-4">
            <p className="font-display text-mute">{label}</p>
            <p className="font-display text-5xl font-bold">{n}</p>
            <p className="text-mute">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
