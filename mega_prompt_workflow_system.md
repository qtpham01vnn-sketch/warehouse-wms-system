# 🔥 MEGA-PROMPT: WorkFlow Pro – Hệ thống Quản trị Vận hành & Phê duyệt Luồng Công việc

> **PromptForge v2.0 Output** · Format: Mega-Prompt · Quy mô: 🔴 Complex · Platform: Antigravity

---

## ① ROLE & CONTEXT

You are an expert full-stack frontend developer specializing in **React 18, TypeScript, Vite, and Vanilla CSS**. Build a **production-ready** enterprise workflow management application with **premium dark-theme UI, glassmorphism effects, and smooth micro-animations**. Apply **SOLID principles, clean code, meaningful naming**. Use **Google Fonts (Inter for body, Outfit for headings)**. All UI must be **pixel-perfect, responsive, and WCAG 2.2 AA compliant**.

---

## ② APP OVERVIEW

Build **WorkFlow Pro** – a comprehensive Operations Management & Workflow Approval System that digitalizes the entire business workflow lifecycle:

**Company Plan → Department Plans → Approval → Execution → Progress Tracking → Monthly Reports**

The app helps **executives, department managers, and staff** to manage, approve, track, and report on work plans through a structured multi-level approval pipeline, replacing manual paper-based or email-driven processes.

**Core Value:** Single source of truth for all operational plans, approvals, and reports – with full version history, file management, and deadline tracking.

---

## ③ BUSINESS CONTEXT

```
Problem:     1. Plans scattered across emails/Excel/paper – no centralization
             2. Approval process bottlenecks – no visibility into status
             3. No systematic progress tracking or deadline reminders
Solution:    1. Centralized plan repository with upload/download
             2. Multi-level digital approval workflow with notifications
             3. Real-time dashboard with progress KPIs and reminders
UVP:         "Digitalize your entire plan-approve-execute-report cycle in one platform"
Audience:    Mid-to-large companies with 5-20 departments
Revenue:     Internal enterprise tool (B2B SaaS potential)
Metrics:     Plan approval turnaround time, on-time completion rate, report submission rate
Advantage:   Vietnamese-first UX, offline-capable plan viewing, version diff
```

---

## ④ TARGET USERS + JTBD

### Personas

| Role | Persona | Tech Level | Primary Job |
|------|---------|------------|-------------|
| **Director/CEO** | Sếp Minh, 48t | Basic | Phê duyệt KH, xem báo cáo tổng hợp |
| **Dept Manager** | Trưởng phòng Lan, 35t | Intermediate | Lập KH bộ phận, giao việc, theo dõi tiến độ |
| **Staff** | Nhân viên Hùng, 28t | Advanced | Thực hiện công việc, báo cáo tiến độ |
| **Admin** | HR Thanh, 32t | Intermediate | Quản trị hệ thống, upload KH tổng |

### JTBD

```
Functional:  "Khi đầu tháng, tôi muốn PHÂN BỔ kế hoạch công ty xuống các phòng ban
              và THEO DÕI tiến độ thực hiện để đảm bảo đúng deadline."

Emotional:   "Tôi muốn CẢM THẤY kiểm soát được và yên tâm rằng mọi thứ đang đi đúng hướng."

Social:      "Tôi muốn ĐƯỢC NHÌN NHẬN là người quản lý chuyên nghiệp, có hệ thống."

Pain Points:
  - Không biết KH phòng ban nào đã nộp, chưa nộp
  - Phê duyệt qua email rất dễ sót, không lưu vết
  - Cuối tháng phải gọi điện từng phòng xin báo cáo
  - File bị gửi sai version, không biết đâu là bản mới nhất

Success Metrics:
  - Giảm 70% thời gian phê duyệt (từ 3 ngày → < 1 ngày)
  - 100% plans có version tracking
  - Tự động nhắc deadline – 0 missed reports
```

---

## ⑤ FEATURES (MoSCoW)

### Must-Have (MVP)

