# Đặc tả UX: Tài khoản VCF và luồng đăng ký sự kiện

**Phiên bản:** 1.0  
**Phạm vi:** Đăng nhập, tạo tài khoản hội viên và đăng ký sự kiện đến khi hệ thống tiếp nhận đơn, hiển thị trạng thái chờ xét duyệt và gửi email xác nhận đã đăng ký.  
**Đối tượng:** Người dùng chưa có tài khoản, người có tài khoản nhưng chưa đăng nhập và hội viên đang đăng nhập.

## 1. Mục tiêu và nguyên tắc

Người dùng có thể gửi đăng ký với lượng nhập liệu tối thiểu, biết rõ hồ sơ đang ở trạng thái nào và không phải nhập lại dữ liệu khi quay lại bước trước, xác thực tài khoản hoặc thử lại sau lỗi.

- Mỗi đăng ký thuộc về một sự kiện và một tài khoản/người đăng ký.
- Chỉ gửi đăng ký sau khi các trường bắt buộc hợp lệ và người dùng đồng ý điều khoản tham dự.
- Sau khi gửi đơn thành công, hiển thị trạng thái **Chờ xét duyệt** và gửi email xác nhận đã nhận đăng ký.
- Email xác nhận đã đăng ký không đồng nghĩa với đơn đã được duyệt hoặc có vé/QR check-in.
- Điều kiện duyệt và quyền lợi hội viên lấy theo cấu hình sự kiện từ hệ thống; giao diện không tự suy đoán.

## 2. Thông tin đăng ký

### 2.1. Thông tin đại biểu

- Họ và tên — bắt buộc.
- Email — bắt buộc, dùng để xác thực (nếu cần) và nhận thông báo.
- Số điện thoại — bắt buộc.
- Chức danh — bắt buộc.

### 2.2. Thông tin doanh nghiệp

- Tên doanh nghiệp/tổ chức — bắt buộc.
- Lĩnh vực hoạt động — bắt buộc.
- Quy mô doanh nghiệp — bắt buộc.

### 2.3. Thông tin nhu cầu tham dự

- Hoạt động/chủ đề quan tâm — bắt buộc chọn ít nhất một.
- Nguồn biết đến sự kiện — tùy chọn.
- Thách thức doanh nghiệp muốn chia sẻ — bắt buộc.
- Câu hỏi dành cho Mentor — tùy chọn.
- Đồng ý điều khoản tham dự — bắt buộc; mặc định chưa chọn.

Thông tin cụ thể về lựa chọn, giới hạn ký tự và nội dung điều khoản do cấu hình sự kiện cung cấp. Hệ thống phải giữ cả giá trị lựa chọn và câu trả lời người dùng gửi.

## 3. Luồng A — Người dùng chưa đăng nhập

### Bắt đầu

Người dùng chọn **Đăng ký tham dự** trên trang sự kiện. Hệ thống kiểm tra sự kiện còn mở nhận đăng ký và chưa có đăng ký trùng của tài khoản/email đó.

- Nếu sự kiện đã kết thúc hoặc đóng đăng ký, không mở biểu mẫu; hiển thị trạng thái và hướng dẫn phù hợp.
- Nếu đã có đăng ký, chuyển đến trạng thái đăng ký hiện có thay vì tạo bản ghi mới.
- Nếu đăng ký mở, tạo bản nháp tạm thời và mở biểu mẫu nhiều bước.

### Bước 1 — Thông tin đại biểu

Người dùng nhập họ tên, email, số điện thoại và chức danh, sau đó chọn **Tiếp tục**.

- Email được kiểm tra định dạng; số điện thoại được kiểm tra theo quy tắc hệ thống.
- Nếu dữ liệu không hợp lệ, giữ nguyên dữ liệu và hiển thị lỗi cạnh trường tương ứng.
- Khi hợp lệ, lưu vào bản nháp và chuyển sang Bước 2.

### Bước 2 — Thông tin doanh nghiệp

Người dùng nhập/chọn tên doanh nghiệp, lĩnh vực và quy mô, sau đó chọn **Tiếp tục**.

- Các trường trên đều bắt buộc.
- **Quay lại** trở về Bước 1 và giữ dữ liệu đã nhập.
- Khi hợp lệ, lưu vào bản nháp và chuyển sang Bước 3.

### Bước 3 — Mối quan tâm

Người dùng chọn ít nhất một hoạt động/chủ đề quan tâm; có thể chọn nguồn biết đến sự kiện, sau đó chọn **Tiếp tục**.

- Nếu chưa chọn hoạt động/chủ đề, không cho tiếp tục và báo lỗi tại nhóm lựa chọn.
- Lưu lựa chọn vào bản nháp trước khi chuyển bước.

