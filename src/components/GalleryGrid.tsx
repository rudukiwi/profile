"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Media } from "@/lib/types";
import { youtubeEmbed } from "@/lib/format";

export default function GalleryGrid({ items, lang = "vi" }: { items: Media[]; lang?: "vi" | "en" }) {
  const [i, setI] = useState<number | null>(null);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") setI((n) => (n === null ? n : (n + 1) % items.length));
      if (e.key === "ArrowLeft") setI((n) => (n === null ? n : (n - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [i, items.length]);

  const cur = i === null ? null : items[i];
  const embed = cur?.kind === "video" ? youtubeEmbed(cur.url) : null;

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3">
        {items.map((m, idx) => (
          <li key={m.id} className="mb-3 break-inside-avoid">
            <button onClick={() => setI(idx)} className="block w-full overflow-hidden rounded-md border border-line text-left transition hover:border-signal" aria-label={`${lang === "en" ? "Open" : "Mở"} ${m.title}`}>
              {m.kind === "image"
                ? <img src={m.url} alt={m.title} loading="lazy" className="w-full" />
                : <span className="flex aspect-video items-center justify-center bg-raise px-3 text-center font-display text-mute">Video: {m.title}</span>}
            </button>
          </li>
        ))}
      </ul>

      {cur && (
        <motion.div role="dialog" aria-modal="true" aria-label={cur.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ground/95 p-4" onClick={() => setI(null)}>
          <button autoFocus className="btn-ghost absolute right-4 top-4" onClick={() => setI(null)}>{lang === "en" ? "Close" : "Đóng"}</button>
          <div className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {cur.kind === "image" && <img src={cur.url} alt={cur.title} className="max-h-[85vh] rounded-md" />}
            {cur.kind === "video" && embed && <iframe src={embed} title={cur.title} allowFullScreen className="aspect-video w-[min(90vw,64rem)] rounded-md" />}
            {cur.kind === "video" && !embed && <a href={cur.url} className="btn">{lang === "en" ? "Open video" : "Mở video"}: {cur.title}</a>}
            <p className="mt-3 text-center font-display text-sm text-mute">{cur.title}. Dùng phím mũi tên trái phải để chuyển.</p>
          </div>
        </motion.div>
      )}
    </>
  );
}
