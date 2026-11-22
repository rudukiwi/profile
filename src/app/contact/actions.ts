"use server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function submitMessage(fd: FormData) {
  if (String(fd.get("website") ?? "")) redirect("/contact?sent=1"); // honeypot: bot điền ô ẩn thì giả vờ thành công
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();
  const valid = name.length >= 1 && name.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message.length >= 10 && message.length <= 3000;
  if (!valid) redirect("/contact?error=invalid");
  const sb = await supabaseServer();
  const { error } = await sb.from("messages").insert({ name, email, message });
  if (error) redirect("/contact?error=server");
  redirect("/contact?sent=1");
}
