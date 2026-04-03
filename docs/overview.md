# Tổng Quan Hệ Thống Phuong Nam - Vanguard HUD

Hệ thống quản trị doanh nghiệp **Phuong Nam** là một hệ sinh thái ứng dụng đa mô-đun, được xây dựng trên triết lý **"Vanguard HUD"** (Màn hình hiển thị tiền tuyến). Thay vì chỉ là các bảng biểu lưu trữ dữ liệu tĩnh, hệ thống được thiết kế như một trung tâm điều hành thời gian thực, giúp người dùng ra quyết định nhanh chóng thông qua dữ liệu trực quan và hành động mục tiêu.

## 1. Tầm Nhìn Chiến Lược (Vanguard Vision)

Dự án này ra đời nhằm giải quyết bài toán rời rạc trong quản lý vận hành. Tầm nhìn cốt lõi bao gồm:
- **Tính hành động (Action-oriented):** Mọi màn hình phải trả lời được câu hỏi "Tôi cần làm gì ngay bây giờ?".
- **Độ đậm đặc thông tin (High-density):** Tối ưu hóa không gian hiển thị (Bento Grid) để người quản lý nắm bắt toàn cảnh mà không cần cuộn trang quá nhiều.
- **Thẩm mỹ cao cấp (Premium Aesthetics):** Sử dụng phong cách Glassmorphism, Dark Mode và hiệu ứng chuyển động mượt mà để tạo trải nghiệm chuyên nghiệp, đẳng cấp.

## 2. Các Mô-đun Chính

Hệ thống hiện tại bao gồm 3 trụ cột chính:

### A. WorkFlow Pro (Hub Trung Tâm)
Nằm tại thư mục gốc của dự án, đây là nơi quản lý các kế hoạch chiến lược, phê duyệt tờ trình và theo dõi tiến độ tổng thể của công ty.
- **Dashboard:** Chỉ số sức khỏe doanh nghiệp, biểu đồ hoàn thành mục tiêu.
- **Phê duyệt:** Luồng duyệt tờ trình/kế hoạch tập trung.

### B. ISO Command Center (Quản Trị Tuân Thủ)
Nằm tại thư mục `app-iso/`, đây là "trái tim" của hệ thống quản lý chất lượng ISO 9001.
- **8-Department Bento Grid:** Theo dõi trạng thái tuân thủ tài liệu của 8 phòng ban chủ chốt.
- **Priority Today:** Tập trung vào các tài liệu sắp hết hạn, quá hạn hoặc đang chờ duyệt.

### C. Warehouse WMS (Vận Hành Kho)
Nằm tại thư mục `warehouse-wms/`, chuyên biệt cho quản lý kho gạch men.
- **Real-time Inventory:** Theo dõi tồn kho chính xác theo SKU và loại gạch (Loại 1, Loại 2).
- **Dual-Unit Logic:** Quản lý song song theo Mét vuông (M2) và Hộp.

## 3. Nguyên Lý Vận Hành

1. **Dữ liệu thời gian thực (Real-time):** Sử dụng **Supabase** làm nền tảng Backend-as-a-Service, đảm bảo mọi thay đổi (như nhập kho hoặc phát hành tài liệu) được cập nhật tức thì.
2. **Hệ thống Cảnh báo Sớm:** Sử dụng mã màu (Xanh/Vàng/Cam/Đỏ) để phân loại mức độ rủi ro, từ đó giúp người dùng ưu tiên xử lý các vấn đề khẩn cấp.
3. **Phân quyền dựa trên vai trò (RBAC):** Tích hợp sâu với hệ thống Auth của Supabase để đảm bảo mỗi bộ phận chỉ thấy dữ liệu liên quan đến họ.

---

> [!TIP]
> Để hiểu sâu hơn về từng mô-đun, hãy đọc tiếp các file tài liệu chi tiết:
> - [ISO Command Center Details](./iso-command-center.md)
> - [Warehouse Management Details](./warehouse-management.md)
> - [Design System Standards](./vanguard-design-system.md)
