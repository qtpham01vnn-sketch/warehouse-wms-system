import React from 'react';

export const DataTable: React.FC<any> = ({ columns, data }) => (
  <div className="glass-panel" style={{ width: '100%', overflowX: 'auto' }}>
    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns?.map((col: any, i: number) => (
            <th key={i} style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', color: 'var(--text-secondary)' }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length === 0 ? (
          <tr><td colSpan={columns?.length || 1} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Không có dữ liệu</td></tr>
        ) : (
          data?.map((row: any, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
              {columns?.map((col: any, j: number) => (
                <td key={j} style={{ padding: '16px' }}>{col.cell ? col.cell(row) : row[col.accessorKey]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export const ConfirmDialog: React.FC<any> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-slide-up" style={{ padding: '24px', maxWidth: '400px', width: '100%' }}>
        <h3 style={{ marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: '4px', background: 'transparent', color: 'white', border: '1px solid var(--color-border)' }}>Hủy</button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', borderRadius: '4px', background: 'var(--status-error)', color: 'white', border: 'none' }}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export const FileUpload: React.FC<any> = () => (
  <div style={{ border: '2px dashed var(--color-border)', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
    <p style={{ color: 'var(--text-secondary)' }}>Kéo thả file vào đây hoặc click để tải lên</p>
  </div>
);

export const Breadcrumbs: React.FC<any> = ({ items }) => (
  <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
    {items?.map((item: any, idx: number) => (
      <span key={idx}>
        {item.label}
        {idx < items.length - 1 && <span style={{ margin: '0 8px' }}>/</span>}
      </span>
    ))}
  </div>
);
