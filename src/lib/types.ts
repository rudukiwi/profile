export type Entry = {
  id: string; kind: "project" | "game"; title: string; slug: string; summary: string; body: string;
  tech: string[]; cover_url: string | null; link_url: string | null; repo_url: string | null;
  status: "draft" | "published"; created_at: string;
  title_en?: string | null; summary_en?: string | null; body_en?: string | null;
};
export type Profile = { name: string; headline: string; bio: string; github_url: string | null; linkedin_url: string | null; email: string | null; cv_url: string | null; avatar_url?: string | null; headline_en?: string | null; bio_en?: string | null };
export type Skill = { id: string; category: string; name: string };
export type Experience = { id: string; company: string; position: string; start_date: string; end_date: string | null; description: string };
export type Certificate = { id: string; title: string; issuer: string; issued_on: string | null; credential_url: string | null; image_url: string | null };
export type Media = { id: string; kind: "image" | "video"; url: string; storage_path: string | null; title: string; category: string; created_at: string };
export type Message = { id: string; name: string; email: string; message: string; is_read: boolean; created_at: string };