### Bước 4 — Nhu cầu kết nối và điều khoản

Người dùng nhập thách thức doanh nghiệp, có thể nhập câu hỏi Mentor, đọc điều khoản và chủ động đánh dấu đồng ý.

- Thách thức doanh nghiệp và đồng ý điều khoản là bắt buộc.
- Nếu chưa đồng ý, giữ nguyên nội dung và yêu cầu người dùng xác nhận; không tự đánh dấu.
- **Quay lại** cho phép sửa các bước trước mà không mất dữ liệu.

### Bước 5 — Tạo tài khoản nhanh hoặc đăng nhập

Người dùng phải có tài khoản và đăng nhập trước khi gửi đơn. Dùng email đã nhập ở Bước 1 để kiểm tra tài khoản.

- Email đã có trong hệ thống: yêu cầu đăng nhập vào tài khoản đó theo các bước đăng nhập hiện có; không tạo tài khoản trùng.
- Email chưa có trong hệ thống: cho phép tạo tài khoản nhanh bằng thông tin đã nhập và hoàn tất các bước xác thực theo cơ chế tài khoản hiện có.
- Sau khi đăng nhập hoặc tạo tài khoản nhanh thành công, gắn bản nháp với tài khoản và tiếp tục tại bước xem lại; không yêu cầu nhập lại.
- Nếu đăng nhập/tạo tài khoản hoặc xác thực thất bại, giữ nguyên bản nháp và cho phép thử lại.
- Nếu người dùng thoát giữa chừng, bản nháp được giữ trong thời hạn do hệ thống quy định; khi hết hạn, thông báo và yêu cầu nhập lại.

### Bước 6 — Xem lại và gửi đăng ký

Hiển thị bản tóm tắt thông tin đại biểu, doanh nghiệp, mối quan tâm, nội dung kết nối và điều khoản.

- Người dùng có thể chọn **Chỉnh sửa** ở từng nhóm để quay lại bước tương ứng.
- Nút gửi: **Gửi đăng ký**.
- Trước khi tạo đăng ký, hệ thống kiểm tra lại trạng thái sự kiện, điều kiện tham dự và đăng ký trùng.
- Gửi thành công tạo một đăng ký duy nhất; bấm lặp hoặc tải lại không tạo bản ghi trùng.

### Bước 7 — Kết quả

Sau khi gửi thành công, hiển thị trạng thái **Chờ xét duyệt**, mã đăng ký, tên sự kiện và email nhận thông báo. Hệ thống gửi email xác nhận đã tiếp nhận đăng ký đến email tài khoản.

- Email xác nhận có nghĩa hệ thống đã nhận đơn, không phải đơn đã được duyệt.
- Chưa cấp vé/QR check-in ở trạng thái **Chờ xét duyệt**.
- Nếu gửi thất bại, giữ bản nháp, nêu nguyên nhân có thể xử lý và cung cấp thao tác thử lại.

## 4. Luồng B — Hội viên đã đăng nhập

### Bắt đầu và kiểm tra trùng

Hội viên chọn **Đăng ký tham dự**. Hệ thống kiểm tra sự kiện còn mở, điều kiện tham dự của hội viên và đăng ký hiện có.

- Nếu hội viên đã đăng ký, mở trạng thái đăng ký hiện có; không tạo bản mới.
- Nếu sự kiện không nhận đăng ký, hiển thị trạng thái và hướng dẫn phù hợp.
- Nếu đủ điều kiện, tạo bản nháp gắn với tài khoản hiện tại.

### Bước 1 — Xác nhận thông tin hồ sơ

Điền sẵn họ tên, email tài khoản, số điện thoại, chức danh, doanh nghiệp, lĩnh vực và quy mô từ hồ sơ hội viên.

- Hội viên rà soát và bổ sung các trường bắt buộc còn thiếu.
- Email tài khoản được dùng để nhận thông báo; nếu cần đổi email, yêu cầu cập nhật/xác thực theo chính sách tài khoản trước khi đăng ký.
- Thông tin chỉnh sửa cho đăng ký không ghi đè hồ sơ mặc định.
- Khi hợp lệ, lưu vào bản nháp và chuyển sang Bước 2.

### Bước 2 — Mối quan tâm và nhu cầu kết nối

Hội viên chọn ít nhất một hoạt động/chủ đề quan tâm, nhập thách thức doanh nghiệp và có thể nhập câu hỏi Mentor. Nguồn biết đến sự kiện là tùy chọn.

