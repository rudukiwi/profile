-- Chạy file này trong Supabase > SQL Editor (sau 005)
create table if not exists cv_versions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  storage_path text,
  created_at timestamptz not null default now()
);
alter table cv_versions enable row level security;
create policy "admin all cv_versions" on cv_versions for all using (is_admin()) with check (is_admin());
-- CV đang dùng vẫn là profile.cv_url (khách đọc được); bảng này chỉ lưu lịch sử các bản đã tải lên.
