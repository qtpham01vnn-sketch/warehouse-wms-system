# ISO Command Center - Chiến Lược Quản Trị Tuân Thủ

**ISO Command Center** (nằm trong `/app-iso`) là trung tâm xử lý cho mọi quy trình liên quan đến hệ thống quản lý chất lượng ISO 9001. Đây là nơi các bộ phận theo dõi, cập nhật và duy trì tính hiệu lực của các tài liệu vận hành.

## 1. Bento Grid: 8 Phòng Ban Chốt Chặn

Màn hình chính của Command Center được thiết kế dạng **Bento Grid** để theo dõi 8 phòng ban cốt lõi của công ty:
1. **Ban ISO:** Giám sát chung toàn hệ thống.
2. **P.TC-HC (Tổ chức - Hành chính):** Quy trình nhân sự, đào tạo.
3. **Phòng KHTH (Kế hoạch - Tổng hợp):** Mục tiêu SXKD, kế hoạch năm.
4. **P.TK (Thiết kế):** Bản vẽ kỹ thuật, thiết kế sản phẩm gạch.
5. **P.KT-CN (Kỹ thuật - Công nghệ):** Quy trình sản xuất, công thức phối liệu.
6. **PXSX (Phân xưởng sản xuất):** Các hướng dẫn vận hành tại xưởng.
7. **PXCĐ NL (Phòng Cơ điện - Năng lượng):** Bảo trì, bảo dưỡng thiết bị.
8. **P.KD (Kinh doanh):** Quy trình bán hàng, chăm sóc khách hàng.

### Cơ Chế Cảnh Báo Màu Sắc (Risk Indicators)
Mỗi phòng ban sẽ hiển thị một trạng thái màu sắc dựa trên tình hình tài liệu:
- **Xanh (Green):** Tài liệu ổn định, không có vấn đề quá hạn.
- **Vàng (Yellow):** Đang có tài liệu chờ phê duyệt hoặc cần chỉnh sửa.
- **Cam (Orange):** Có tài liệu sắp hết hạn soát xét (trong vòng 30 ngày).
- **Đỏ (Red):** **NGUY CƠ CAO** - Có tài liệu quá hạn soát xét hoặc bị hủy nhưng chưa thay thế.

## 2. Quản Lý Tài Liệu (Document Hub)

### Vòng Đời Tài Liệu
Tài liệu ISO trong hệ thống đi qua các trạng thái:
1. **Dự thảo (Draft):** Đang biên soạn.
2. **Chờ duyệt (Under Review):** Gửi cho lãnh đạo phê duyệt.
3. **Hiệu lực (Active):** Đang được áp dụng (luôn hiển thị nhãn "isCurrent").
4. **Hết hiệu lực/Lưu trữ (Obsolete):** Tài liệu cũ đã được thay thế.

### Phân Phối Tài Liệu
Hệ thống sử dụng **Supabase RLS (Row Level Security)** để đảm bảo:
- Mọi nhân viên có thể xem tài liệu chung của công ty.
- Chỉ nhân viên thuộc phòng ban tương ứng và lãnh đạo mới được xem các tài liệu nội bộ nhạy cảm.

## 3. "Priority Today" (Ưu Tiên Hôm Nay)

Bảng này tự động tổng hợp những đầu việc cần xử lý ngay:
- **Sắp hết hạn:** Nhắc nhở soát xét định kỳ 1-2 năm/lần theo quy chuẩn ISO.
- **Chờ duyệt:** Đôn đốc lãnh đạo phê duyệt để ban hành tài liệu mới.
- **Quá hạn:** Cảnh báo đỏ cho các vi phạm tuân thủ cần xử lý tức thì.

---

> [!IMPORTANT]
> Mục tiêu tối thượng của ISO Command Center là đảm bảo "Sổ tay Chất lượng" luôn được vận hành thực tế, không chỉ là hồ sơ giấy tờ trên kệ. Dữ liệu từ đây sẽ được đẩy ngược lại Dashboard trung tâm tại Root project để báo cáo sức khỏe doanh nghiệp.
