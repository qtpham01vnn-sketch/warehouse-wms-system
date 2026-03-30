# Domain: Equipment Management

Định nghĩa nghiệp vụ và cấu trúc dữ liệu cốt lõi cho hệ thống quản lý thiết bị.

## 🏗 Entities

### 1. Equipment (Thiết bị)
- `id`: UUID (Primary Key)
- `name`: String (Tên thiết bị)
- `serial_number`: String (Số sê-ri, Unique)
- `category_id`: UUID (Foreign Key -> Category)
- `status`: Enum (Available, In Use, Maintenance, Retired)
- `location`: String (Vị trí hiện tại)
- `purchase_date`: Date (Ngày mua)
- `last_maintained`: Date (Ngày bảo trì gần nhất)

### 2. Category (Danh mục)
- `id`: UUID (PK)
- `name`: String (IT, Industrial, Office, Tool, etc.)
- `description`: Text

### 3. MaintenanceLog (Nhật ký bảo trì)
- `id`: UUID (PK)
- `equipment_id`: UUID (FK)
- `action_date`: Date
- `technician`: String
- `description`: Text
- `cost`: Decimal

## 🛡 Business Rules

1. **Unique Serial Number**: Mỗi thiết bị phải có một số sê-ri duy nhất để tránh trùng lặp.
2. **Status Transition**: 
   - Thiết bị chỉ có thể chuyển sang trạng thái "In Use" nếu đang ở trạng thái "Available".
   - Khi thiết bị ở trạng thái "Maintenance", nó không thể được chuyển sang "In Use".
3. **Maintenance Alert**: Hệ thống nên cảnh báo nếu thiết bị đã quá 6 tháng chưa được bảo trì (dựa trên `last_maintained`).

## 📊 Data Mapping
- **Supabase Table**: `equipments`, `categories`, `maintenance_logs`.
- **Primary Domain Logic**: `agent/domain/equipment-management.md`.
