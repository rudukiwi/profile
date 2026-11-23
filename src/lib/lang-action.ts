"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLang(lang: "vi" | "en") {
  (await cookies()).set("lang", lang === "en" ? "en" : "vi", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}
