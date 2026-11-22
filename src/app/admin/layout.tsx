import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata = { title: "Quản trị", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (user) {
    const { data: ok } = await sb.rpc("is_admin");
    if (!ok)
      return (
        <main className="mx-auto max-w-sm px-6 pt-24">
          <h1 className="text-2xl font-semibold">Tài khoản này không có quyền quản trị</h1>
          <p className="mt-3 text-mute">Thêm user vào bảng admins (xem cuối supabase/schema.sql), hoặc đăng nhập bằng tài khoản khác.</p>
          <form action={signOut} className="mt-6"><button className="btn">Đăng xuất</button></form>
        </main>
      );
  }
  if (!user) return <>{children}</>; // trang login
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <nav className="mb-10 flex items-center gap-6 border-b border-line pb-4 font-display text-sm">
        <Link href="/admin" className="font-semibold">Tổng quan</Link>
        <Link href="/admin/projects">Dự án</Link>
        <Link href="/admin/games">Game</Link>
        <Link href="/admin/skills">Kỹ năng</Link>
        <Link href="/admin/experience">Kinh nghiệm</Link>
        <Link href="/admin/certificates">Chứng chỉ</Link>
        <Link href="/admin/media">Thư viện media</Link>
        <Link href="/admin/social">Mạng xã hội</Link>
        <Link href="/admin/messages">Tin nhắn</Link>
        <Link href="/admin/profile">Thông tin và CV</Link>
        <form action={signOut} className="ml-auto"><button className="text-mute hover:text-paper">Đăng xuất</button></form>
      </nav>
      {children}
    </div>
  );
}
