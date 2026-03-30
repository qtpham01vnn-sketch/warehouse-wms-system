---
description: Orchestrator Workflow - The master process for AI Product Factory v2
---

# 🤖 Orchestrator Workflow

Đây là quy trình điều phối chính của **AI Product Factory v2**, đảm bảo mọi yêu cầu đều được xử lý theo đúng trình tự và quy tắc đã đề ra trong `agent/RULES.md`.

## 🛠 Workflow Steps

### 1. Classification (Stage 0)
- **Mục tiêu**: Phân loại yêu cầu của người dùng.
- **Hành động**: Xác định xem đây là yêu cầu tạo mới, chỉnh sửa, nghiên cứu hay hỗ trợ.
- **Quy tắc**: "Always classify the request first."

### 2. Intake (Stage 1)
- **Mục tiêu**: Thu thập đầy đủ thông tin và bối cảnh.
- **Hành động**: Kiểm tra các tệp tin liên quan, đọc docs, và đặt câu hỏi làm rõ nếu cần.
- **Quy tắc**: "Always run intake before planning."

### 3. Research & Planning (Stage 2)
- **Mục tiêu**: Đề xuất giải pháp chi tiết.
- **Hành động**: Tạo `implementation_plan.md` và chờ phê duyệt.
- **Quy tắc**: "Always create a plan before building. Never build immediately without understanding."

### 4. Building & Implementation (Stage 3)
- **Mục tiêu**: Thực thi kế hoạch đã được duyệt.
- **Hành động**: Code, tạo project mới nếu cần, sử dụng templates.
- **Quy tắc**: "Always separate app / landing / prompt logic. Always create new projects for new outputs."

### 5. Verification & Delivery (Stage 4)
- **Mục tiêu**: Đảm bảo chất lượng và bàn giao.
- **Hành động**: Chạy test, kiểm tra tính khả dụng ngay lập tức.
- **Quy tắc**: "Outputs must be usable immediately."

## 🚦 Control Logic
- Nếu phát hiện thiếu thông tin ở bất kỳ giai đoạn nào, Agent phải quay lại bước **Intake**.
- Mọi thay đổi lớn trong quá trình thực hiện phải được cập nhật lại vào **Plan** và thông báo cho người dùng.
