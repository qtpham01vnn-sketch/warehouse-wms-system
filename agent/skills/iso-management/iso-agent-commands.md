# ISO AGENT COMMANDS

## 1. Create ISO App
Use when the user wants a full ISO management application.

Example command:
Tạo cho tôi app ISO quản lý tài liệu cho công ty tôi

Expected behavior:
- Build a standalone app
- Use ISO Management Skill
- Include document hub, certificates, alerts, version history
- Use Supabase schema and storage
- Follow ISO UI modules

---

## 2. Create ISO Dashboard
Use when the user wants a dashboard only.

Example command:
Tạo cho tôi dashboard ISO theo dõi tài liệu, chứng nhận và cảnh báo

Expected behavior:
- Generate KPI overview
- Show document stats
- Show certificate expiry
- Show alert center
- Keep ISO visual structure

---

## 3. Create ISO Alert System
Use when the user wants alert logic or reminder system.

Example command:
Tạo cho tôi hệ thống cảnh báo ISO cho chứng nhận sắp hết hạn và tài liệu sắp rà soát

Expected behavior:
- Use ISO alert rules
- Apply warning / danger / expired thresholds
- Output dashboard alerts + alert center

---

## 4. Create ISO Audit Checklist
Use when the user wants internal audit tools.

Example command:
Tạo cho tôi checklist audit nội bộ ISO 9001

Expected behavior:
- Generate checklist structure
- Group by clause / process / department
- Output reusable format

---

## 5. Create ISO Landing Page
Use when the user wants a landing page for ISO services.

Example command:
Tạo cho tôi landing page dịch vụ tư vấn ISO 9001

Expected behavior:
- Generate standalone landing
- Include hero, benefits, services, CTA
- Use professional enterprise tone

---

## 6. Create ISO Full Package
Use when the user wants app + landing + prompt.

Example command:
Tạo cho tôi full package ISO gồm app quản lý tài liệu, landing page và prompt vận hành

Expected behavior:
- Generate app
- Generate landing
- Generate prompt
- Generate README and deployment notes

---

## Command Rules
- Always classify the request first
- Always use ISO Management Skill
- Always use iso-patterns, iso-document-types, iso-alert-rules, iso-version-rules, iso-ui-modules
- Do not skip planning
- Do not mix certificates into the document table
- Keep documents and certificates as separate modules