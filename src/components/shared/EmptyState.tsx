import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex-center flex-col animate-slide-up" style={{ padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-3)' }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: 'var(--spacing-1)' }}>{title}</h3>
      <p className="text-muted" style={{ maxWidth: '400px', marginBottom: 'var(--spacing-4)' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
