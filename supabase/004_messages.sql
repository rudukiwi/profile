-- Chạy file này trong Supabase > SQL Editor (sau 003)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table messages enable row level security;

-- Khách (chưa đăng nhập) chỉ được GỬI, không đọc được; giới hạn độ dài ở tầng database
create policy "anyone can send" on messages for insert to anon, authenticated
  with check (
    char_length(name) between 1 and 100
    and char_length(message) between 10 and 3000
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
create policy "admin read messages" on messages for select using (is_admin());
create policy "admin update messages" on messages for update using (is_admin()) with check (is_admin());
create policy "admin delete messages" on messages for delete using (is_admin());
