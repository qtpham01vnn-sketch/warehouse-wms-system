import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import './Inventory.css';

const Inventory: React.FC = () => {
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await inventoryService.getStockLevels();
        setStock(data);
      } catch (err) {
        console.error('Failed to fetch stock levels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const totalM2 = stock.reduce((sum, item) => sum + item.quantityM2, 0);
  const totalBoxes = stock.reduce((sum, item) => sum + item.quantityBoxes, 0);

  return (
    <div className="inventory-page animate-fade-in">
      <div className="page-header flex-between mb-8">
        <div>
          <h1 className="page-title text-gradient">Tồn kho Thực tế</h1>
          <p className="page-subtitle">Theo dõi số dư tồn kho theo Lô (Batch) và Phân loại (Grade).</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline"><Clock size={16} /> Lịch sử kiểm kê</button>
        </div>
      </div>

      <div className="stats-grid mb-8">
        <div className="glass-card stat-card-mini">
          <div className="flex items-center gap-3">
            <div className="icon-box bg-indigo-soft"><Package size={20} className="text-indigo" /></div>
            <div>
              <span className="stat-label">Tổng tồn (M2)</span>
              <span className="stat-value text-indigo">{totalM2.toLocaleString()} m²</span>
            </div>
          </div>
        </div>
        <div className="glass-card stat-card-mini">
           <div className="flex items-center gap-3">
             <div className="icon-box bg-success-soft"><ArrowDownCircle size={20} className="text-success" /></div>
             <div>
               <span className="stat-label">Tổng số hộp</span>
               <span className="stat-value text-success">{totalBoxes.toLocaleString()} hộp</span>
             </div>
           </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex-between bg-white/2">
           <div className="search-box">
             <Search size={16} className="text-muted" />
             <input type="text" placeholder="Lọc theo SKU, Lô hàng..." className="bg-transparent border-none text-xs text-white outline-none ml-2 w-64" />
           </div>
           <button className="btn-icon-text text-xs"><Filter size={14} /> Lọc nâng cao</button>
        </div>

        <div className="table-container custom-scrollbar">
          <table className="wms-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Lô hàng (Batch)</th>
                <th>Phân loại</th>
                <th>Số lượng hộp</th>
                <th>Diện tích (M2)</th>
                <th>Vị trí kho</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center">
                      <div className="flex-center">
                         <Loader2 className="animate-spin mr-2" /> Đang truy vấn tồn kho...
                      </div>
                   </td>
                </tr>
              ) : (
                stock.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="flex items-center gap-3">
                         <img src={item.thumbnail || 'https://via.placeholder.com/32?text=T'} className="w-8 h-8 rounded bg-white/5" alt="" />
                         <div className="flex flex-col">
                            <span className="font-bold text-white">{item.sku}</span>
                            <span className="text-[10px] text-muted">{item.productName}</span>
                         </div>
                      </div>
                    </td>
                    <td><span className="badge-batch">{item.batch}</span></td>
                    <td><span className={`grade-tag grade-${item.grade}`}>Loại {item.grade}</span></td>
                    <td><b className="text-white">{item.quantityBoxes}</b> hộp</td>
                    <td><b className="text-primary">{item.quantityM2}</b> m²</td>
                    <td><span className="text-muted text-xs">{item.warehouseLocation || 'Chưa xếp vị trí'}</span></td>
                  </tr>
                ))
              )}
              {stock.length === 0 && !loading && (
                <tr><td colSpan={6} className="py-20 text-center text-muted">Kho hiện tại chưa có hàng.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
