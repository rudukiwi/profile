import { signIn } from "../actions";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-sm px-6 pt-24">
      <h1 className="text-3xl font-semibold">Đăng nhập quản trị</h1>
      <form action={signIn} className="mt-8 space-y-4">
        <input name="email" type="email" required placeholder="Email" className="field" autoComplete="email" />
        <input name="password" type="password" required placeholder="Mật khẩu" className="field" autoComplete="current-password" />
        {error && <p role="alert" className="font-display text-sm text-red-400">Email hoặc mật khẩu không đúng.</p>}
        <button className="btn">Đăng nhập</button>
      </form>
    </main>
  );
}
