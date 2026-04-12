export type DocumentType = 'QT' | 'HS' | 'BM' | 'HDCV';
export type DocumentStatus = 'draft' | 'under_review' | 'approved' | 'active' | 'obsolete';
export type DocumentVisibility = 'department_only' | 'company_wide';
export type UserRole = 'Admin' | 'Reviewer' | 'Approver' | 'Standard';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  departmentid: string; // Verified column
  created_at: string;
}

export interface ISODocument {
  id: string;
  code: string; // Verified column
  doccode: string; // Verified column (NOT NULL)
  version: string; // Verified column (NOT NULL)
  name: string; // Verified column
  type: DocumentType;
  departmentid: string; // Verified column
  owner_id: string; // Verified column
  owner_name?: string; // Display field
  drafter_name?: string; // Business metadata
  reviewer_name?: string; // Business metadata
  approver_name?: string; // Business metadata
  reviewer?: string; // Legacy display field
  approver?: string; // Legacy display field
  status: DocumentStatus;
  access_scope: 'department_only' | 'company_wide'; // Verified column (not visibility)
  url?: string; // Verified column (stores file link)
  current_version_id?: string;
  published_date?: string;
  effective_date?: string;
  nextreviewdate?: string; // Verified column
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: string;
  file_url: string;
  change_log?: string;
  uploader_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkflowLog {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  from_status: DocumentStatus | null;
  to_status: DocumentStatus;
  comment?: string;
  timestamp: string;
}

export interface ISOCertificate {
  id: string;
  name: string;
  standard?: string;
  cert_number?: string;
  issuer?: string;
  issued_date: string;
  expiry_date: string;
  status: string;
  file_url?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: 'Download' | 'View' | 'Export';
  target_id: string;
  target_type: 'Document' | 'Certificate';
  timestamp: string;
}

export interface ISOAlert {
  id: string;
  related_id: string;
  target_type: 'Document' | 'Certificate';
  alert_type: 'Expiry' | 'Review';
  priority: 'Warning' | 'Danger';
  message: string;
  is_resolved: boolean;
  created_at: string;
}

export interface DepartmentStats {
  department_id: string;
  department_name: string; // Added for display label
  total: number;
  active: number;
  pending: number;
  expiring: number;
  obsolete: number;
  status_color: 'green' | 'yellow' | 'orange' | 'red';
}

export interface DashboardSummary {
  total: number;
  active: number;
  pending: number;
  expiring: number;
  obsolete: number;
}
