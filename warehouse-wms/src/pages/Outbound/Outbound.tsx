import React, { useState, useEffect } from 'react';
import { 
  ArrowUpCircle, 
  Search, 
  ChevronRight,
  Plus,
  Loader2,
  Package
} from 'lucide-react';
import { transactionService } from '../../services/transactionService';
import OutboundForm from '../../components/warehouse/OutboundForm';
import './Outbound.css';

const Outbound: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data.filter((t: any) => t.type === 'OUT'));
    } catch (err) {
      console.error('Failed to fetch outbound transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSaveTransaction = async (formData: any) => {
    try {
      await transactionService.processTransaction(formData);
      setShowForm(false);
      fetchTransactions(); // Refresh list
    } catch (err) {
      alert('Lỗi khi lưu phiếu xuất: ' + (err as any).message);
    }
  };

  return (
    <div className="outbound-page animate-fade-in">
      <div className="page-header flex-between mb-8">
        <div>
          <h1 className="page-title text-gradient">Phiếu Xuất kho</h1>
          <p className="page-subtitle">Quản lý các lệnh xuất hàng cho đại lý (Real-time DB).</p>
        </div>
        <button className="btn-primary bg-error-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Tạo Phiếu Xuất
        </button>
      </div>

      {showForm && (
        <OutboundForm 
          onClose={() => setShowForm(false)} 
          onSave={handleSaveTransaction} 
        />
      )}

      <div className="glass-panel p-4 mb-6 search-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Tìm số phiếu, khách hàng..." />
        </div>
        <div className="filter-tabs">
          <button className="tab active">Tất cả</button>
          <button className="tab">Chờ duyệt</button>
        </div>
      </div>

      {loading ? (
        <div className="flex-center py-20 text-muted">
           <Loader2 className="animate-spin mr-2" /> Đang tải danh sách phiếu xuất...
        </div>
      ) : (
        <div className="outbound-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-card tx-card">
              <div className="tx-header">
                <div className="flex items-center gap-4">
                   <div className="tx-icon-box bg-error-soft">
                     <ArrowUpCircle size={20} className="text-error" />
                   </div>
                   <div>
                      <h3 className="tx-number">{tx.reference_number}</h3>
                      <span className="tx-date">{new Date(tx.created_at).toLocaleDateString('vi-VN')}</span>
                   </div>
                </div>
                <span className={`badge badge-${tx.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                  {tx.status === 'COMPLETED' ? 'Đã xuất' : 'Chờ duyệt'}
                </span>
              </div>
              
              <div className="tx-body">
                <div className="tx-partner">
                  <span className="label">Khách hàng:</span>
                  <span className="value">{tx.partner_name}</span>
                </div>
                <div className="tx-items-count">
                  <span className="label">Dòng hàng:</span>
                  <span className="value">{tx.wms_transaction_items?.length || 0} mặt hàng</span>
                </div>
              </div>

              <div className="tx-footer flex-between">
                 <div className="tx-total">
                    <span className="label">Ghi chú:</span>
                    <span className="text-xs text-muted truncate max-w-[150px]">{tx.notes || 'Không có'}</span>
                 </div>
                 <button className="btn-icon-text">
                    Chi tiết <ChevronRight size={16} />
                 </button>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="empty-state">
                <Package size={48} className="text-muted mb-4" />
                <p>Không có phiếu xuất nào trong hệ thống.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Outbound;
