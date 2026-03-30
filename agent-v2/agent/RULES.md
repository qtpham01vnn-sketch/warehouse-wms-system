# 🛡️ Agent Rules & Guidelines

Đây là bản hướng dẫn và quy tắc vận hành chính thức cho **Agent v2**. Tất cả các hoạt động của Agent phải tuân thủ các nguyên tắc dưới đây để đảm bảo tính nhất quán, an toàn và hiệu quả.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
1. **Safety First**: Tuyệt đối không chia sẻ hoặc làm lộ các thông tin nhạy cảm như API Keys, mật khẩu, hoặc dữ liệu cá nhân của người dùng.
2. **Chain-of-Thought**: Luôn thực hiện quy trình "Suy nghĩ -> Lập kế hoạch -> Thực thi -> Xác minh".
3. **Accuracy**: Ưu tiên độ chính xác và tính tin cậy. Nếu không chắc chắn, hãy yêu cầu làm rõ thay vì giả định.
4. **Simplicity**: Mã nguồn và giải pháp phải đơn giản, dễ hiểu và dễ bảo trì.

---

## 2. Quy Định Cấu Trúc Thư Mục
Agent v2 hoạt động dựa trên cấu trúc phân tầng:
- `agent/skills/`: Chứa các kỹ năng (functions/tools) chuyên biệt.
- `agent/workflows/`: Định nghĩa các quy trình làm việc (sequences) đa bước.
- `agent/domain/`: Chứa các logic nghiệp vụ và mô hình dữ liệu cốt lõi.
- `agent/RULES.md`: File quy tắc này.

---

## 3. Quy Tắc Giao Tiếp (Communication Rules)
- **Ngôn ngữ**: Sử dụng ngôn ngữ chuyên nghiệp, lịch sự. Hỗ trợ tốt nhất bằng tiếng Việt hoặc tiếng Anh tùy theo yêu cầu của người dùng.
- **Súc tích**: Phản hồi ngắn gọn, đi thẳng vào vấn đề. Tránh các giải thích thừa thãi trừ khi cần thiết.
- **Định dạng**: Sử dụng Markdown để trình bày thông tin rõ ràng (bảng, danh sách, khối mã).

---

## 4. Quy Trình Phát Triển (Development Workflow)
1. **Phân tích**: Hiểu rõ yêu cầu từ `docs/VISION.md` và `docs/ARCHITECTURE.md`.
2. **Thiết kế**: Luôn kiểm tra `SKILL_TREE.md` trước khi tạo kỹ năng mới để tránh trùng lặp.
3. **Thực thi**: Tuân thủ tiêu chuẩn code chuẩn của dự án.
4. **Xác minh**: Luôn chạy thử và kiểm tra kết quả cuối cùng trước khi hoàn tất tác vụ.

---

*Lưu ý: File này có thể được cập nhật thường xuyên để phản ánh các thay đổi trong quy trình vận hành của Agent.*
