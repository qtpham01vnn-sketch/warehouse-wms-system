import React from 'react';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'draft':
    case 'not_started':
    case 'not_submitted':
      return { label: 'Bản nháp', type: 'draft' };
    case 'pending':
    case 'submitted':
      return { label: 'Chờ duyệt', type: 'pending' };
    case 'approved':
    case 'reviewed':
    case 'completed':
    case 'active':
      return { label: 'Hoàn thành', type: 'approved' };
    case 'rejected':
      return { label: 'Từ chối', type: 'rejected' };
    case 'revision':
      return { label: 'Cần sửa lại', type: 'overdue' };
    case 'in_progress':
      return { label: 'Đang thực hiện', type: 'in-progress' };
    case 'overdue':
      return { label: 'Quá hạn', type: 'overdue' };
    case 'archived':
      return { label: 'Lưu trữ', type: 'draft' };
    default:
      return { label: status, type: 'draft' };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = getStatusConfig(status);

  return (
    <span className={`status-badge badge-${config.type} ${className}`} title={status}>
      {config.label}
    </span>
  );
};
