import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, ArrowUpRight } from 'lucide-react';
import { productService } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';
import type { TileProduct, TileGrade, StockLevel } from '../../types/warehouse';

interface OutboundFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const OutboundForm: React.FC<OutboundFormProps> = ({ onClose, onSave }) => {
  const [products, setProducts] = useState<TileProduct[]>([]);
  const [stockLevels, setStockLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [referenceNumber, setReferenceNumber] = useState(`PN-OUT-${Date.now().toString().slice(-6)}`);
  const [partnerName, setPartnerName] = useState('');
  const [items, setItems] = useState<any[]>([
    { productId: '', batch_id: '', grade: '1' as TileGrade, quantityBoxes: 0, quantityM2: 0, available: 0 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, sData] = await Promise.all([
          productService.getProducts(),
          inventoryService.getStockLevels()
        ]);
        setProducts(pData);
        setStockLevels(sData);
      } catch (err) {
        console.error('Failed to fetch form data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems([...items, { productId: '', batch_id: '', grade: '1', quantityBoxes: 0, quantityM2: 0, available: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Check available stock when product/batch/grade changes
    const currentItem = newItems[index];
    const stock = stockLevels.find(s => 
      s.productId === currentItem.productId && 
      s.batch === currentItem.batch && // Note: mapping logic in stockLevels needs careful match
      s.grade === currentItem.grade
    );

    // Auto-calculate M2 if product exists
    const product = products.find(p => p.id === currentItem.productId);
    if (product && field === 'quantityBoxes') {
      newItems[index].quantityM2 = Number((currentItem.quantityBoxes * product.m2PerBox).toFixed(2));
    }

    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: 'OUT',
      referenceNumber,
      partnerName,
      items,
      notes: ''
    });
  };

  if (loading) return <div className="p-8 text-center text-white">Đang truy xuất dữ liệu tồn kho...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in shadow-2xl border-error/20">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-error/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="text-error" /> Tạo Phiếu Xuất Kho
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="form-group">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Số Phiếu Xuất</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-error outline-none transition-all"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Khách hàng / Đại lý</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-error outline-none transition-all"
                placeholder="Ví dụ: Đại lý 79"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mặt hàng cần xuất</h3>
            <button 
              type="button"
              onClick={addItem}
              className="px-4 py-1 bg-white/5 border border-white/10 text-white rounded-lg text-xs hover:bg-white/10 transition-all flex items-center gap-1"
            >
              <Plus size={14} /> Thêm mặt hàng
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="glass-card p-4 border-white/5 bg-black/20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Sản phẩm & Tồn kho hiện tại</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">-- Chọn mặt hàng trong kho --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Lô hàng (Batch)</label>
                    {/* For Outbound, user should ideally see only batches that HAVE stock */}
                    <input 
                       type="text"
                       className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                       placeholder="Nhập mã lô"
                       value={item.batch_id} // For simplicity in MVP, let them type or ideally we'd filter from stockLevels
                       onChange={(e) => updateItem(index, 'batch_id', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Loại</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      value={item.grade}
                      onChange={(e) => updateItem(index, 'grade', e.target.value)}
                    >
                      <option value="1">Loại 1</option>
                      <option value="2">Loại 2</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Số Hộp Xuất</label>
                    <input 
                      type="number" 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-error"
                      value={item.quantityBoxes}
                      onChange={(e) => updateItem(index, 'quantityBoxes', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">M2</label>
                    <input 
                      type="number" 
                      readOnly
                      className="w-full bg-transparent border-none p-2 text-xs text-error font-bold outline-none"
                      value={item.quantityM2}
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end justify-center">
                    <button 
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-muted hover:text-error transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
          <button 
            type="button"
            onClick={onClose}
            className="btn-outline px-6 py-2"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-error hover:bg-error/80 text-white font-bold px-8 py-2 rounded-xl transition-all shadow-lg shadow-error/20"
          >
            Lưu phiếu & Trừ kho
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutboundForm;
