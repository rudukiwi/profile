export const fmtMonth = (d: string | null, lang: "vi" | "en" = "vi") =>
  d ? new Date(d).toLocaleDateString(lang === "en" ? "en-GB" : "vi-VN", { month: "2-digit", year: "numeric" }) : lang === "en" ? "Present" : "Hiện tại";

export function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