| # | Feature | Acceptance Criteria |
|---|---------|-------------------|
| F1 | **Dashboard Tổng quan** | Hiển thị: tổng KH, trạng thái phê duyệt (pie chart), tiến độ thực hiện (progress bars), deadline sắp tới, hoạt động gần đây. Filter theo phòng ban, tháng, năm |
| F2 | **Import Kế hoạch Tổng** | Admin/Director upload file KH tổng công ty (PDF, Excel, Word, images). Thêm tiêu đề, mô tả, thời hạn. Tất cả phòng ban thấy được |
| F3 | **Lập KH Chi tiết Phòng ban** | Dept Manager tạo KH chi tiết dựa trên KH tổng: danh sách công việc, người thực hiện, deadline, priority, trạng thái. Lưu draft trước khi submit |
| F4 | **Luồng Phê duyệt** | Submit KH → Pending → Reviewed → Approved/Rejected (kèm comment). Rejected → chỉnh sửa → re-submit. Lưu toàn bộ approval history |
| F5 | **Theo dõi Tiến độ** | Mỗi task/KH có status: Not Started, In Progress, Completed, Overdue. Progress bar phòng ban. Highlight quá hạn bằng màu đỏ |
| F6 | **Nhắc nhở Deadline** | Notification bell icon. Badges cho items cần attention. Danh sách nhắc nhở: sắp hết hạn (3 ngày), quá hạn, chờ phê duyệt |
| F7 | **Báo cáo Tổng hợp** | Cuối tháng: phòng ban tạo báo cáo, đính kèm file, submit. Director xem tổng hợp tất cả báo cáo. Export PDF/Excel |
| F8 | **Upload/Download Tài liệu** | Mỗi KH/báo cáo đính kèm nhiều files. Preview inline (PDF, images). Download individual hoặc bulk. Drag-drop upload |
| F9 | **Version Tracking** | Mỗi lần chỉnh sửa KH/tài liệu = version mới (v1.0, v1.1, v2.0...). Bảng so sánh versions. Restore version cũ. Badge "New Version" |
| F10 | **Quản lý Phòng ban & Users** | CRUD phòng ban, thêm/xóa members. Phân quyền theo role |

### Should-Have

| # | Feature | Description |
|---|---------|-------------|
| S1 | **Kanban Board** | Drag-drop tasks giữa các cột trạng thái |
| S2 | **Comments & Mentions** | Comment trên KH/task, @mention đồng nghiệp |
| S3 | **Activity Log** | Timeline mọi hoạt động trên mỗi KH/task |
| S4 | **Filters & Search** | Lọc theo phòng ban, trạng thái, priority, deadline. Full-text search |
| S5 | **Calendar View** | Xem deadlines trên lịch tháng |

### Could-Have

| # | Feature | Description |
|---|---------|-------------|
| C1 | **Email Notifications** | Gửi email khi có KH mới cần phê duyệt |
| C2 | **Gantt Chart** | Timeline view cho KH phòng ban |
| C3 | **Template KH** | Lưu KH mẫu để tái sử dụng |
| C4 | **Dark/Light Toggle** | Switch theme (default: Dark) |

### Won't-Have (v1)

- Chat/messaging real-time
- Mobile native app
- AI-powered suggestions
- Integration với ERP/HRM bên ngoài

---

## ⑥ TECH STACK

```
Frontend:    React 18 + TypeScript + Vite
Styling:     Vanilla CSS (CSS Variables, Grid, Flexbox)
Fonts:       Google Fonts – Inter (body), Outfit (headings)
Icons:       Lucide React
Charts:      Recharts (pie, bar, line, progress)
Tables:      Custom DataTable component with sort/filter/pagination
File Upload: Native File API + drag-drop zone
Date:        date-fns
State:       React Context + useReducer (shared state)
Routing:     React Router v6
Export:       Client-side PDF/Excel generation
Storage:     localStorage/IndexedDB (frontend-only demo)
Build:       Vite (dev: npm run dev, prod: npm run build)
```

> [!IMPORTANT]
> This is a **frontend-only** application with mock data and localStorage persistence. All data operations simulate a real backend. Structure code so backend integration is straightforward later.

