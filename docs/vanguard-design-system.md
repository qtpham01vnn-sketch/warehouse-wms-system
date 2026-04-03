# Hệ Thống Thiết Kế Vanguard HUD - Trải Nghiệm Điều Hành Tương Lai

Bộ nhận diện và giao diện người dùng của Phuong Nam được thiết kế dựa trên ngôn ngữ **Vanguard HUD** (Màn hình điều khiển tiền tuyến), lấy cảm hứng từ các trạm chỉ huy quân sự và hàng không, kết hợp với phong cách Glassmorphism hiện đại.

## 1. Bản Sắc Thị Giác (Visual Identity)

### Bảng Màu (Color Palette)
- **Màu Chủ Đạo (Primary):** `#6366F1` (Indigo Neon) - Đại diện cho công nghệ và tính hiện đại.
- **Màu Bổ Trợ (Secondary):** `#8B5CF6` (Violet) - Tạo chiều sâu và sự cao cấp.
- **Màu Nền Chính (Background Core):** `#0F0F1A` (Abyssal Blue) - Màu xanh thẳm của bóng đêm để làm nổi bật các thành phần phát sáng (Glow).
- **Màu Trạng Thái (Semantic):**
  - **Duyệt (Success):** `#10B981` (Emerald) - Màu xanh ngọc.
  - **Cảnh báo (Warning):** `#F59E0B` (Amber) - Màu hổ phách.
  - **Khẩn cấp (Danger):** `#EF4444` (Rose Red) - Màu đỏ anh đào.

### Kiểu Chữ (Typography)
- **Heading:** `Outfit` (sans-serif) - Mang nét bo tròn, hiện đại, dễ đọc ở kích thước lớn.
- **Body:** `Inter` (sans-serif) - Tiêu chuẩn cho giao diện ứng dụng, rõ ràng và trung tính.

## 2. Các Thành Phần Đặc Trưng (Aesthetic Elements)

### Hiệu Ứng Kính (Glassmorphism)
Lớp nền của ứng dụng không sử dụng màu bệt (Solid), thay vào đó là:
- **Nền (Background):** Độ đục khoảng 80% (`rgba(30,30,46,0.8)`).
- **Làm mờ (Blur):** `backdrop-filter: blur(12px)`.
- **Viền (Border):** Viền mỏng 1px với độ đục cực thấp (`rgba(255,255,255,0.08)`) để tạo cảm giác tinh tế.

### Bento Grids (Lưới Bento)
Cấu trúc bố cục lấy cảm hứng từ hộp cơm Bento Nhật Bản:
- Phân chia các ô chức năng với các kích thước khác nhau (spans).
- Mỗi ô (tile/card) độc lập về chức năng nhưng đồng nhất về thẩm mỹ.
- Giúp hiển thị lượng thông tin lớn mà không làm rối mắt.

### Glow Effects (Hiệu Ứng Phát Sáng)
Các nút bấm và ô cảnh báo quan trọng được áp dụng **Box Shadow Glow** để thu hút sự chú ý.
- Ví dụ: `shadow: 0 0 20px rgba(99,102,241,0.2)`.

## 3. Trải Nghiệm Người Dùng (UX Principles)

1. **Information Density (Mật độ thông tin):** Ưu tiên hiển thị dữ liệu quan trọng ngay màn hình đầu tiên (Above the fold). Hạn chế diện tích thừa (Whitespace quá rộng).
2. **Micro-animations:** Các hiệu ứng Hover (như `hover-lift`) và Fade-In khi chuyển trang được sử dụng để làm ứng dụng cảm thấy sinh động hơn.
3. **Action-Link:** Mọi chỉ số (KPI) đều phải đi kèm với một lối tắt (Action) để xử lý ngay vấn đề đó.

---

> [!NOTE]
> Mọi thay đổi về CSS sau này cần tuân thủ các biến CSS (`--color-*`) đã được định nghĩa trong file `src/index.css` để đảm bảo tính nhất quán của hệ sinh thái Vanguard.
