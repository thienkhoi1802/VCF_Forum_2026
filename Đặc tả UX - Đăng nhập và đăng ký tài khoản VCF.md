# Đặc tả UX: Đăng nhập và đăng ký tài khoản VCF

**Phiên bản:** 1.0  
**Phạm vi:** Đăng nhập bằng mật khẩu hoặc OTP, khôi phục mật khẩu và tạo tài khoản hội viên.  
**Điểm vào:** Điều hướng chung hoặc bước xác thực trong luồng đăng ký sự kiện.  
**Nguyên tắc:** Nếu người dùng đi từ đăng ký sự kiện, giữ bản nháp và đưa họ quay lại đúng luồng sau khi đăng nhập/tạo tài khoản.

## 1. Mục tiêu

- Cho phép người có tài khoản đăng nhập bằng mật khẩu hoặc mã OTP gửi qua email.
- Cho phép người chưa có tài khoản tạo tài khoản hội viên.
- Ngăn tạo nhiều tài khoản bằng cùng một email.
- Bảo toàn ngữ cảnh và dữ liệu đăng ký sự kiện trong suốt quá trình xác thực.

## 2. Luồng đăng nhập

### 2.1. Bắt đầu đăng nhập

Người dùng mở màn hình **Đăng nhập** từ điều hướng chung hoặc được chuyển đến đây khi email khai báo ở bước đăng ký sự kiện đã có tài khoản.

Màn hình cung cấp hai phương thức:

- **Mật khẩu**
- **Mã OTP**

Nếu đăng nhập Google/Facebook được bật trong sản phẩm, các lựa chọn này cũng xuất hiện. Khi bắt đầu từ đăng ký sự kiện, giữ nguyên bản nháp, sự kiện đang đăng ký và các dữ liệu đã nhập.

### 2.2. Đăng nhập bằng mật khẩu

1. Người dùng nhập email và mật khẩu, sau đó chọn **Đăng nhập**.
2. Email phải đúng định dạng; mật khẩu phải được nhập. Theo kiểm tra giao diện hiện tại, mật khẩu đăng nhập tối thiểu 6 ký tự.
3. Khi thông tin không hợp lệ, hiển thị lỗi ngay dưới trường tương ứng, giữ email để người dùng sửa/thử lại.
4. Khi thông tin đăng nhập sai, hiển thị lỗi và số lần thử còn lại nếu hệ thống hỗ trợ.
5. Sau 5 lần nhập sai mật khẩu, tạm khóa đăng nhập 15 phút và hiển thị hướng dẫn thử lại hoặc liên hệ hỗ trợ.
6. Khi đăng nhập thành công:
   - Tạo phiên đăng nhập.
   - Nếu người dùng đến từ đăng ký sự kiện, gắn bản nháp với tài khoản vừa đăng nhập và quay lại bước xem lại đơn.
   - Nếu người dùng vào từ điều hướng chung, chuyển đến trang mặc định dành cho hội viên.

Người dùng có thể chọn **Quên mật khẩu?** để bắt đầu luồng tại mục 4 hoặc **Đăng ký thành viên** nếu chưa có tài khoản.

### 2.3. Đăng nhập bằng OTP email

1. Người dùng chọn tab **Mã OTP**, nhập email tài khoản và chọn **Gửi mã OTP về email**.
2. Nếu email chưa có tài khoản, hiển thị thông báo tài khoản chưa tồn tại và lựa chọn **Đăng ký thành viên**. OTP đăng nhập không tự tạo tài khoản.
3. Nếu email đã có tài khoản, gửi mã OTP và hiển thị email đã che một phần.
4. Người dùng nhập mã 6 chữ số. Cho phép dán mã và tự chuyển focus giữa các ô nhập.
5. Mã có hiệu lực 5 phút. Cho phép gửi mã mới sau 60 giây; mã cũ hết hiệu lực khi mã mới được gửi.
6. Nếu mã sai hoặc hết hạn, giữ email, báo lỗi và cho phép thử lại hoặc gửi mã mới. Sau 5 lần nhập sai, tạm khóa xác thực 15 phút.
7. Khi mã hợp lệ, tạo phiên đăng nhập và chuyển hướng theo quy tắc ở mục 2.2.

