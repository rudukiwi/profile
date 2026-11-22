import { supabaseServer } from "@/lib/supabase/server";
import type { Certificate, Entry, Experience, Profile, Skill } from "@/lib/types";
import { fmtMonth } from "@/lib/format";
import MarginaliaPortfolioTemplate, { type MgnProject, type MgnSection } from "@/components/ui/marginalia-portfolio-template";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PALETTE = ["#e44d26", "#264de4", "#1f6f6b", "#7d3cff", "#c9473b", "#0f766e", "#b45309", "#334155"];
const hue = (s: string) => PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
const mark = (s: string) => (s.length <= 3 ? s : s.replace(/[^A-Za-z0-9#+.]/g, "").slice(0, 2)) || s.slice(0, 2);
const placeholder = (t: string, c: string) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="1040"><rect width="100%" height="100%" fill="${c}"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="56" text-anchor="middle">${t.replace(/[<&]/g, "")}</text></svg>`);

export default async function Home() {
  const sb = await supabaseServer();
  const [p, e, s, x, c, l, m] = await Promise.all([
    sb.from("profile").select("*").eq("id", 1).maybeSingle(),
    sb.from("entries").select("*").eq("status", "published").order("created_at", { ascending: false }),
    sb.from("skills").select("*").order("category"),
    sb.from("experience").select("*").order("start_date", { ascending: false }),
    sb.from("certificates").select("*").order("issued_on", { ascending: false, nullsFirst: false }),
    sb.from("social_links").select("*").order("created_at"),
    sb.from("media").select("url").eq("kind", "image").order("created_at", { ascending: false }).limit(6),
  ]);
  const profile = p.data as Profile | null;
  const entries = (e.data ?? []) as Entry[];
  const skills = (s.data ?? []) as Skill[];
  const jobs = (x.data ?? []) as Experience[];
  const certs = (c.data ?? []) as Certificate[];
  const social = (l.data ?? []) as { label: string; url: string }[];
  const gallery = ((m.data ?? []) as { url: string }[]).map((i) => i.url);

  const projects: MgnProject[] = entries.slice(0, 6).map((en, i) => {
    const own = en.cover_url ? [en.cover_url] : [];
    const imgs = [...own, ...gallery.slice(i, i + 3)].slice(0, 3);
    const images = imgs.length ? imgs : [placeholder(en.title, hue(en.title))];
    return {
      name: en.title,
      tagline: en.summary.slice(0, 60),
      kind: [en.kind === "game" ? "Game" : "Phần mềm", ...en.tech.slice(0, 2)].join(" · "),
      year: String(new Date(en.created_at).getFullYear()),
      summary: en.summary || en.title,
      challenge: en.tech.length ? `Công nghệ: ${en.tech.slice(0, 5).join(", ")}` : undefined,
      images,
      screens: ["cover", "detail", "feed"],
      accent: hue(en.title),
      tag: en.kind === "game" ? "game" : "web / app",
      href: `/work/${en.slug}`,
    };
  });

  const education = [
    ...jobs.map((j) => ({ title: j.position, place: j.company, period: `${fmtMonth(j.start_date)} – ${fmtMonth(j.end_date)}`, circled: !j.end_date })),
    ...certs.map((k) => ({ title: k.title, place: k.issuer, period: k.issued_on ? fmtMonth(k.issued_on) : undefined })),
  ].slice(0, 8);

  const names = skills.map((k) => k.name);
  const cvRaw = profile?.cv_url ?? null;
  const cvUrl = cvRaw && new TextEncoder().encode(cvRaw).length <= 106 ? cvRaw : `${siteUrl}/about`.length <= 106 ? `${siteUrl}/about` : null;
  const email = profile?.email ?? undefined;
  const links = [
    ...(profile?.github_url ? [{ label: "GitHub", href: profile.github_url }] : []),
    ...(profile?.linkedin_url ? [{ label: "LinkedIn", href: profile.linkedin_url }] : []),
    ...social.map((k) => ({ label: k.label, href: k.url })),
    ...(cvRaw ? [{ label: "Tải CV", href: cvRaw }] : []),
    { label: "Gửi tin nhắn", href: "/contact" },
  ];
  const sections: MgnSection[] = ["cover", "hello", ...(education.length ? ["education" as const] : []), "skills", ...(projects.length ? ["projects" as const, "cases" as const] : []), "thanks"];
  const name = profile?.name ?? "Your Name";

  return (
    <MarginaliaPortfolioTemplate
      name={name}
      role={profile?.headline ?? "Software & game developer"}
      year={String(new Date().getFullYear())}
      title="Portfolio"
      docLabel="Hồ sơ năng lực"
      portrait={profile?.avatar_url ?? placeholder(name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase(), "#475569")}
      traits={names.slice(0, 6)}
      greeting="Xin chào."
      bio={profile?.bio || "Mình thiết kế và xây dựng phần mềm, web và game."}
      educationIntro="Kinh nghiệm làm việc và chứng chỉ."
      education={education}
      cvUrl={cvUrl}
      cvNote="hồ sơ của mình"
      languages={[]}
      tools={names.slice(0, 5).map((n) => ({ name: n, mark: mark(n), bg: hue(n), fg: "#ffffff" }))}
      toolNote="rê chuột vào từng công nghệ"
      skillsIntro="Thiết kế và xây dựng phần mềm, web và game, từ database đến giao diện."
      skills={names.slice(0, 12)}
      books={[]}
      projectsNote="Các sản phẩm mình đã làm"
      projects={projects}
      thanks="Cảm ơn bạn"
      email={email}
      links={links}
      letter={`Cảm ơn bạn đã xem hồ sơ của mình.\n\nNếu bạn có dự án phần mềm, web hay game cần người cùng làm, mình rất muốn nghe ý tưởng của bạn.`}
      sections={sections}
    />
  );
}
