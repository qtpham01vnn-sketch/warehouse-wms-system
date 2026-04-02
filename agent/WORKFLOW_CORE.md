WORKFLOW CORE – PHUONGNAM APP TA2

1. Intake (Tiếp nhận yêu cầu)

* Nhận yêu cầu từ người dùng
* Xác định loại app cần tạo (Kho, MMTB, ISO, khác)
* Xác định mục tiêu chính

2. Classification (Phân loại)

* Phân loại domain:

  * Kho
  * MMTB
  * ISO
  * Văn phòng
* Xác định độ phức tạp

3. Planning (Lập kế hoạch)

* Xác định cấu trúc app:

  * Module
  * Pages
  * Data model
* Xác định Skill cần dùng
* Lập sơ đồ logic

4. Skill Routing (Điều phối Skill)

* Gọi đúng Skill theo domain
* Không tự xử lý nếu đã có Skill
* Ưu tiên tái sử dụng

5. Generation (Sinh ứng dụng)

* Sinh code theo chuẩn
* Sinh UI theo chuẩn
* Sinh database (Supabase)

6. Verification (Kiểm tra)

* Kiểm tra logic
* Kiểm tra cấu trúc
* Kiểm tra đúng yêu cầu

7. Output (Xuất kết quả)

* Xuất project hoàn chỉnh
* Có README
* Có cấu trúc rõ ràng

Nguyên tắc:

* Không nhảy bước
* Không bỏ Planning
* Không tự ý sáng tạo ngoài Rules
## SCHEMA-FIRST APP BUILD WORKFLOW

1. Inspect database schema before coding.
2. Confirm required columns and constraints.
3. Confirm auth/profile model.
4. Confirm foreign keys and reference tables.
5. Apply migrations before verifying UI.
6. Verify route loading and auth flow.
7. Verify real data rendering before dashboard polish.
8. Push to GitHub after each stable phase.