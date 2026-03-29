import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { XCircle, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css'; // Add CSS for toasts

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-success" size={20} />;
      case 'error': return <XCircle className="text-error" size={20} />;
      case 'warning': return <AlertCircle className="text-warning" size={20} />;
      case 'info': return <Info className="text-info" size={20} />;
      default: return <Info className="text-info" size={20} />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container animate-fade-in">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast glass-panel toast-${toast.type}`}>
          <div className="toast-icon">
            {getIcon(toast.type)}
          </div>
          <div className="toast-content">
            <h4 className="toast-title">{toast.title}</h4>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
