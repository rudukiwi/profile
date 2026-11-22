-- Chạy trong Supabase > SQL Editor nếu gặp "permission denied for table ...".
-- Project Supabase mới không còn tự cấp quyền cho bảng tạo bằng SQL. RLS (các policy) vẫn quyết định ai được đọc/ghi.
grant usage on schema public to anon, authenticated;

-- Khách xem trang công khai: chỉ được đọc (policy RLS lọc bản nháp)
grant select on profile, entries, skills, experience, certificates, media, social_links to anon, authenticated;

-- Admin (đã đăng nhập): đọc và ghi toàn bộ, policy is_admin() vẫn chặn người khác
grant insert, update, delete on profile, entries, skills, experience, certificates, media, social_links, cv_versions to authenticated;
grant select on cv_versions, admins to authenticated;

-- Tin nhắn: khách chỉ được gửi, admin đọc/sửa/xóa
grant insert on messages to anon, authenticated;
grant select, update, delete on messages to authenticated;

grant execute on function is_admin() to anon, authenticated;
