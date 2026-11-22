# Portfolio CMS

## 1. Cài đặt
1. Cài Node.js 20 trở lên (https://nodejs.org), kiểm tra: `node -v`
2. `npm install`
3. Supabase: tạo project, vào SQL Editor chạy lần lượt: `supabase/schema.sql`, `002_experience_certificates.sql`, `003_media.sql`, `004_messages.sql`, `005_social_ratelimit.sql`, `006_cv_versions.sql`, `007_avatar.sql`, `008_grants.sql` (008 chỉ cần khi báo "permission denied for table")
4. Authentication > Users > Add user (email và mật khẩu của bạn). Authentication > Sign In / Providers: tắt "Allow new users to sign up".
5. Chạy trong SQL Editor (thay email): `insert into admins (user_id) select id from auth.users where email = 'you@example.com';`
6. Copy `.env.example` thành `.env.local`, điền 3 biến (URL và anon key lấy ở Project Settings > API).
7. `npm run dev`, mở http://localhost:3000

## 2. Kiểm tra trước khi deploy
`npm run build` phải kết thúc không lỗi. Sau đó `npm run start` và thử lại các mục dưới đây trên http://localhost:3000.

### Đăng nhập và bảo mật
- [ ] Mở /admin khi chưa đăng nhập: bị chuyển về /admin/login
- [ ] Đăng nhập sai mật khẩu: hiện thông báo lỗi
- [ ] Đăng nhập đúng: vào được Tổng quan; Đăng xuất: quay về trang login
- [ ] Mở cửa sổ ẩn danh, vào trang chi tiết của một BẢN NHÁP: phải ra 404
- [ ] Cùng bản nháp đó khi đã đăng nhập: xem được, có dòng "Bản nháp"
- [ ] Ở cửa sổ ẩn danh, mở /sitemap.xml: không có bản nháp nào

### CRUD và xuất bản
- [ ] Thêm Dự án ở trạng thái Bản nháp: không hiện ở trang chủ
- [ ] Bấm Xuất bản: hiện ở trang chủ sau tối đa vài giây; bấm Gỡ xuống: biến mất
- [ ] Sửa tên và ảnh bìa; lưu xong quay về danh sách
- [ ] Tìm theo tên và lọc theo trạng thái; Xóa có hộp xác nhận
- [ ] Làm tương tự với Game, Kỹ năng, Kinh nghiệm, Chứng chỉ

### Upload
- [ ] Ảnh bìa JPG dưới 5MB: thành công
- [ ] Tệp .gif hoặc ảnh trên 5MB: bị từ chối
- [ ] Thư viện media: tải 3 ảnh cùng lúc, xem ở /gallery, mở lightbox, phím mũi tên và Esc
- [ ] Thêm link YouTube: phát được trong lightbox
- [ ] CV: tải PDF, nút Tải CV hiện ở trang chủ và /about

### Liên hệ
- [ ] Gửi form ở /contact: báo thành công; tin xuất hiện ở /admin/messages
- [ ] Gửi tin dưới 10 ký tự: báo lỗi

## 3. Lỗi thường gặp
| Triệu chứng | Nguyên nhân và cách xử lý |
|---|---|
| Trang admin báo "relation ... does not exist" | Chưa chạy file SQL tương ứng |
| Đăng nhập được nhưng báo "không có quyền quản trị" | Chưa chạy lệnh insert vào bảng admins (bước 5) |
| Upload báo "new row violates row-level security" | Chưa chạy schema.sql đoạn storage, hoặc chưa là admin |
| Ảnh không hiện | Kiểm tra bucket `media` ở Storage đã để Public |
| `Invalid supabaseUrl` hoặc `fetch failed` | `.env.local` thiếu hoặc sai; khởi động lại `npm run dev` sau khi sửa |
| Xuất bản xong trang chủ chưa đổi | Đợi vài giây rồi tải lại |

## 4. Deploy lên Vercel
1. Đưa code lên GitHub: `git init`, `git add .`, `git commit -m "init"`, tạo repo trống trên GitHub rồi làm theo hướng dẫn `git remote add origin ...` và `git push -u origin main`. `.env.local` đã nằm trong `.gitignore`, không bị đẩy lên.
2. vercel.com > Add New > Project > chọn repo. Framework tự nhận Next.js.
3. Environment Variables: thêm `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (domain Vercel cấp, ví dụ https://ten-ban.vercel.app).
4. Deploy. Xong vào Supabase > Authentication > URL Configuration, đặt Site URL là domain Vercel.
5. Mở lại danh sách kiểm tra ở mục 2 trên domain thật, đặc biệt mục bản nháp ở cửa sổ ẩn danh.

Không cần Service Role Key ở bất kỳ đâu. Nếu thấy khóa nào có chữ "service_role" trong `.env`, hãy xóa.