- Nếu thiếu lựa chọn bắt buộc hoặc thách thức doanh nghiệp, báo lỗi tại trường/nhóm tương ứng và giữ dữ liệu đã nhập.
- Khi hợp lệ, lưu vào bản nháp và chuyển sang Bước 3.

### Bước 3 — Điều khoản và cập nhật hồ sơ

Hội viên đọc và chủ động đồng ý điều khoản tham dự. Nếu thông tin đã sửa khác hồ sơ, cung cấp tùy chọn **Lưu thay đổi vào hồ sơ hội viên**, mặc định chưa chọn.

- Nếu không chọn lưu, các thay đổi chỉ áp dụng cho đăng ký hiện tại.
- Nếu chọn lưu, cập nhật hồ sơ chỉ sau khi đăng ký được gửi thành công; báo lỗi nếu cập nhật hồ sơ thất bại và không làm mất đăng ký.
- Chưa đồng ý điều khoản thì không cho tiếp tục.

### Bước 4 — Xem lại và gửi đăng ký

Hiển thị bản tóm tắt thông tin, lựa chọn tham dự và điều khoản. Hội viên có thể chỉnh sửa từng nhóm.

- Nút gửi: **Gửi đăng ký**.
- Trước khi gửi, kiểm tra lại sự kiện, điều kiện tham dự và đăng ký trùng.
- Gửi thành công tạo một đăng ký gắn với tài khoản hội viên; thao tác gửi lặp không tạo đăng ký trùng.

### Bước 5 — Kết quả

Sau khi gửi thành công, hiển thị **Chờ xét duyệt** cùng mã đăng ký và gửi email xác nhận đã tiếp nhận đến email tài khoản hội viên. Email xác nhận không đồng nghĩa với việc đơn đã được duyệt; chưa cấp vé/QR check-in.

- Nếu phiên hết hạn trước khi gửi, yêu cầu đăng nhập lại rồi khôi phục bản nháp và đúng bước đang làm.
- Không yêu cầu hội viên xác thực lại email tài khoản nếu phiên đăng nhập hợp lệ và hệ thống đã xác minh địa chỉ đó.
- Chỉ hiển thị vé/QR khi trạng thái đăng ký là đã xác nhận.

## 5. Quy tắc trạng thái và xử lý ngoại lệ

Các trạng thái hiển thị cần ánh xạ từ trạng thái đăng ký chuẩn do backend trả về. Trong phạm vi flow này, tối thiểu cần phân biệt:

- **Bản nháp:** chưa gửi đăng ký.
- **Chờ xét duyệt:** hệ thống đã nhận hồ sơ nhưng chưa có quyết định duyệt. Email xác nhận đã đăng ký được gửi sau khi nhận hồ sơ.
- **Đã xác nhận:** chỉ dùng khi hệ thống duyệt đăng ký; vé/QR chỉ được cấp nếu sự kiện quy định.
- **Bị từ chối / Đã hủy:** không còn đăng ký tham dự; hiển thị lý do/hướng dẫn nếu được phép.

Khi sự kiện đóng hoặc điều kiện tham dự thay đổi trong lúc người dùng đang điền form, hệ thống kiểm tra lại khi gửi và trả thông báo có thể hành động được. Không chỉ dựa vào dữ liệu sự kiện đã tải ở đầu luồng.

## 6. Yêu cầu giao diện và thao tác

- Cùng nội dung và thứ tự bước trên mobile/desktop; bố cục thích ứng kích thước màn hình.
- Hiển thị tiến trình và cho biết bước hiện tại.
- Có **Quay lại**, **Tiếp tục**, **Chỉnh sửa** và trạng thái tải phù hợp; quay lại không xóa dữ liệu.
- Đánh dấu trường bắt buộc; thông báo lỗi ngắn gọn, đặt cạnh trường và có thể đọc bằng công nghệ hỗ trợ.
- Khi gửi đơn hoặc xác thực tài khoản, ngăn thao tác lặp và hiển thị đang xử lý.
- Khi mất mạng/lỗi máy chủ, giữ dữ liệu đã nhập và cho phép thử lại an toàn.
- Sau khi gửi, cung cấp đường dẫn xem trạng thái đăng ký và hướng dẫn liên hệ hỗ trợ khi cần.

## 7. Tiêu chí nghiệm thu

