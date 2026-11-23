import { cookies } from "next/headers";
import type { Lang } from "./i18n-strings";

export { T, pick } from "./i18n-strings";
export type { Lang } from "./i18n-strings";

/** Ngôn ngữ đang chọn (cookie "lang"), mặc định tiếng Việt. */
export async function getLang(): Promise<Lang> {
  return (await cookies()).get("lang")?.value === "en" ? "en" : "vi";
}
