-- Chạy file này trong Supabase > SQL Editor (sau 006). Thêm ảnh chân dung cho trang chủ mới.
alter table profile add column if not exists avatar_url text;