## 3. Luồng đăng ký tài khoản hội viên

### 3.1. Bắt đầu đăng ký

Người dùng chọn **Đăng ký thành viên** từ màn hình đăng nhập. Trong luồng đăng ký sự kiện, người dùng được chuyển đến tạo tài khoản nhanh nếu email chưa tồn tại.

### 3.2. Nhập thông tin

Các trường của form đăng ký tài khoản:

- Họ và tên — bắt buộc.
- Email công tác — bắt buộc, đúng định dạng và chưa được dùng cho tài khoản khác.
- Doanh nghiệp/tổ chức — tùy chọn trong form tài khoản.
- Chức danh/chức vụ — tùy chọn trong form tài khoản.
- Mật khẩu — bắt buộc, tối thiểu 8 ký tự.
- Xác nhận mật khẩu — bắt buộc và phải khớp với mật khẩu.
- Đồng ý Điều lệ Hội viên và Quy chế bảo mật — bắt buộc; mặc định chưa chọn.

Người dùng có thể bật/tắt hiển thị mật khẩu. Khi chọn hoàn tất, kiểm tra các trường và hiển thị lỗi tại đúng trường. Nếu có lỗi, không tạo tài khoản và giữ dữ liệu đã nhập.

### 3.3. Email đã được đăng ký

Nếu email đã tồn tại:

1. Không tạo tài khoản mới.
2. Giữ email người dùng đã nhập.
3. Hiển thị thông báo email đã có tài khoản kèm hành động **Đăng nhập ngay**.
4. Khi chọn hành động này, mở màn hình đăng nhập và điền sẵn email.
5. Nếu bắt đầu từ đăng ký sự kiện, giữ bản nháp sự kiện trong khi người dùng đăng nhập; sau khi đăng nhập thành công, quay lại bản nháp.

### 3.4. Hoàn tất tạo tài khoản

1. Khi dữ liệu hợp lệ và người dùng đã đồng ý điều lệ/chính sách, tạo tài khoản và hồ sơ hội viên.
2. Hiển thị thông báo tạo tài khoản thành công. Nếu hệ thống hỗ trợ đăng nhập tự động sau khi tạo, khởi tạo phiên đăng nhập.
3. Nếu tạo tài khoản từ đăng ký sự kiện, điền sẵn thông tin tương ứng đã có trong bản nháp, gắn bản nháp với tài khoản và quay lại bước xem lại đơn. Chưa gửi đơn sự kiện tự động; người dùng cần chủ động chọn **Gửi đăng ký**.
4. Nếu chính sách tài khoản yêu cầu xác minh email, gửi hướng dẫn xác minh và giữ bản nháp cho đến khi người dùng hoàn tất.
5. Nếu tạo tài khoản thất bại, thông báo lỗi, giữ dữ liệu và cho phép thử lại.

## 4. Luồng khôi phục mật khẩu

1. Từ màn hình đăng nhập bằng mật khẩu, người dùng chọn **Quên mật khẩu?**.
2. Nhập email và chọn **Gửi liên kết đặt lại mật khẩu**.
3. Hệ thống gửi hướng dẫn đặt lại mật khẩu đến email tài khoản và hiển thị thông báo kiểm tra hộp thư đến/thư rác.
4. Người dùng mở liên kết, nhập mật khẩu mới và xác nhận theo chính sách mật khẩu hiện hành.
5. Khi đặt lại thành công, thông báo hoàn tất và đưa người dùng về màn hình đăng nhập.
6. Nếu liên kết không hợp lệ hoặc hết hạn, cho phép yêu cầu liên kết mới.

## 5. Quy tắc khi đi từ đăng ký sự kiện

