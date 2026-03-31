# WorkFlow Pro: app-iso – Hệ thống Quản trị ISO

Ứng dụng chuyên biệt quản lý hệ thống tài liệu và chứng nhận ISO dành cho doanh nghiệp.

## 🚀 Tính năng chính
- **Quản lý Tài liệu**: QT (Quy trình), HS (Hồ sơ), BM (Biểu mẫu), HDCV (Hướng dẫn công việc).
- **Kiểm soát Phiên bản**: Tự động cập nhật bản hiện hành, lưu trữ lịch sử phiên bản.
- **Theo dõi Chứng nhận**: Giám sát thời hạn ISO 9001, 13006, 14411, 14001.
- **Trung tâm Cảnh báo**:
    - Chứng nhận sắp hết hạn (<60 ngày: Cảnh báo, <30 ngày: Nguy hiểm).
    - Tài liệu sắp đến ngày rà soát hoặc quá hạn.
- **Lưu trữ Đám mây**: Tích hợp Supabase Storage cho file PDF/Docs.

## 🛠️ Công nghệ sử dụng
- **Frontend**: React 18 + TypeScript + Vite.
- **Giao diện**: Vanilla CSS (PhuongNam Luxe Design System).
- **Backend**: Supabase (Database + Storage).

## 📁 Cấu trúc thư mục
- `supabase/`: Schema và cấu hình DB.
- `src/pages/`: Dashboard, Tài liệu, Chứng nhận, Cảnh báo.
- `src/services/`: Logic xử lý dữ liệu và Storage.
- `src/types/`: Khai báo kiểu TypeScript.

## ⚙️ Hướng dẫn cài đặt
1. Clone dự án.
2. Chạy `npm install`.
3. Tạo file `.env` từ `.env.example` và điền thông tin Supabase.
4. Chạy `npm run dev`.
