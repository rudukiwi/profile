-- Chạy file này trong Supabase > SQL Editor (sau 002)
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image','video')),
  url text not null,
  storage_path text,                   -- null với video (chỉ lưu URL)
  title text not null default '',
  category text not null default 'Chung',
  created_at timestamptz not null default now()
);
create index if not exists media_category on media (category, created_at desc);
alter table media enable row level security;
create policy "public read media rows" on media for select using (true);
create policy "admin write media rows" on media for all using (is_admin()) with check (is_admin());
