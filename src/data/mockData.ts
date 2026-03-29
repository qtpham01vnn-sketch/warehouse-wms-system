import type { Department, User, CompanyPlan, DepartmentPlan, ApprovalAction, Notification } from '../types';
import { addDays, subDays } from 'date-fns';

const now = new Date();

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept_1', name: 'Phòng Kinh doanh', managerId: 'user_2', memberIds: ['user_2', 'user_6'], createdAt: now.toISOString() },
  { id: 'dept_2', name: 'Phòng Marketing', managerId: 'user_3', memberIds: ['user_3', 'user_7'], createdAt: now.toISOString() },
  { id: 'dept_3', name: 'Phòng Nhân sự', managerId: 'user_4', memberIds: ['user_4', 'user_8'], createdAt: now.toISOString() },
  { id: 'dept_4', name: 'Phòng Kỹ thuật', managerId: 'user_5', memberIds: ['user_5'], createdAt: now.toISOString() },
];

export const MOCK_USERS: User[] = [
  { id: 'user_1', name: 'Sếp Minh', email: 'minh.ceo@company.com', avatar: 'https://i.pravatar.cc/150?u=user_1', role: 'director', departmentId: '' },
  
  { id: 'user_2', name: 'Trần Thị Lan', email: 'lan.tran@company.com', avatar: 'https://i.pravatar.cc/150?u=user_2', role: 'manager', departmentId: 'dept_1' },
  { id: 'user_3', name: 'Nguyễn Hoàng Nam', email: 'nam.nguyen@company.com', avatar: 'https://i.pravatar.cc/150?u=user_3', role: 'manager', departmentId: 'dept_2' },
  { id: 'user_4', name: 'Lê Thị Mai', email: 'mai.le@company.com', avatar: 'https://i.pravatar.cc/150?u=user_4', role: 'manager', departmentId: 'dept_3' },
  { id: 'user_5', name: 'Phạm Đức Anh', email: 'anh.pham@company.com', avatar: 'https://i.pravatar.cc/150?u=user_5', role: 'manager', departmentId: 'dept_4' },
  
  { id: 'user_6', name: 'Lê Hoàng Hùng', email: 'hung.le@company.com', avatar: 'https://i.pravatar.cc/150?u=user_6', role: 'staff', departmentId: 'dept_1' },
  { id: 'user_7', name: 'Vũ Minh Tuấn', email: 'tuan.vu@company.com', avatar: 'https://i.pravatar.cc/150?u=user_7', role: 'staff', departmentId: 'dept_2' },
  { id: 'user_8', name: 'HR Thanh', email: 'thanh.hr@company.com', avatar: 'https://i.pravatar.cc/150?u=user_8', role: 'admin', departmentId: 'dept_3' },
];

export const MOCK_COMPANY_PLANS: CompanyPlan[] = [
  {
    id: 'cplan_1',
    title: 'Kế hoạch Kinh doanh Q1/2026',
    description: 'Tập trung đẩy mạnh doanh số các kênh B2B và mở rộng thị trường miền Trung.',
    attachments: [{ id: 'file_1', name: 'Kh_Kinh_Doanh_Q1.pdf', size: 2048000, url: '#', type: 'application/pdf' }],
    deadline: addDays(now, 30).toISOString(),
    createdBy: 'user_1',
    createdAt: subDays(now, 10).toISOString(),
    status: 'active',
  },
  {
    id: 'cplan_2',
    title: 'Chiến lược Phát triển Sản phẩm 2026',
    description: 'Ra mắt tính năng AI và mobile app.',
    attachments: [],
    deadline: addDays(now, 120).toISOString(),
    createdBy: 'user_1',
    createdAt: subDays(now, 20).toISOString(),
    status: 'active',
  },
];