1. Người chưa đăng nhập không thể gửi đơn trước khi đăng nhập hoặc tạo tài khoản nhanh thành công.
2. Nếu email đã tồn tại, người dùng được yêu cầu đăng nhập theo flow hiện có; không tạo tài khoản trùng và sau đăng nhập tiếp tục đúng bản nháp.
3. Nếu email chưa tồn tại, người dùng có thể tạo tài khoản nhanh và sau đó tiếp tục đúng bản nháp.
4. Hội viên nhìn thấy dữ liệu hồ sơ được điền sẵn, bổ sung trường thiếu và gửi đăng ký khi phiên hợp lệ.
5. Cả hai luồng đều chặn bước tiếp theo khi thiếu trường bắt buộc hoặc chưa đồng ý điều khoản; dữ liệu đã nhập được giữ nguyên.
6. Quay lại, tải lại trong phạm vi bản nháp còn hiệu lực hoặc đăng nhập lại không làm mất dữ liệu đã lưu.
7. Gửi lặp, nhấn nút nhiều lần hoặc thử lại sau lỗi không tạo đăng ký trùng.
8. Sau khi gửi thành công, giao diện hiển thị **Chờ xét duyệt** và hệ thống gửi email xác nhận đã tiếp nhận.
9. Email xác nhận không đồng nghĩa với đã duyệt; không cấp vé/QR khi còn chờ xét duyệt.

## 8. Điểm cần Product xác nhận trước khi chốt triển khai

- Thời hạn lưu bản nháp và việc có cho phép tiếp tục trên thiết bị khác hay không.
- Chính sách xác minh email sau khi tạo tài khoản hội viên.
- Bước duyệt của Ban Thư ký áp dụng cho loại sự kiện/hội viên nào.
- Giá trị lựa chọn, giới hạn ký tự, chính sách lưu thông tin cá nhân và nội dung điều khoản.

## 9. Luồng đăng nhập

### 9.1. Bắt đầu đăng nhập

Người dùng mở màn hình **Đăng nhập** từ điều hướng chung hoặc từ bước đăng ký sự kiện khi email đã có tài khoản. Nếu đi từ đăng ký sự kiện, giữ lại bản nháp và ghi nhớ sự kiện để quay lại sau đăng nhập.

Màn hình có hai phương thức chính: **Mật khẩu** và **Mã OTP**. Nếu đăng nhập Google/Facebook đang được bật, hiển thị thêm lựa chọn tương ứng. Email là bắt buộc với hai phương thức chính.

### 9.2. Đăng nhập bằng mật khẩu

1. Người dùng nhập email và mật khẩu, sau đó chọn **Đăng nhập**.
2. Hệ thống kiểm tra định dạng email, xác thực thông tin đăng nhập và trạng thái tài khoản.
3. Nếu thành công, tạo phiên đăng nhập và chuyển người dùng về nơi họ bắt đầu:
   - Bắt đầu từ đăng ký sự kiện: khôi phục bản nháp, gắn với tài khoản vừa đăng nhập và mở bước xem lại.
   - Bắt đầu từ màn hình đăng nhập: chuyển đến trang mặc định dành cho hội viên.
4. Nếu email hoặc mật khẩu không đúng, hiển thị lỗi dễ hiểu, không xóa email và không làm lộ thông tin nhạy cảm.
5. Sau 5 lần nhập sai mật khẩu, tạm khóa đăng nhập 15 phút; hiển thị thời gian hoặc hướng dẫn để thử lại.
6. **Quên mật khẩu?** mở luồng khôi phục mật khẩu tại mục 9.4.

### 9.3. Đăng nhập bằng OTP email

1. Người dùng chọn tab **Mã OTP**, nhập email tài khoản và chọn **Gửi mã OTP về email**.
2. Nếu email chưa có tài khoản, thông báo tài khoản chưa tồn tại và đưa ra lựa chọn **Đăng ký thành viên**. Không tạo tài khoản mới bằng luồng OTP đăng nhập.
3. Nếu email hợp lệ và có tài khoản, gửi mã OTP đến email; hiển thị email đã che một phần và chuyển sang màn hình nhập mã.
4. Người dùng nhập mã 6 chữ số và chọn **Xác nhận và đăng nhập**. Cho phép dán mã; tự chuyển focus giữa các ô.
5. Mã OTP gồm 6 chữ số, có hiệu lực 5 phút. Cho phép gửi lại sau 60 giây; khi gửi lại, mã cũ không còn dùng được.
6. Nếu mã sai hoặc hết hạn, thông báo lỗi, giữ email và cho phép thử lại/gửi mã mới. Sau 5 lần nhập sai, tạm khóa xác thực 15 phút.
7. Khi xác thực thành công, tạo phiên đăng nhập và quay về trang/luồng khởi đầu như quy tắc ở mục 9.2.

### 9.4. Khôi phục mật khẩu

