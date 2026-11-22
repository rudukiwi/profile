"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

type SB = Awaited<ReturnType<typeof supabaseServer>>;
const IMG = ["image/jpeg", "image/png", "image/webp"];
const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const refresh = () => { revalidatePath("/"); revalidatePath("/admin", "layout"); };
const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function upload(sb: SB, folder: string, file: File | null, types: string[], maxMb: number) {
  if (!file || file.size === 0) return null;
  if (!types.includes(file.type) || file.size > maxMb * 1024 * 1024)
    throw new Error(`Tệp không hợp lệ. Cho phép ${types.map((t) => t.split("/")[1]).join(", ")}, tối đa ${maxMb}MB.`);
  const path = `${folder}/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
  const up = await sb.storage.from("media").upload(path, file);
  if (up.error) throw new Error(up.error.message);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

async function pickCover(sb: SB, kind: string, fd: FormData) {
  const uploaded = await upload(sb, kind, fd.get("cover") as File | null, IMG, 5);
  if (uploaded) return uploaded;
  const pick = text(fd, "cover_pick");
  if (!pick) return null;
  const { data } = await sb.from("media").select("id").eq("url", pick).eq("kind", "image").maybeSingle();
  return data ? pick : null; // chỉ nhận ảnh có trong thư viện
}

const entryFields = (fd: FormData) => ({
  title: text(fd, "title"),
  summary: text(fd, "summary"),
  body: text(fd, "body"),
  tech: text(fd, "tech").split(",").map((t) => t.trim()).filter(Boolean),
  link_url: text(fd, "link_url") || null,
  repo_url: text(fd, "repo_url") || null,
  status: fd.get("status") === "published" ? "published" : "draft",
});

export async function signIn(fd: FormData) {
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email: text(fd, "email"), password: String(fd.get("password") ?? "") });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/admin/login");
}

export async function saveEntry(kind: "project" | "game", fd: FormData) {
  const sb = await supabaseServer();
  const f = entryFields(fd);
  if (!f.title) return;
  const cover_url = await pickCover(sb, kind, fd);
  const { error } = await sb.from("entries").insert({ kind, ...f, slug: `${slugify(f.title)}-${Math.random().toString(36).slice(2, 6)}`, cover_url });
  if (error) throw new Error(error.message);
  refresh();
}

export async function updateEntry(id: string, kind: "project" | "game", fd: FormData) {
  const sb = await supabaseServer();
  const f = entryFields(fd);
  if (!f.title) return;
  const cover_url = await pickCover(sb, kind, fd);
  const { error } = await sb.from("entries").update({ ...f, ...(cover_url ? { cover_url } : {}) }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
  redirect(kind === "game" ? "/admin/games" : "/admin/projects");
}

export async function setStatus(id: string, status: "draft" | "published") {
  const sb = await supabaseServer();
  const { error } = await sb.from("entries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function removeEntry(id: string) {
  const sb = await supabaseServer();
  const { error } = await sb.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function saveProfile(fd: FormData) {
  const sb = await supabaseServer();
  const avatar = await upload(sb, "avatar", fd.get("avatar") as File | null, IMG, 5);
  const { error } = await sb.from("profile").update({
    ...(avatar ? { avatar_url: avatar } : {}),
    name: text(fd, "name"), headline: text(fd, "headline"), bio: text(fd, "bio"),
    email: text(fd, "email") || null, github_url: text(fd, "github_url") || null, linkedin_url: text(fd, "linkedin_url") || null,
  }).eq("id", 1);
  if (error) throw new Error(error.message);
  refresh();
}

export async function uploadCv(fd: FormData) {
  const sb = await supabaseServer();
  const url = await upload(sb, "cv", fd.get("cv") as File | null, ["application/pdf"], 10);
  if (!url) return;
  const label = text(fd, "label") || `CV ${new Date().toLocaleDateString("vi-VN")}`;
  const ins = await sb.from("cv_versions").insert({ label, url, storage_path: url.split("/object/public/media/")[1] ?? null });
  if (ins.error) throw new Error(ins.error.message);
  const { error } = await sb.from("profile").update({ cv_url: url }).eq("id", 1);
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/about");
}

export async function setActiveCv(id: string) {
  const sb = await supabaseServer();
  const { data } = await sb.from("cv_versions").select("url").eq("id", id).maybeSingle();
  if (!data) throw new Error("Không tìm thấy bản CV này.");
  const { error } = await sb.from("profile").update({ cv_url: data.url }).eq("id", 1);
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/about");
}

export async function removeCv(id: string) {
  const sb = await supabaseServer();
  const [{ data: cv }, { data: p }] = await Promise.all([
    sb.from("cv_versions").select("url, storage_path").eq("id", id).maybeSingle(),
    sb.from("profile").select("cv_url").eq("id", 1).maybeSingle(),
  ]);
  if (!cv) return;
  if (cv.url === p?.cv_url) throw new Error("Không thể xóa CV đang dùng. Hãy chọn bản khác trước.");
  if (cv.storage_path) await sb.storage.from("media").remove([cv.storage_path]);
  const { error } = await sb.from("cv_versions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/profile");
}

export async function addSkill(fd: FormData) {
  const sb = await supabaseServer();
  const category = text(fd, "category"), name = text(fd, "name");
  if (!category || !name) return;
  const { error } = await sb.from("skills").insert({ category, name });
  if (error) throw new Error(error.message);
  refresh();
}

export async function removeSkill(id: string) {
  const sb = await supabaseServer();
  const { error } = await sb.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addExperience(fd: FormData) {
  const sb = await supabaseServer();
  const company = text(fd, "company"), position = text(fd, "position"), start = text(fd, "start_date");
  if (!company || !position || !start) return;
  const { error } = await sb.from("experience").insert({
    company, position, start_date: start, end_date: text(fd, "end_date") || null, description: text(fd, "description"),
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function removeExperience(id: string) {
  const sb = await supabaseServer();
  const { error } = await sb.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function addCertificate(fd: FormData) {
  const sb = await supabaseServer();
  const title = text(fd, "title"), issuer = text(fd, "issuer");
  if (!title || !issuer) return;
  const image_url = await upload(sb, "certificates", fd.get("image") as File | null, IMG, 5);
  const { error } = await sb.from("certificates").insert({
    title, issuer, issued_on: text(fd, "issued_on") || null, credential_url: text(fd, "credential_url") || null, image_url,
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function removeCertificate(id: string) {
  const sb = await supabaseServer();
  const { error } = await sb.from("certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function uploadMedia(fd: FormData) {
  const sb = await supabaseServer();
  const files = (fd.getAll("files") as File[]).filter((f) => f.size > 0);
  if (!files.length) return;
  if (files.length > 20) throw new Error("Chỉ tải tối đa 20 ảnh mỗi lần.");
  for (const f of files)
    if (!IMG.includes(f.type) || f.size > 5 * 1024 * 1024) throw new Error(`"${f.name}" không hợp lệ. Chỉ nhận JPG, PNG, WebP, tối đa 5MB.`);
  const category = text(fd, "category") || "Chung";
  const rows = [];
  for (const f of files) {
    const path = `gallery/${crypto.randomUUID()}.${f.type.split("/")[1]}`;
    const up = await sb.storage.from("media").upload(path, f);
    if (up.error) throw new Error(up.error.message);
    rows.push({ kind: "image", url: sb.storage.from("media").getPublicUrl(path).data.publicUrl, storage_path: path, title: f.name.replace(/\.[^.]+$/, ""), category });
  }
  const { error } = await sb.from("media").insert(rows);
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/gallery");
}

export async function addVideo(fd: FormData) {
  const sb = await supabaseServer();
  const url = text(fd, "url");
  if (!/^https?:\/\//.test(url)) throw new Error("Link video phải bắt đầu bằng http:// hoặc https://");
  const { error } = await sb.from("media").insert({ kind: "video", url, title: text(fd, "title") || "Video", category: text(fd, "category") || "Chung" });
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/gallery");
}

export async function removeMedia(id: string) {
  const sb = await supabaseServer();
  const { data } = await sb.from("media").select("storage_path").eq("id", id).maybeSingle();
  if (data?.storage_path) await sb.storage.from("media").remove([data.storage_path]);
  const { error } = await sb.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/gallery");
}

export async function setRead(id: string, is_read: boolean) {
  const sb = await supabaseServer();
  const { error } = await sb.from("messages").update({ is_read }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function removeMessage(id: string) {
  const sb = await supabaseServer();
  const { error } = await sb.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function updateExperience(id: string, fd: FormData) {
  const sb = await supabaseServer();
  const company = text(fd, "company"), position = text(fd, "position"), start = text(fd, "start_date");
  if (!company || !position || !start) return;
  const { error } = await sb.from("experience").update({ company, position, start_date: start, end_date: text(fd, "end_date") || null, description: text(fd, "description") }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh(); redirect("/admin/experience");
}

export async function updateCertificate(id: string, fd: FormData) {
  const sb = await supabaseServer();
  const title = text(fd, "title"), issuer = text(fd, "issuer");
  if (!title || !issuer) return;
  const image_url = await upload(sb, "certificates", fd.get("image") as File | null, IMG, 5);
  const { error } = await sb.from("certificates").update({ title, issuer, issued_on: text(fd, "issued_on") || null, credential_url: text(fd, "credential_url") || null, ...(image_url ? { image_url } : {}) }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh(); redirect("/admin/certificates");
}

export async function updateMedia(id: string, fd: FormData) {
  const sb = await supabaseServer();
  const { error } = await sb.from("media").update({ title: text(fd, "title") || "Không tên", category: text(fd, "category") || "Chung" }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/gallery"); redirect("/admin/media");
}

export async function addSocial(fd: FormData) {
  const sb = await supabaseServer();
  const label = text(fd, "label"), url = text(fd, "url");
  if (!label || !/^https?:\/\//.test(url)) throw new Error("Cần tên và link bắt đầu bằng http:// hoặc https://");
  const { error } = await sb.from("social_links").insert({ label, url });
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/contact");
}

export async function removeSocial(id: string) {
  const sb = await supabaseServer();
  const { error } = await sb.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh(); revalidatePath("/contact");
}