- Người chưa đăng nhập phải đăng nhập hoặc tạo tài khoản trước khi gửi đơn đăng ký sự kiện.
- Email đã tồn tại chuyển sang đăng nhập theo flow hiện có; không cho tạo tài khoản trùng.
- Email chưa tồn tại chuyển sang tạo tài khoản nhanh. Điền sẵn các thông tin tài khoản đã thu thập trong form sự kiện nếu có.
- Sau đăng nhập/tạo tài khoản thành công, khôi phục bản nháp và chuyển về bước xem lại.
- Chỉ tạo đơn sự kiện khi người dùng chủ động chọn **Gửi đăng ký**.
- Sau khi đơn được gửi thành công, flow sự kiện hiển thị **Chờ xét duyệt** và gửi email xác nhận đã tiếp nhận. Email này không có nghĩa đơn đã được duyệt.
- Nếu phiên đăng nhập hết hạn trong lúc điền form, yêu cầu đăng nhập lại rồi đưa người dùng về đúng bản nháp và bước đang thực hiện.
- Nhấn lặp, tải lại trang hoặc thử lại sau lỗi không được tạo nhiều tài khoản hay nhiều phiên xử lý đăng ký.

## 6. Trạng thái và lỗi cần xử lý

- Email sai định dạng: báo lỗi tại trường email.
- Email chưa có tài khoản khi đăng nhập/OTP: cung cấp đường dẫn sang đăng ký tài khoản.
- Email đã tồn tại khi đăng ký: cung cấp đường dẫn sang đăng nhập, không tạo tài khoản trùng.
- Sai mật khẩu hoặc OTP: báo lỗi, giữ email và cho phép thử lại theo giới hạn bảo mật.
- OTP hết hạn: thông báo hết hạn và cho phép gửi lại khi hết thời gian chờ.
- Tài khoản bị tạm khóa: nêu thời gian/hướng dẫn mở lại theo chính sách bảo mật.
- Lỗi mạng hoặc lỗi máy chủ: giữ dữ liệu form, không báo thành công và cung cấp thao tác thử lại.
- Phiên hết hạn: yêu cầu đăng nhập lại và khôi phục ngữ cảnh trước đó.

## 7. Tiêu chí nghiệm thu

1. Người dùng có thể đăng nhập bằng email/mật khẩu hoặc email/OTP.
2. OTP chỉ được gửi đến email đã có tài khoản; mã gồm 6 chữ số, hết hạn sau 5 phút và có thể gửi lại sau 60 giây.
3. Sau 5 lần nhập sai mật khẩu hoặc OTP, hệ thống áp dụng khóa tạm 15 phút.
4. Người dùng tạo tài khoản được khi email chưa tồn tại, mật khẩu đạt tối thiểu 8 ký tự, xác nhận mật khẩu khớp và đã đồng ý điều lệ/chính sách.
5. Email đã tồn tại không tạo tài khoản mới; người dùng được chuyển sang đăng nhập với email điền sẵn.
6. Sau đăng nhập hoặc tạo tài khoản từ luồng sự kiện, bản nháp và sự kiện đang đăng ký được khôi phục đúng.
7. Đăng nhập/tạo tài khoản thành công không tự gửi đơn đăng ký sự kiện; người dùng phải xác nhận gửi ở bước xem lại.
8. Lỗi xác thực, lỗi mạng hoặc tải lại không làm mất dữ liệu bản nháp.

## 8. Điểm cần xác nhận trước khi triển khai

- Có bắt buộc xác minh email sau khi tạo tài khoản mới không?
- Tạo tài khoản thành công có đăng nhập tự động hay yêu cầu đăng nhập riêng?
- Có bật đăng nhập Google/Facebook trong phiên bản triển khai này không?
- Thời hạn giữ bản nháp sự kiện trong lúc người dùng đăng nhập/xác minh là bao lâu?
- Nội dung và thời hạn hiệu lực của liên kết đặt lại mật khẩu do backend/auth provider quy định như thế nào?
