import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle,
  Layers,
  Loader2
} from 'lucide-react';
import { productService } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';
import { transactionService } from '../../services/transactionService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockM2: 0,
    totalStockBoxes: 0,
    pendingIn: 0,
    pendingOut: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [products, stock, transactions] = await Promise.all([
          productService.getProducts(),
          inventoryService.getStockLevels(),
          transactionService.getTransactions()
        ]);

        const totalM2 = (stock as any[]).reduce((acc, item) => acc + (item.quantityM2 || 0), 0);
        const totalBoxes = (stock as any[]).reduce((acc, item) => acc + (item.quantityBoxes || 0), 0);
        const pIn = transactions.filter((t: any) => t.type === 'IN' && t.status === 'PENDING').length;
        const pOut = transactions.filter((t: any) => t.type === 'OUT' && t.status === 'PENDING').length;

        setStats({
          totalProducts: products.length,
          totalStockM2: totalM2,
          totalStockBoxes: totalBoxes,
          pendingIn: pIn,
          pendingOut: pOut
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Tổng quan Kho</h1>
        <p className="page-subtitle">Hệ thống quản lý kho gạch men Phuong Nam - Real-time Data</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon-box bg-indigo-soft">
            <Layers className="stat-icon text-indigo" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Tổng SKUs</span>
            <span className="stat-value">{loading ? '...' : stats.totalProducts}</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-box bg-success-soft">
            <Package className="stat-icon text-success" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Tổng tồn kho (M2)</span>
            <span className="stat-value">{loading ? '...' : stats.totalStockM2.toLocaleString()} m²</span>
            <span className="stat-subtext">{loading ? '' : `${stats.totalStockBoxes} hộp`}</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-box bg-warning-soft">
            <ArrowDownLeft className="stat-icon text-warning" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Nhập kho chờ xử lý</span>
            <span className="stat-value">{loading ? '...' : stats.pendingIn}</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-box bg-error-soft">
            <ArrowUpRight className="stat-icon text-error" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Xuất kho chờ duyệt</span>
            <span className="stat-value">{loading ? '...' : stats.pendingOut}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="glass-panel p-6 main-chart-box">
          <div className="flex-between mb-6">
            <h3 className="section-title">Diễn biến nhập xuất (7 ngày)</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot bg-success"></span> Nhập</span>
              <span className="legend-item"><span className="dot bg-error"></span> Xuất</span>
            </div>
          </div>
          <div className="chart-placeholder">
             {loading ? (
               <div className="flex-center h-full"><Loader2 className="animate-spin" /></div>
             ) : (
               <>
                 <div className="chart-bar-container">
                    {[45, 60, 30, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="chart-bar-group">
                        <div className="bar-in" style={{ height: `${h}%` }}></div>
                        <div className="bar-out" style={{ height: `${h*0.6}%` }}></div>
                      </div>
                    ))}
                 </div>
                 <div className="chart-axis-x">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => <span key={d}>{d}</span>)}
                 </div>
               </>
             )}
          </div>
        </div>

        <div className="glass-panel p-6 sidebar-panel">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning" /> Cảnh báo tồn thấp
          </h3>
          <div className="alert-list">
            <div className="alert-item glass-card">
              <div className="alert-info">
                <span className="alert-sku text-gradient">PN8801 - Loại 2</span>
                <span className="alert-qty">Tồn: 15 hộp</span>
              </div>
              <span className="badge badge-error">Khẩn cấp</span>
            </div>
            <div className="alert-item glass-card">
               <div className="alert-info">
                <span className="alert-sku text-gradient">PN3603 - Loại 1</span>
                <span className="alert-qty">Tồn: 50 hộp</span>
              </div>
              <span className="badge badge-warning">Cần nhập</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
