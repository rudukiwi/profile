import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { updateEntry } from "../../actions";
import EntryForm from "@/components/EntryForm";
import type { Entry } from "@/lib/types";

const BACK = { projects: "project", games: "game" } as const;

export default async function Edit({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind: key, id } = await params;
  const kind = BACK[key as keyof typeof BACK];
  if (!kind) notFound();
  const sb = await supabaseServer();
  const { data } = await sb.from("entries").select("*").eq("id", id).eq("kind", kind).maybeSingle();
  if (!data) notFound();
  const entry = data as Entry;
  const { data: imgs } = await sb.from("media").select("id, url, title").eq("kind", "image").order("created_at", { ascending: false }).limit(60);
  const images = imgs ?? [];
  return (
    <div className="max-w-xl">
      <Link href={`/admin/${key}`} className="font-display text-sm text-mute hover:text-paper">Quay lại danh sách</Link>
      <h1 className="mb-6 mt-4 text-3xl font-semibold">Sửa: {entry.title}</h1>
      <EntryForm action={updateEntry.bind(null, id, kind)} kind={kind} entry={entry} submitLabel="Lưu thay đổi" images={images} />
    </div>
  );
}
