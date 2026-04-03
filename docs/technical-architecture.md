# Kiến Trúc Kỹ Thuật & Kiến Trúc Dữ Liệu (Technical Docs)

Hệ thống Phuong Nam được xây dựng trên một cấu trúc hiện đại, tập trung vào hiệu năng, tính mở rộng và trải nghiệm người dùng tối ưu.

## 1. Công Nghệ Lõi (Core Tech Stack)

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) để tối ưu hóa tốc độ build và khởi chạy.
- **Backend-as-a-Service (BaaS):** [Supabase](https://supabase.com/) cung cấp tính năng Database (PostgreSQL), Auth (Xác thực người dùng), và Storage (Lưu trữ tài liệu).
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) đảm bảo tính an toàn dữ liệu và gợi ý code tốt.
- **Biểu tượng:** [Lucide-React](https://lucide.dev/icons/) bộ icons vector đồng nhất.
- **Biểu đồ:** [Recharts](https://recharts.org/) hiển thị phân tích dữ liệu trực quan.

## 2. Cấu Trúc Dự Án (Project Hierarchy)

Dự án này là một tập hợp các ứng dụng con (Multi-Project) hoạt động độc lập nhưng chia sẻ chung cơ sở dữ liệu:
1.  **`/` (Root):** Ứng dụng "WorkFlow Pro" - Hub trung tâm.
2.  **`/app-iso`:** Ứng dụng quản trị ISO chuyên nghiệp.
3.  **`/warehouse-wms`:** Ứng dụng quản lý kho gạch.
4.  **`/agent` & `/agent-v2`:** Các thư mục phục vụ cho quy trình phát triển và học tập của AI Agent.

## 3. Kiến Trúc Dữ Liệu (Data Architecture)

Hệ thống kết nối trực tiếp với PostgreSQL thông qua Supabase Client. Quy ước đặt tên trong cơ sở dữ liệu:
- **Tên bảng:** `snake_case` (ví dụ: `iso_documents`, `inventory_levels`).
- **Tên cột:** `snake_case` (ví dụ: `next_review_date`, `is_current`).

### Bảng Cơ Sở Dữ Liệu Quan Trọng (Supabase Tables)
- **`iso_documents`:** Lưu trữ thông tin tài liệu.
- **`iso_logs`:** Nhật ký hoạt động ISO (upload, download, view).
- **`inventory_levels`:** Số lượng tồn kho hiện tại của từng SKU.
- **`inventory_transactions`:** Lịch sử nhập/xuất kho.
- **`profiles`:** Thông tin chi tiết người dùng và phân quyền bộ phận.

---

## 4. Bài Học Kinh Nghiệm & Lưu Ý (Lessons Learned)

### Vấn Đề Case-sensitivity (Lưu ý quan trọng)
PostgreSQL mặc định coi các cột không được đặt trong dấu ngoặc kép là chữ thường. 
> [!WARNING]
> Luôn sử dụng `snake_case` (ví dụ: `next_review_date`) thay vì `camelCase` (`nextReviewDate`) khi truy vấn qua Supabase để tránh lỗi `column not found`. Các lỗi trong quá khứ chủ yếu bắt nguồn từ việc sử dụng sai chuẩn đặt tên này.

### Phân Quyền (RLS)
Sử dụng chính sách Row Level Security (RLS) để cô lập dữ liệu theo từng phòng ban. Điều này đảm bảo an ninh thông tin tuyệt đối cho người dùng cuối mà không cần xử lý quá nhiều logic ở Backend.

---

> [!TIP]
> Để phát triển ứng dụng này, hãy sử dụng lệnh `npm run dev` tại thư mục tương ứng. Mặc định:
> - Root Project: Cổng 5173
> - app-iso: Cổng 5173 (Switch)
> - warehouse-wms: Cổng 5174
