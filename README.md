# VCF Forum 2026

Đây là ứng dụng React chạy bằng Vite. File `index.html` là entry point dành cho Vite,
không mở trực tiếp bằng cách bấm đúp trong Finder vì trình duyệt không thể tự biên dịch
file TypeScript/JSX trong `src/`.

## Chạy trên máy

Yêu cầu Node.js 18 trở lên.

```bash
npm install
npm start
```

Sau đó mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

Có thể dùng `npm run dev` thay cho `npm start`. Dừng server bằng `Ctrl + C`.

## Supabase Auth và hồ sơ hội viên

Luồng đăng ký email sử dụng Supabase Auth. Sau khi đăng ký, trigger database tự tạo
hồ sơ tương ứng trong bảng `public.profiles`; mật khẩu chỉ được Supabase Auth quản lý.

Các biến môi trường nằm trong `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

Không đưa service role key vào frontend. Khi deploy domain mới, thêm domain đó vào
Supabase Auth > URL Configuration > Redirect URLs để liên kết xác thực email quay về đúng ứng dụng.

## Màn quản trị hội viên

Sau khi tạo tài khoản quản trị bằng form đăng ký, mở Supabase Dashboard → SQL Editor
và chạy câu lệnh sau, thay email bằng email quản trị của bạn:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
```

Đăng xuất rồi đăng nhập lại để token nhận role mới. Trong ứng dụng, mở **Hồ sơ** →
**Quản trị hội viên**. Màn này cho phép tìm kiếm, lọc, xem chi tiết và duyệt hồ sơ.

## Checklist kiểm thử

1. Chạy website:

   ```bash
   npm start
   ```

2. Mở [http://localhost:3000](http://localhost:3000) → **Tài khoản** → **Đăng ký thành viên VCF**.
3. Nhập họ tên, một email chưa từng đăng ký, mật khẩu đủ 8 ký tự, xác nhận mật khẩu và tích CAPTCHA.
4. Mở email xác thực Supabase nếu project đang bật xác thực email, sau đó đăng nhập lại.
5. Kiểm tra dữ liệu tại **Authentication → Users** và **Table Editor → public.profiles**.
6. Cấp role admin theo SQL ở trên, đăng xuất/đăng nhập lại, rồi mở **Hồ sơ → Quản trị hội viên**.
7. Trong màn Admin, chọn một hồ sơ và thử các trạng thái **Duyệt hồ sơ**, **Từ chối**, **Đưa về chờ duyệt**.

Phần **đăng ký và duyệt sự kiện** hiện vẫn là luồng mô phỏng phía trình duyệt:
vào **Sự kiện** → mở một sự kiện → đăng ký → vào **Hồ sơ → Lịch sử đăng ký sự kiện**
→ bấm **Duyệt ngay (Mô phỏng)**. Dữ liệu sự kiện sẽ mất khi tải lại trang và chưa xuất hiện
trong Supabase. Muốn quản lý thật cần thêm bảng `event_registrations` và đưa các nút duyệt
sự kiện vào màn VCF Admin.

## Build bản production

```bash
npm run build
npm run preview
```
