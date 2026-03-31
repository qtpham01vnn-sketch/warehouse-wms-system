export type DocumentType = 'QT' | 'HS' | 'BM' | 'HDCV';
export type DocumentStatus = 'draft' | 'under_review' | 'approved' | 'active' | 'obsolete';
export type DocumentVisibility = 'department_only' | 'company_wide';
export type UserRole = 'Admin' | 'Reviewer' | 'Approver' | 'Standard';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  department: string;
  created_at: string;
}

export interface ISODocument {
  id: string;
  code: string;
  title: string;
  type: DocumentType;
  department: string;
  owner: string;
  reviewer: string;
  approver: string;
  status: DocumentStatus;
  visibility: DocumentVisibility;
  current_version_id?: string;
  published_date?: string;
  effective_date?: string;
  next_review_date?: string;
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