export const MOCK_DEPARTMENT_PLANS: DepartmentPlan[] = [
  {
    id: 'dplan_1',
    companyPlanId: 'cplan_1',
    departmentId: 'dept_1',
    title: 'KH Sales & Khai thác B2B Q1/2026',
    description: 'Thực thi chỉ tiêu mở rộng đại lý và tăng 20% doanh thu B2B.',
    status: 'approved',
    versions: [],
    currentVersion: 'v1.0',
    attachments: [],
    createdBy: 'user_2',
    createdAt: subDays(now, 8).toISOString(),
    updatedAt: subDays(now, 5).toISOString(),
    approvedBy: 'user_1',
    approvedAt: subDays(now, 5).toISOString(),
    tasks: [
      {
        id: 'task_1',
        planId: 'dplan_1',
        title: 'Liên hệ 50 khách hàng tiềm năng',
        assigneeId: 'user_6',
        deadline: addDays(now, 5).toISOString(),
        priority: 'high',
        status: 'in_progress',
        progress: 65,
        notes: '',
        attachments: [],
        createdAt: subDays(now, 8).toISOString(),
        updatedAt: subDays(now, 1).toISOString(),
      },
      {
        id: 'task_2',
        planId: 'dplan_1',
        title: 'Chốt 5 hợp đồng mới',
        assigneeId: 'user_2',
        deadline: addDays(now, 15).toISOString(),
        priority: 'urgent',
        status: 'not_started',
        progress: 0,
        notes: '',
        attachments: [],
        createdAt: subDays(now, 8).toISOString(),
        updatedAt: subDays(now, 8).toISOString(),
      }
    ]
  },
  {
    id: 'dplan_2',
    companyPlanId: 'cplan_1',
    departmentId: 'dept_2',
    title: 'Chiến dịch Quảng cáo Q1',
    description: 'Support cho KH Sales bằng campaigns Facebook & Google.',
    status: 'pending',
    versions: [],
    currentVersion: 'v1.0',
    attachments: [],
    createdBy: 'user_3',
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subDays(now, 2).toISOString(),
    tasks: []
  }
];

export const MOCK_APPROVAL_ACTIONS: ApprovalAction[] = [
  {
    id: 'app_1',
    planId: 'dplan_1',
    action: 'submit',
    comment: 'Xin trình sếp KH Sales Q1',
    performedBy: 'user_2',
    performedAt: subDays(now, 6).toISOString()
  },
  {
    id: 'app_2',
    planId: 'dplan_1',
    action: 'approve',
    comment: 'Duyệt. Chú ý target B2B.',
    performedBy: 'user_1',
    performedAt: subDays(now, 5).toISOString()
  },
  {
    id: 'app_3',
    planId: 'dplan_2',
    action: 'submit',
    comment: 'Sếp xem giúp em campaign này.',
    performedBy: 'user_3',
    performedAt: subDays(now, 2).toISOString()
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_1',
    type: 'info',
    title: 'Kế hoạch mới cần duyệt',
    message: 'Trưởng phòng Nam vừa gửi "Chiến dịch Quảng cáo Q1"',
    isRead: false,
    createdAt: subDays(now, 2).toISOString(),
    link: '/approvals'
  },
  {
    id: 'notif_2',
    userId: 'user_6',
    type: 'warning',
    title: 'Deadline đến gần',
    message: 'Task "Liên hệ 50 khách hàng" sắp hết hạn trong 5 ngày',
    isRead: true,
    createdAt: subDays(now, 1).toISOString(),
    link: '/progress'
  }
];

// Initialize localStorage if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('wf_departments')) localStorage.setItem('wf_departments', JSON.stringify(MOCK_DEPARTMENTS));
  if (!localStorage.getItem('wf_users')) localStorage.setItem('wf_users', JSON.stringify(MOCK_USERS));
  if (!localStorage.getItem('wf_company_plans')) localStorage.setItem('wf_company_plans', JSON.stringify(MOCK_COMPANY_PLANS));
  if (!localStorage.getItem('wf_department_plans')) localStorage.setItem('wf_department_plans', JSON.stringify(MOCK_DEPARTMENT_PLANS));
  if (!localStorage.getItem('wf_approvals')) localStorage.setItem('wf_approvals', JSON.stringify(MOCK_APPROVAL_ACTIONS));
  if (!localStorage.getItem('wf_notifications')) localStorage.setItem('wf_notifications', JSON.stringify(MOCK_NOTIFICATIONS));
};
