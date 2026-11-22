import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import type { Certificate, Entry, Experience, Profile, Skill } from "@/lib/types";
import { fmtMonth } from "@/lib/format";
import HeroIntro from "@/components/HeroIntro";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

export const revalidate = 60;

function Rows({ items, empty }: { items: Entry[]; empty: string }) {
  if (!items.length) return <p className="border-t border-line py-8 text-mute">{empty}</p>;
  return (
    <ul>
      {items.map((e) => (
        <li key={e.id} className="border-t border-line">
          <Link href={`/work/${e.slug}`} className="group grid items-baseline gap-2 py-6 sm:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-3xl transition group-hover:text-signal">{e.title}</h3>
              <p className="max-w-xl text-mute">{e.summary}</p>
            </div>
            <p className="hand text-xl">{e.tech.slice(0, 4).join(" · ")} →</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function Home() {
  const sb = await supabaseServer();
  const [p, e, s, x, c] = await Promise.all([
    sb.from("profile").select("*").eq("id", 1).maybeSingle(),
    sb.from("entries").select("*").eq("status", "published").order("created_at", { ascending: false }),
    sb.from("skills").select("*").order("category"),
    sb.from("experience").select("*").order("start_date", { ascending: false }),
    sb.from("certificates").select("*").order("issued_on", { ascending: false, nullsFirst: false }),
  ]);
  const jobs = (x.data ?? []) as Experience[];
  const certs = (c.data ?? []) as Certificate[];
  const social = ((await sb.from("social_links").select("*").order("created_at")).data ?? []) as { id: string; label: string; url: string }[];
  const profile = p.data as Profile | null;
  const entries = (e.data ?? []) as Entry[];
  const skills = (s.data ?? []) as Skill[];
  const covers = entries.filter((x) => x.cover_url).slice(0, 8).map((x) => ({ src: x.cover_url as string, alt: x.title }));
  const byCat = skills.reduce<Record<string, string[]>>((a, k) => ((a[k.category] ??= []).push(k.name), a), {});

  return (
    <main className="mx-auto max-w-5xl px-6">
      <section className="pb-20 pt-24"><HeroIntro>
        <p className="hand text-2xl">{profile?.headline ?? "Full-stack developer & game developer"}</p>
        <h1 className="mt-2 text-[clamp(3.2rem,11vw,8.5rem)] leading-[0.95]">{profile?.name ?? "Your Name"}</h1>
        <p className="mt-8 max-w-xl text-lg text-paper/80">{profile?.bio || "Mình xây dựng web production và game. Xem các sản phẩm bên dưới."}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#software" className="btn">Xem phần mềm</a>
          <a href="#games" className="btn">Xem game</a>
          {profile?.cv_url && <a href={profile.cv_url} className="btn-ghost">Tải CV</a>}
          <Link href="/contact" className="btn-ghost">Liên hệ</Link>
        </div>
      </HeroIntro></section>

      {covers.length >= 3 && (
        <div className="-mx-6 pb-20">
          <TiltedGridHero images={covers} tileHeight={62} axis={50} speed={5} className="h-[300px] w-full sm:h-[400px]" />
        </div>
      )}

      <section id="software" className="pb-20">
        <h2 className="mb-8 text-5xl"><span className="scribble">Phần mềm</span></h2>
        <Rows items={entries.filter((x) => x.kind === "project")} empty="Chưa có dự án nào được xuất bản." />
      </section>
      <section id="games" className="pb-20">
        <h2 className="mb-8 text-5xl"><span className="scribble">Game</span></h2>
        <Rows items={entries.filter((x) => x.kind === "game")} empty="Chưa có game nào được xuất bản." />
      </section>

      {Object.keys(byCat).length > 0 && (
        <section className="pb-20">
          <h2 className="mb-8 text-5xl"><span className="scribble">Kỹ năng</span></h2>
          <dl className="border-t border-line">
            {Object.entries(byCat).map(([cat, names]) => (
              <div key={cat} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[12rem_1fr]">
                <dt className="font-display text-mute">{cat}</dt>
                <dd className="flex flex-wrap gap-x-4">{names.map((n) => <Link key={n} href={`/skills/${encodeURIComponent(n)}`} className="hover:text-signal">{n}</Link>)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {jobs.length > 0 && (
        <section className="pb-20">
          <h2 className="mb-8 text-5xl"><span className="scribble">Kinh nghiệm</span></h2>
          <ol className="border-t border-line">
            {jobs.map((j) => (
              <li key={j.id} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[12rem_1fr]">
                <p className="font-display text-mute">{fmtMonth(j.start_date)} đến {fmtMonth(j.end_date)}</p>
                <div>
                  <h3 className="text-2xl">{j.position}, {j.company}</h3>
                  {j.description && <p className="mt-1 whitespace-pre-line text-paper/80">{j.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {certs.length > 0 && (
        <section className="pb-20">
          <h2 className="mb-8 text-5xl"><span className="scribble">Chứng chỉ</span></h2>
          <ul className="border-t border-line">
            {certs.map((k) => (
              <li key={k.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-4">
                <div>
                  <h3 className="font-display font-medium">{k.title}</h3>
                  <p className="text-mute">{k.issuer}{k.issued_on && `, ${fmtMonth(k.issued_on)}`}</p>
                </div>
                <div className="flex gap-4 font-display text-sm">
                  {k.image_url && <a className="text-signal" href={k.image_url}>Xem ảnh</a>}
                  {k.credential_url && <a className="text-signal" href={k.credential_url}>Xác minh</a>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer id="contact" className="border-t border-line py-16">
        <h2 className="text-5xl"><span className="scribble">Làm việc cùng mình</span></h2>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-display">
          <Link href="/contact" className="text-signal">Gửi tin nhắn</Link>
          {profile?.email && <a className="text-signal" href={`mailto:${profile.email}`}>{profile.email}</a>}
          {profile?.github_url && <a href={profile.github_url}>GitHub</a>}
          {profile?.linkedin_url && <a href={profile.linkedin_url}>LinkedIn</a>}
          {social.map((l) => <a key={l.id} href={l.url}>{l.label}</a>)}
        </div>
      </footer>
    </main>
  );
}
