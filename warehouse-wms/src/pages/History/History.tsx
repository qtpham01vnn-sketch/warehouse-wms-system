import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2 } from 'lucide-react';
import { transactionService } from '../../services/transactionService';
import './History.css';

const History: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await transactionService.getTransactions();
        // Flatten transaction items for a "Thẻ kho" view
        const flattened = data.flatMap((tx: any) => 
          (tx.wms_transaction_items || []).map((item: any) => ({
            ...item,
            txType: tx.type,
            txRef: tx.reference_number,
            txDate: tx.created_at,
            partner: tx.partner_name
          }))
        );
        // Sort by date desc
        flattened.sort((a, b) => new Date(b.txDate).getTime() - new Date(a.txDate).getTime());
        setHistory(flattened);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="history-page animate-fade-in">
      <div className="page-header flex-between mb-8">
        <div>
          <h1 className="page-title text-gradient">Nhật ký Thẻ kho</h1>
          <p className="page-subtitle">Chi tiết lịch sử biến động hàng hóa (Real-time Audit Trail).</p>
        </div>
        <button className="btn-outline">
          <Download size={16} /> Xuất Báo cáo Excel
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex-between bg-white/2">
           <div className="search-box">
             <Search size={16} className="text-muted" />
             <input type="text" placeholder="Tìm theo số phiếu, SKU..." className="bg-transparent border-none text-xs text-white outline-none ml-2 w-64" />
           </div>
           <button className="btn-icon-text text-xs"><Filter size={14} /> Lọc thời gian</button>
        </div>

        <div className="table-container custom-scrollbar max-h-[600px] overflow-y-auto">
          <table className="wms-table">
            <thead>
              <tr>
                <th>Ngày & Giờ</th>
                <th>Số Phiếu</th>
                <th>Loại</th>
                <th>Thông tin Gạch</th>
                <th>Lô hàng</th>
                <th>Phân loại</th>
                <th>Số lượng</th>
                <th>Đối tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={8} className="py-20 text-center">
                      <div className="flex-center">
                         <Loader2 className="animate-spin mr-2" /> Đang tải lịch sử thẻ kho...
                      </div>
                   </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-tiny">
                      {new Date(item.txDate).toLocaleString('vi-VN')}
                    </td>
                    <td className="font-bold text-white">{item.txRef}</td>
                    <td>
                      <span className={`badge ${item.txType === 'IN' ? 'badge-success' : 'badge-error'}`}>
                        {item.txType === 'IN' ? 'NHẬP' : 'XUẤT'}
                      </span>
                    </td>
                    <td>
                        <span className="font-bold text-white text-sm">Product {item.product_id?.slice(0, 8)}</span>
                    </td>
                    <td><span className="badge-batch">{item.batch_id?.slice(0, 8) || 'N/A'}</span></td>
                    <td><span className={`grade-tag grade-${item.grade}`}>L{item.grade}</span></td>
                    <td>
                      <b className={item.txType === 'IN' ? 'text-success' : 'text-error'}>
                        {item.txType === 'IN' ? '+' : '-'}{item.quantity_boxes} hộp
                      </b>
                      <div className="text-[10px] text-muted">{item.quantity_m2} m²</div>
                    </td>
                    <td className="text-xs">{item.partner}</td>
                  </tr>
                ))
              )}
              {history.length === 0 && !loading && (
                <tr><td colSpan={8} className="py-20 text-center text-muted">Chưa có giao dịch nào được ghi nhận.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
