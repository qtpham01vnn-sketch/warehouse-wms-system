export type Role = 'director' | 'manager' | 'staff' | 'admin';

export interface Department {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  departmentId: string;
}

export type PlanStatus = 'active' | 'archived';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

export interface CompanyPlan {
  id: string;
  title: string;
  description: string;
  attachments: FileAttachment[];
  deadline: string;
  createdBy: string;
  createdAt: string;
  status: PlanStatus;
}

export type DeptPlanStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'revision' | 'in_progress' | 'completed';

export interface PlanVersion {
  id: string;
  planId: string;
  versionNumber: string; // e.g., 'v1.0'
  changes: string;
  snapshot: string; // JSON string of the plan at this version
  createdBy: string;
  createdAt: string;
}

export interface DepartmentPlan {
  id: string;
  companyPlanId: string;
  departmentId: string;
  title: string;
  description: string;
  goals?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  tasks: PlanTask[];
  status: DeptPlanStatus;
  versions: PlanVersion[];
  currentVersion: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  attachments: FileAttachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export interface PlanTask {
  id: string;
  planId: string; // Refers to DepartmentPlan
  title: string;
  assigneeId: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number; // 0-100
  weight?: number; // 0-100%
  notes: string;
  attachments: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export type ApprovalActionType = 'submit' | 'approve' | 'reject' | 'request_revision';

export interface ApprovalAction {
  id: string;
  planId: string; // Refers to DepartmentPlan
  action: ApprovalActionType;
  comment: string;
  performedBy: string; // UserId
  performedAt: string;
}

export type ReportStatus = 'not_submitted' | 'submitted' | 'reviewed';

export interface MonthlyReport {
  id: string;
  departmentId: string;
  month: number;
  year: number;
  summary: string;
  attachments: FileAttachment[];
  status: ReportStatus;
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type IsoType = 'procedure' | 'record' | 'form' | 'instruction' | 'external';
export type DocStatus = 'active' | 'obsolete' | 'draft' | 'review_required';

export interface DocVersion {
  id: string;
  documentId: string;
  versionNumber: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  changeDescription: string; // Mandatory for ISO audit
}

export interface Document {
  id: string;
  name: string;
  docCode: string; // e.g. QT-01
  isoType: IsoType;
  type: string; // MIME type (application/pdf, etc.)
  size: number;
  url: string;
  departmentId: string;
  versions: DocVersion[];
  currentVersion: string;
  changeDescription?: string; // Last change description
  uploadedBy: string;
  uploadedAt: string;
  nextReviewDate?: string;
  status: DocStatus;
  isCurrent: boolean;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
