export const fmtMonth = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }) : "Hiện tại";

export function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