---

## ⑦ UI/UX DESIGN

### Design System

```
Theme:       Dark (default) – Deep navy/charcoal base
Style:       Glassmorphism + subtle gradients + micro-animations
Primary:     #6366F1 (Indigo 500) – actions, buttons, active states
Secondary:   #8B5CF6 (Violet 500) – accents, highlights
Surface:     #1E1E2E (cards, panels) with backdrop-blur
Background:  #0F0F1A (main bg) → #161625 (sidebar)
Border:      rgba(255, 255, 255, 0.08)
Text:        #F1F5F9 (primary), #94A3B8 (secondary), #64748B (muted)
Success:     #10B981    Warning: #F59E0B    Error: #EF4444    Info: #3B82F6

Fonts:       Outfit 600/700 (headings), Inter 400/500/600 (body)
Icons:       Lucide – 20px default, 24px nav, 16px inline
Radius:      16px cards, 12px modals, 8px buttons/inputs, 24px pills
Shadows:     0 4px 24px rgba(0,0,0,0.3) (cards), 0 8px 32px rgba(99,102,241,0.15) (glow)
Spacing:     8px grid system (8, 16, 24, 32, 48, 64)
Transitions: 200ms ease (default), 300ms ease (page), cubic-bezier(0.175,0.885,0.32,1.275) (spring)
```

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Top Bar: Logo + Search + Notifications 🔔 + User Avatar │
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│ Sidebar  │              Main Content Area                │
│ 260px    │                                               │
│          │  ┌─────────────────────────────────────────┐  │
│ • Dashboard│  │  Page Header + Breadcrumbs              │  │
│ • KH Tổng │  ├─────────────────────────────────────────┤  │
│ • Phòng ban│  │                                         │  │
│ • Phê duyệt│ │  Content (tables, cards, forms...)      │  │
│ • Tiến độ  │ │                                         │  │
│ • Báo cáo  │ │                                         │  │
│ • Tài liệu │ │                                         │  │
│ • Cài đặt  │ └─────────────────────────────────────────┘  │
│          │                                               │
├──────────┴───────────────────────────────────────────────┤
│  Status Bar (optional): Connection status, last sync     │
└──────────────────────────────────────────────────────────┘
```

### Key UI Patterns

```
Cards:       Glassmorphism – rgba(30,30,46,0.8) + backdrop-blur(12px) + border 1px rgba(255,255,255,0.08)
Buttons:     Primary: gradient(135deg, #6366F1, #8B5CF6) + hover glow
             Secondary: transparent + border + hover bg
             Danger: #EF4444 + confirm dialog
Status Badges:
  Draft:      bg rgba(148,163,184,0.15) text #94A3B8
  Pending:    bg rgba(245,158,11,0.15) text #F59E0B
  Approved:   bg rgba(16,185,129,0.15) text #10B981
  Rejected:   bg rgba(239,68,68,0.15) text #EF4444
  In Progress: bg rgba(99,102,241,0.15) text #6366F1
  Completed:  bg rgba(16,185,129,0.15) text #10B981
  Overdue:    bg rgba(239,68,68,0.15) text #EF4444 + pulse animation
Tables:      Striped rows (subtle), hover highlight, sticky header
Modals:      Centered, backdrop blur, slide-up animation
Toasts:      Top-right, 4 types (success/error/warning/info), auto-dismiss 5s
```

### Design References

```
Inspired by: Linear.app (clean, fast, premium dark UI)
             Notion (content structure, breadcrumbs)
             Monday.com (workflow boards, status tracking)
             Asana (timeline, progress tracking)
```

---

## ⑧ CONTENT & UX WRITING

```
Voice:        Professional, supportive, efficient – Vietnamese language
Personality:  Đáng tin cậy, rõ ràng, hỗ trợ

Buttons:      "Tạo kế hoạch" (not "Thêm mới"), "Gửi phê duyệt" (not "Submit")
              "Phê duyệt" / "Từ chối" / "Yêu cầu chỉnh sửa"
Empty States: Illustration + "Chưa có kế hoạch nào" + "Tạo kế hoạch đầu tiên" CTA
Errors:       "Không thể tải dữ liệu. Vui lòng thử lại." + Retry button
Loading:      Skeleton screens (not spinners) for lists/tables
              "Đang tải kế hoạch..." for specific operations
Confirmations: "Bạn có chắc muốn từ chối kế hoạch này?" + reason textarea
Tooltips:     On status badges, action buttons, deadline indicators
Breadcrumbs:  Dashboard > Phòng Kinh doanh > KH Tháng 3/2026
Time Format:  "3 phút trước", "Hôm qua lúc 14:30", "15/03/2026"
Numbers:      1.234.567 (Vietnamese format)

NO Lorem Ipsum – use realistic Vietnamese business content:
  Department names: Phòng Kinh doanh, Phòng Marketing, Phòng Nhân sự, Phòng Kỹ thuật
  Plan titles: "KH Kinh doanh Q1/2026", "Chiến lược Marketing Digital T3/2026"
  Task examples: "Liên hệ 50 khách hàng tiềm năng", "Hoàn thành báo cáo doanh thu"
  Person names: Nguyễn Văn Minh, Trần Thị Lan, Lê Hoàng Hùng
```

---

## ⑨ PAGE/SCREEN STRUCTURE

### P1: Dashboard (/)

```
Layout: 4-column KPI cards + 2-column chart area + activity feed
Organisms:
  - KPI Row: 4 stat cards (Tổng KH, Chờ duyệt, Đang thực hiện, Hoàn thành)
    Each card: icon + number + trend arrow + sparkline
  - Charts Row:
    Left: Donut chart – Trạng thái phê duyệt (Approved/Pending/Rejected)
    Right: Bar chart – Tiến độ theo phòng ban (% completion)
  - Deadline Alerts: Table of upcoming/overdue items, sorted by urgency
  - Recent Activity: Timeline feed (ai làm gì, lúc nào)
  - Quick Actions: "Tạo KH mới", "Xem chờ duyệt", "Báo cáo tháng"
Filters: Phòng ban dropdown, Tháng/Năm picker
```

### P2: Kế hoạch Tổng (/plans)

```
Layout: Header + filter bar + data table
Features:
  - Table: Tiêu đề | Phòng ban | Ngày tạo | Deadline | Trạng thái | Files | Actions
  - Upload modal: Drag-drop zone + title + description + deadline + department tags
  - Detail view: Slide-over panel or full page
  - Filter: Status, Department, Date range
  - Bulk actions: Download selected, Delete
```

### P3: Kế hoạch Phòng ban (/department-plans)

```
Layout: Tabs per department + plan detail + task list
Features:
  - Create plan form: Title, linked to 'KH Tổng', task breakdown
  - Task table: Tên | Người thực hiện | Deadline | Priority | Status | Progress
  - Inline editing for status/progress
  - Submit for approval button (changes status to Pending)
  - Version history sidebar
```

### P4: Phê duyệt (/approvals)

```
Layout: Approval queue + detail panel
Features:
  - Queue list: Filtered by Pending, shows department, submitted date, submitter
  - Detail panel: Full plan view + attached files + previous versions
  - Action buttons: Phê duyệt ✅ | Từ chối ❌ | Yêu cầu chỉnh sửa 📝
  - Comment/reason textarea (required for reject)
  - Approval history timeline
  - Badge count on sidebar nav item
```

### P5: Theo dõi Tiến độ (/progress)

```
Layout: Department cards with progress bars + drill-down table
Features:
  - Overview: Each department = card with overall % + task breakdown
  - Progress bar colors: Green (on track), Yellow (at risk), Red (overdue)
  - Drill-down: Click department → see all tasks with individual progress
  - Reminder column: Auto-calculated (Đúng hạn | Sắp hết hạn | Quá hạn)
  - Kanban toggle: Switch between table and kanban view
```

### P6: Báo cáo (/reports)

```
Layout: Report submission form + report archive table
Features:
  - Create report: Select month, department, write summary, attach files
  - Report table: Tháng | Phòng ban | Ngày nộp | Trạng thái | Files | Actions
  - Director view: Aggregated dashboard of all department reports
  - Export: PDF summary report, Excel data export
  - Status: Chưa nộp | Đã nộp | Đã xem
```

### P7: Quản lý Tài liệu (/documents)

```
Layout: File browser with folder structure
Features:
  - Tree view: Organized by Department > Plan/Report > Files
  - Upload: Drag-drop, multi-file, progress indicator
  - Preview: Inline PDF viewer, image gallery
  - Download: Individual + bulk (zip)
  - Version indicator: Badge "v2.1" on each file, click to see history
  - Search: By filename, department, date
```

### P8: Cài đặt (/settings)

```
Layout: Tabs – Phòng ban | Nhân sự | Hệ thống
Features:
  - Department CRUD: Name, manager, members
  - User management: Name, email, role, department, status
  - System: Reminder intervals, approval workflow config
```

### Shared Components

```
- Sidebar Navigation (collapsible, active state, badge counts)
- Top Bar (search, notification bell with dropdown, user menu)
- Breadcrumbs (auto-generated from route)
- DataTable (sortable, filterable, paginated, selectable)
- FileUpload (drag-drop zone, progress, preview)
- StatusBadge (color-coded, with tooltip)
- ApprovalTimeline (vertical timeline of approval events)
- VersionHistory (table with version number, date, author, actions)
- ConfirmDialog (for destructive actions)
- EmptyState (illustration + message + CTA)
- SkeletonLoader (for loading states)
- Toast notifications
```

---

## ⑩ DATA MODEL + DOMAIN

### Bounded Contexts

```
Plans:       CompanyPlan, DepartmentPlan, PlanTask
Approvals:   ApprovalRequest, ApprovalAction, ApprovalComment
Documents:   Document, DocumentVersion, FileAttachment
Reports:     MonthlyReport, ReportAttachment
Users:       User, Department, Role
Notifications: Notification, Reminder
```

### Core Entities

```typescript
// Department
{ id, name, managerId, memberIds[], createdAt }

// User
{ id, name, email, avatar, role: 'director'|'manager'|'staff'|'admin', departmentId }

// CompanyPlan (KH Tổng)
{ id, title, description, attachments[], deadline, createdBy, createdAt, status: 'active'|'archived' }

// DepartmentPlan (KH Phòng ban)
{ id, companyPlanId, departmentId, title, description, tasks[], 
  status: 'draft'|'pending'|'approved'|'rejected'|'in_progress'|'completed',
  versions: PlanVersion[], currentVersion, submittedAt, approvedAt, approvedBy,
  rejectionReason, attachments[], createdBy, createdAt, updatedAt }

// PlanTask (Công việc trong KH)
{ id, planId, title, assigneeId, deadline, priority: 'low'|'medium'|'high'|'urgent',
  status: 'not_started'|'in_progress'|'completed'|'overdue',
  progress: 0-100, notes, attachments[], createdAt, updatedAt }

// PlanVersion
{ id, planId, versionNumber: 'v1.0', changes, snapshot, createdBy, createdAt }

// ApprovalAction
{ id, planId, action: 'submit'|'approve'|'reject'|'request_revision',
  comment, performedBy, performedAt }

// MonthlyReport
{ id, departmentId, month, year, summary, attachments[],
  status: 'not_submitted'|'submitted'|'reviewed',
  submittedBy, submittedAt, reviewedBy, reviewedAt }

// Document
{ id, name, type, size, url, planId?, reportId?, departmentId,
  versions: DocVersion[], currentVersion, uploadedBy, uploadedAt }

// Notification
{ id, userId, type, title, message, link, isRead, createdAt }
```

---

## ⑪ API & INTEGRATIONS

```
Frontend-only: All data via localStorage/IndexedDB
Service Layer: Abstract data access behind service modules
  - planService.ts (CRUD company plans, department plans, tasks)
  - approvalService.ts (submit, approve, reject, history)
  - reportService.ts (CRUD reports, generate summary)
  - documentService.ts (upload, download, version management)
  - userService.ts (CRUD users, departments)
  - notificationService.ts (CRUD notifications, mark read)
  - dashboardService.ts (aggregate stats, charts data)

Structure services with async/await to simulate API calls
→ Easy to swap localStorage for real API endpoints later
```

---

## ⑫ AUTH & PERMISSIONS

```
Auth:     Mock login (select user from dropdown) – no real auth
Roles:    Director | Manager | Staff | Admin

Permissions Matrix:
                    | Director | Manager | Staff | Admin |
  View Dashboard    |    ✅    |   ✅   |  ✅   |  ✅  |
  Upload KH Tổng   |    ✅    |   ❌   |  ❌   |  ✅  |
  Create Dept Plan  |    ❌    |   ✅   |  ❌   |  ❌  |
  Submit for Approve|    ❌    |   ✅   |  ❌   |  ❌  |
  Approve/Reject    |    ✅    |   ❌   |  ❌   |  ❌  |
  Update Task Status|    ❌    |   ✅   |  ✅   |  ❌  |
  Submit Report     |    ❌    |   ✅   |  ❌   |  ❌  |
  View All Reports  |    ✅    |  Own   | Own   |  ✅  |
  Upload Documents  |    ✅    |   ✅   |  ✅   |  ✅  |
  Manage Users/Depts|    ❌    |   ❌   |  ❌   |  ✅  |

Protected Routes: All pages except login
Public Routes: /login only
```

---

## ⑬ ACCESSIBILITY (WCAG 2.2 AA)

```
Semantic HTML:       <nav>, <main>, <section>, <article>, <aside>, <header>, <footer>
Keyboard Navigation: Tab order logical, Enter/Space activate, Escape close modals
Focus Management:    Visible focus rings (2px solid #6366F1), focus trap in modals
ARIA:                aria-label on icon buttons, aria-live for toasts/notifications,
                     aria-expanded on dropdowns, role="status" for progress bars
Contrast:            All text ≥ 4.5:1 (AA), large text ≥ 3:1
Skip Navigation:     "Skip to main content" link
Heading Hierarchy:   Single H1 per page, logical H2-H4
Form Labels:         All inputs have visible labels, required field indicators
Alt Text:            All images, icons have aria-label
Reduced Motion:      @media (prefers-reduced-motion: reduce) { disable animations }
Touch Targets:       Minimum 44x44px for mobile
Screen Reader:       Status changes announced via aria-live regions
```

---

## ⑭ AI FEATURES

```
Not included in v1. Code structure supports future AI integration:
  - Smart deadline suggestions
  - Auto-generate report summaries
  - Plan quality scoring
  - Anomaly detection in progress data
```

---

## ⑮ CONSTRAINTS

```
MUST:
  ✅ Production-ready quality – no basic/prototype UI
  ✅ All pages fully functional with realistic Vietnamese mock data
  ✅ Responsive: 375px → 1440px
  ✅ Error states, loading states (skeletons), empty states on EVERY page
  ✅ Dark theme with glassmorphism as default
  ✅ Smooth micro-animations (hover, transitions, page changes)
  ✅ Version tracking with visual diff indicators
  ✅ File drag-drop upload with progress indicators
  ✅ Proper notification system with badge counts
  ✅ All data persisted to localStorage

MUST NOT:
  ❌ No placeholder text / Lorem ipsum
  ❌ No basic/plain design – premium aesthetic required
  ❌ No dummy buttons that don't work
  ❌ No missing states (loading, error, empty)
  ❌ No hardcoded data – use service layer
  ❌ No inline styles – use CSS variables and classes
```

---

## ⑯ EXAMPLES & REFERENCES

### Sample Data to Pre-populate

```
Company Plans:
  - "Kế hoạch Kinh doanh Q1/2026" – deadline 31/03/2026
  - "Chiến lược Phát triển Sản phẩm 2026" – deadline 30/06/2026
  - "Kế hoạch Đào tạo Nhân sự Q2/2026" – deadline 30/06/2026

Departments:
  - Phòng Kinh doanh (8 người) – Trưởng phòng: Trần Thị Lan
  - Phòng Marketing (5 người) – Trưởng phòng: Nguyễn Hoàng Nam
  - Phòng Nhân sự (4 người) – Trưởng phòng: Lê Thị Mai
  - Phòng Kỹ thuật (10 người) – Trưởng phòng: Phạm Đức Anh
  - Phòng Tài chính (4 người) – Trưởng phòng: Vũ Minh Tuấn

Tasks examples:
  - "Liên hệ 50 khách hàng tiềm năng" – Priority: High – 65% done
  - "Thiết kế campaign Facebook Q1" – Priority: Medium – Completed
  - "Tuyển dụng 3 dev senior" – Priority: Urgent – 30% done – Overdue
  - "Hoàn thành audit tài chính" – Priority: High – Not started

Approval History examples:
  - "KH Marketing T3" – Submitted by Nguyễn Hoàng Nam → Approved by Director
  - "KH Kỹ thuật T3" – Submitted → Rejected (lý do: thiếu budget detail) → Revised → Approved
```

### Visual References

```
Dashboard:    Similar to Linear dashboard – clean stat cards + charts
Tables:       Similar to Notion databases – sortable, filterable, inline edit
Approval:     Similar to GitHub PR reviews – timeline + actions
File Manager: Similar to Google Drive – grid/list toggle, previews
```

---

## 📋 PROMPT CHAIN SEQUENCE (Recommended Build Order)

> For best results, implement in this sequence. Each prompt builds on the previous.

### Prompt 1: Foundation

```
"Set up the Vite + React + TypeScript project.
 Create the design system (CSS variables, global styles, animations).
 Build the layout: Sidebar navigation + Top bar + Main content area.
 Implement React Router with all 8 routes.
 Create shared components: StatusBadge, DataTable skeleton, EmptyState, SkeletonLoader, Toast.
 Use mock user login (dropdown to switch roles)."
```

### Prompt 2: Dashboard + Company Plans

```
"In the existing codebase, implement:
 1. Dashboard page with 4 KPI cards, donut chart (approval status), bar chart (dept progress),
    deadline alerts table, recent activity feed, quick actions.
 2. Company Plans page with data table, upload modal (drag-drop), detail panel.
 Pre-populate with realistic Vietnamese mock data."
```

### Prompt 3: Department Plans + Approval Workflow

```
"In the existing codebase, implement:
 1. Department Plans page: create plan form linked to company plan, task breakdown table,
    inline status editing, submit for approval, version history.
 2. Approval page: pending queue, detail panel with file preview,
    approve/reject/revise actions with comments, approval timeline.
 Wire up the approval state machine: draft → pending → approved/rejected → revision → re-submit."
```

### Prompt 4: Progress + Reports + Documents

```
"In the existing codebase, implement:
 1. Progress tracking: department cards with progress bars, drill-down task view,
    status color coding (green/yellow/red), reminder indicators.
 2. Monthly Reports: creation form, archive table, director aggregate view, export.
 3. Document Manager: tree view, upload with progress, inline preview, version badges.
 4. Notification system: bell icon with dropdown, badge counts, mark as read."
```

### Prompt 5: Polish & Settings

```
"In the existing codebase:
 1. Settings page: Department CRUD, User management, System config.
 2. Polish: micro-animations on all interactions, page transitions,
    skeleton loading on every page, error boundaries, empty states with illustrations.
 3. Responsive: test and fix all pages for 375px-1440px.
 4. Accessibility: keyboard nav, focus management, ARIA labels, skip nav.
 5. Final data: ensure all mock data is realistic and comprehensive."
```

---

> **Quality Gate:** Tất cả tiêu chí Quality Rubric ≥ 4/5 ✅
> **Bloom's Check:** L1-L6 all covered ✅
> **Platform Optimized:** Antigravity (full mega-prompt + technical detail) ✅
