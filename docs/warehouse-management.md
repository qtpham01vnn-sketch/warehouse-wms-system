# Hệ Thống Quản Lý Kho (Warehouse WMS) - Gạch Men Phuong Nam

**Warehouse WMS** (nằm trong thư mục `/warehouse-wms`) là giải pháp quản trị kho bãi chuyên sâu cho ngành gạch men, tập trung vào tính chính xác của dữ liệu tồn kho thực tế và quy trình nghiệp vụ nhập/xuất kho.

## 1. Phân Loại Tồn Kho (Inventory Logic)

Hệ thống quản lý hàng hóa dựa trên các tiêu chí đặc thù của ngành gạch men:
- **SKU (Mã sản phẩm):** Mã định danh duy nhất cho từng lô hàng (ví dụ: PN8801, PN3603).
- **Phân loại (Grade):** 
  - **Loại 1:** Hàng tiêu chuẩn cao.
  - **Loại 2:** Hàng có sai lệch nhỏ về thẩm mỹ/kích thước.
- **Quy cách đóng gói:** Hệ thống tự động tính toán số lượng dựa trên cấu hình (ví dụ: 1 hộp 80x80cm = 1.92 M2).

### Đơn Vị Kép (Dual-Unit Tracking)
Mọi báo cáo tồn kho tại Phuong Nam đều hiển thị song song:
- **Mét vuông (M2):** Đơn vị tính cơ bản để bán hàng và tính diện tích lát gạch.
- **Hộp (Boxes):** Đơn vị vận hành thực tế cho bốc xếp và lưu kho.

## 2. Quy Trình Vận Hành (Operational Flow)

### Nhập Kho (Inbound)
- Tiếp nhận hàng từ nhà máy hoặc kho vệ tinh.
- Nhãn trạng thái: **"Chờ nhập" (Pending)** -> Kiểm đếm -> **"Đã nhập" (Completed)**.
- Khi hoàn tất, số lượng tồn kho của SKU tương ứng sẽ tự động cộng dồn trong Supabase.

### Xuất Kho (Outbound)
- Lên đơn xuất hàng dựa trên đơn bán hoặc điều chuyển.
- Nhãn trạng thái: **"Chờ xuất" (Awaiting)** -> Lấy hàng -> **"Đã xuất" (Shipped)**.
- Số lượng tồn kho sẽ bị trừ đi sau khi thủ kho xác nhận đã xuất hàng thực tế.

## 3. Dashboard Kho (Warehouse Insights)

Màn hình Dashboard WMS cung cấp các chỉ số quan trọng:
- **Tổng SKUs:** Số lượng mã hàng hiện có trong kho.
- **Tổng tồn (M2):** Tổng diện tích gạch sẵn có.
- **Cảnh báo tồn thấp (Low Stock Alert):** Tự động phát hiện các SKU có số lượng dưới ngưỡng an toàn (ví dụ <50 hộp) để kịp thời đặt hàng thêm.
- **Phân tích Xu hướng (Analytics):** Biểu đồ nhập xuất 7 ngày để đánh giá tốc độ luân chuyển hàng hóa.

---

> [!CAUTION]
> **Tính Nhất Quán Dữ Liệu:** Mọi giao dịch nhập/xuất đều được log lại chi tiết trong bảng `inventory_transactions`. Tuyệt đối không can thiệp trực tiếp vào số lượng tồn kho trong bảng `inventory_levels` mà không qua quy trình giao dịch, để đảm bảo tính an toàn cho lịch sử kiểm toán (Audit Trail).
