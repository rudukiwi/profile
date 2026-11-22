import { supabaseServer } from "@/lib/supabase/server";
import { removeMessage, setRead } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import type { Message } from "@/lib/types";

export default async function Messages() {
  const sb = await supabaseServer();
  const { data, error } = await sb.from("messages").select("*").order("created_at", { ascending: false });
  const items = (data ?? []) as Message[];
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Tin nhắn</h1>
      {error && <p role="alert" className="mt-4 text-red-400">Không tải được dữ liệu: {error.message}. Bạn đã chạy 004_messages.sql chưa?</p>}
      {!items.length && !error && <p className="mt-6 text-mute">Chưa có tin nhắn nào.</p>}
      <ul className="mt-6">
        {items.map((m) => (
          <li key={m.id} className="border-t border-line py-5">
            <div className="flex flex-wrap items-baseline gap-x-3 font-display">
              <span className={m.is_read ? "text-mute" : "font-semibold text-signal"}>{m.name}</span>
              <a href={`mailto:${m.email}`} className="text-sm text-mute hover:text-paper">{m.email}</a>
              <span className="ml-auto text-sm text-mute">{new Date(m.created_at).toLocaleString("vi-VN")}</span>
            </div>
            <p className="mt-2 whitespace-pre-line">{m.message}</p>
            <div className="mt-3 flex gap-2">
              <form action={setRead.bind(null, m.id, !m.is_read)}><button className="btn-ghost">{m.is_read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}</button></form>
              <form action={removeMessage.bind(null, m.id)}><ConfirmButton message={`Xóa tin nhắn của ${m.name}?`} className="btn-ghost hover:!border-red-400">Xóa</ConfirmButton></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