1. Người dùng chọn **Quên mật khẩu?** từ màn hình đăng nhập.
2. Nhập email và chọn **Gửi liên kết đặt lại mật khẩu**.
3. Hệ thống gửi hướng dẫn đặt lại đến email tương ứng và hiển thị thông báo gửi yêu cầu. Không tiết lộ trạng thái tài khoản cho người khác ngoài chủ email.
4. Người dùng mở liên kết, đặt mật khẩu mới và xác nhận theo chính sách mật khẩu hiện hành.
5. Khi đặt lại thành công, thông báo hoàn tất và đưa người dùng về đăng nhập. Nếu yêu cầu không hợp lệ/hết hạn, cho phép gửi yêu cầu mới.

## 10. Luồng tạo tài khoản hội viên

### 10.1. Bắt đầu tạo tài khoản

Người dùng chọn **Đăng ký thành viên** từ màn hình đăng nhập hoặc được chuyển sang đăng ký khi email dùng để đăng ký sự kiện chưa tồn tại trong hệ thống.

### 10.2. Nhập thông tin tài khoản

Các trường trên màn hình:

- Họ và tên — bắt buộc.
- Email công tác — bắt buộc và phải chưa được đăng ký.
- Doanh nghiệp/tổ chức — tùy chọn trên form tạo tài khoản; có thể được yêu cầu ở form đăng ký sự kiện.
- Chức danh/chức vụ — tùy chọn trên form tạo tài khoản.
- Mật khẩu — bắt buộc, tối thiểu 8 ký tự.
- Xác nhận mật khẩu — bắt buộc và phải trùng mật khẩu.
- Đồng ý Điều lệ Hội viên và Quy chế bảo mật — bắt buộc, mặc định chưa chọn.

Người dùng có thể bật/tắt hiển thị mật khẩu. Khi gửi form, kiểm tra lỗi tại trường tương ứng; giữ các giá trị đã nhập và không tạo tài khoản nếu còn lỗi.

### 10.3. Email đã tồn tại

Nếu email đã có tài khoản, dừng tạo tài khoản mới, giữ email đã nhập và hiển thị lựa chọn **Đăng nhập ngay**. Khi người dùng chọn, mở luồng đăng nhập với email được điền sẵn. Nếu thao tác bắt đầu từ đăng ký sự kiện, giữ nguyên bản nháp đăng ký trong suốt quá trình.

### 10.4. Hoàn tất tạo tài khoản

1. Khi dữ liệu hợp lệ và người dùng đã đồng ý điều lệ/chính sách, hệ thống tạo tài khoản và hồ sơ hội viên.
2. Hiển thị thông báo tạo tài khoản thành công và thiết lập phiên đăng nhập nếu hệ thống cho phép đăng nhập tự động sau tạo tài khoản.
3. Nếu tạo tài khoản từ đăng ký sự kiện, gắn bản nháp với tài khoản vừa tạo và chuyển về bước xem lại đơn; không yêu cầu nhập lại thông tin sự kiện.
4. Nếu có yêu cầu xác minh email từ chính sách tài khoản, gửi email xác minh và yêu cầu hoàn tất xác minh trước khi gửi đơn đăng ký. Khi đó vẫn giữ bản nháp và khôi phục đúng luồng sau xác minh.
5. Nếu tạo tài khoản thất bại, không báo thành công; giữ dữ liệu form và cho phép thử lại.

## 11. Quy tắc nối luồng tài khoản với đăng ký sự kiện

- Người chưa đăng nhập phải đăng nhập hoặc tạo tài khoản thành công trước khi gửi đơn đăng ký sự kiện.
- Email đã tồn tại luôn đi vào luồng đăng nhập hiện có; không tạo tài khoản thứ hai cho cùng email.
- Email chưa tồn tại đi vào luồng tạo tài khoản nhanh; các thông tin đã thu thập trong form sự kiện được điền sẵn nếu tương ứng với trường tài khoản.
- Sau đăng nhập/tạo tài khoản thành công, tiếp tục bản nháp đã lưu. Chỉ tạo đơn đăng ký khi người dùng chủ động bấm **Gửi đăng ký** ở bước xem lại.
- Sau khi gửi đơn thành công, hiển thị **Chờ xét duyệt** và gửi email xác nhận đã tiếp nhận. Email này không thay thế kết quả đăng nhập/tạo tài khoản và không có nghĩa đơn đã được duyệt.
- Phiên đăng nhập hết hạn trong lúc đăng ký: yêu cầu đăng nhập lại, rồi quay về đúng bản nháp và bước đang làm.
- Nút đăng nhập, xác thực OTP, tạo tài khoản và gửi đơn phải chống gửi lặp; lỗi mạng không làm mất dữ liệu hoặc tạo nhiều tài khoản/đơn.
