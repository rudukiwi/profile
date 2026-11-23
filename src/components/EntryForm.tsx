import type { Entry, Media } from "@/lib/types";

type Props = { action: (fd: FormData) => void | Promise<void>; kind: "project" | "game"; entry?: Entry; submitLabel: string; images?: Pick<Media, "id" | "url" | "title">[] };

export default function EntryForm({ action, kind, entry, submitLabel, images = [] }: Props) {
  return (
    <form action={action} className="space-y-3 self-start">
      <input name="title" required defaultValue={entry?.title} placeholder="Tên" className="field" />
      <input name="summary" defaultValue={entry?.summary} placeholder="Mô tả ngắn" className="field" />
      <textarea name="body" rows={6} defaultValue={entry?.body} placeholder="Nội dung chi tiết" className="field" />
      <details className="rounded-md border border-line p-3" open={Boolean(entry?.title_en || entry?.summary_en || entry?.body_en)}>
        <summary className="cursor-pointer font-display text-sm text-mute">Bản tiếng Anh (không bắt buộc)</summary>
        <div className="mt-3 space-y-3">
          <input name="title_en" defaultValue={entry?.title_en ?? ""} placeholder="Title (English)" className="field" />
          <input name="summary_en" defaultValue={entry?.summary_en ?? ""} placeholder="Short description (English)" className="field" />
          <textarea name="body_en" rows={5} defaultValue={entry?.body_en ?? ""} placeholder="Details (English)" className="field" />
        </div>
      </details>
      <input name="tech" defaultValue={entry?.tech.join(", ")} placeholder="Công nghệ, cách nhau bằng dấu phẩy" className="field" />
      <input name="link_url" type="url" defaultValue={entry?.link_url ?? ""} placeholder={kind === "game" ? "Link chơi / tải game" : "Link demo"} className="field" />
      <input name="repo_url" type="url" defaultValue={entry?.repo_url ?? ""} placeholder="Link GitHub" className="field" />
      <label className="block font-display text-sm text-mute">
        Ảnh bìa (JPG, PNG, WebP, tối đa 5MB){entry?.cover_url && ". Chọn ảnh mới để thay thế"}
        <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full" />
      </label>
      {images.length > 0 && (
        <details className="rounded-md border border-line p-3">
          <summary className="cursor-pointer font-display text-sm text-mute">Hoặc chọn ảnh từ thư viện</summary>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((m) => (
              <label key={m.id} className="cursor-pointer">
                <input type="radio" name="cover_pick" value={m.url} className="peer sr-only" />
                <img src={m.url} alt={m.title} loading="lazy" className="aspect-square w-full rounded object-cover opacity-60 peer-checked:opacity-100 peer-checked:ring-2 peer-checked:ring-signal peer-focus-visible:ring-2 peer-focus-visible:ring-signal" />
              </label>
            ))}
          </div>
          <p className="mt-2 font-display text-xs text-mute">Nếu bạn cũng tải ảnh lên ở trên, ảnh tải lên sẽ được dùng.</p>
        </details>
      )}
      <select name="status" className="field" defaultValue={entry?.status ?? "draft"}>
        <option value="draft">Bản nháp</option>
        <option value="published">Xuất bản</option>
      </select>
      <button className="btn">{submitLabel}</button>
    </form>
  );
}
