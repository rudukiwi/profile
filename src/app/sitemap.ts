import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from("entries").select("slug, created_at").eq("status", "published");
  const pages = ["", "/about", "/gallery", "/contact"].map((p) => ({ url: `${base}${p}` }));
  const works = (data ?? []).map((e) => ({ url: `${base}/work/${e.slug}`, lastModified: new Date(e.created_at) }));
  return [...pages, ...works];
}
