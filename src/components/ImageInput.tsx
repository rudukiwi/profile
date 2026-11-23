"use client";
import type { ChangeEvent, InputHTMLAttributes } from "react";

const MAX_SIDE = 1920;

/** Thu nhỏ ảnh ngay trên trình duyệt trước khi gửi, vì máy chủ (Vercel) chỉ nhận request tối đa khoảng 4,5MB. */
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 700 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

export default function ImageInput(props: InputHTMLAttributes<HTMLInputElement>) {
  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    const out = await Promise.all(files.map(shrink));
    const dt = new DataTransfer();
    out.forEach((f) => dt.items.add(f));
    input.files = dt.files;
  }
  return <input {...props} type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} />;
}
