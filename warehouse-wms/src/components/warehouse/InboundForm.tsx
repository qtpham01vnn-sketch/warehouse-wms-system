import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import type { TileProduct, TileGrade } from '../../types/warehouse';

interface InboundFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const InboundForm: React.FC<InboundFormProps> = ({ onClose, onSave }) => {
  const [products, setProducts] = useState<TileProduct[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [referenceNumber, setReferenceNumber] = useState(`PN-IN-${Date.now().toString().slice(-6)}`);
  const [partnerName, setPartnerName] = useState('');
  const [items, setItems] = useState<any[]>([
    { productId: '', batch_id: '', grade: '1' as TileGrade, quantityBoxes: 0, quantityM2: 0 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, bData] = await Promise.all([
          productService.getProducts(),
          productService.getBatches()
        ]);
        setProducts(pData);
        setBatches(bData);
      } catch (err) {
        console.error('Failed to fetch form data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems([...items, { productId: '', batch_id: '', grade: '1', quantityBoxes: 0, quantityM2: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Auto-calculate M2 if product and quantityBoxes are present
    if (field === 'quantityBoxes' || field === 'productId') {
      const product = products.find(p => p.id === newItems[index].productId);
      if (product) {
        newItems[index].quantityM2 = Number((newItems[index].quantityBoxes * product.m2PerBox).toFixed(2));
      }
    }
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: 'IN',
      referenceNumber,
      partnerName,
      items,
      notes: ''
    });
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in shadow-2xl border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Save className="text-primary" /> Tạo Phiếu Nhập Kho
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="form-group">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Số Phiếu Nhập</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Nhà Cung Cấp / Nhà Máy</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                placeholder="Ví dụ: Nhà máy Phuong Nam"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Danh sách mặt hàng</h3>
            <button 
              type="button"
              onClick={addItem}
              className="btn-primary py-1 px-4 text-xs flex items-center gap-1"
            >
              <Plus size={14} /> Thêm dòng
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="glass-card p-4 border-white/5 relative group">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Sản phẩm</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Lô (Batch)</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      value={item.batch_id}
                      onChange={(e) => updateItem(index, 'batch_id', e.target.value)}
                      required
                    >
                      <option value="">-- Lô --</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.batch_code}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Loại</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                      value={item.grade}
                      onChange={(e) => updateItem(index, 'grade', e.target.value)}
                    >
                      <option value="1">Loại 1</option>
                      <option value="2">Loại 2</option>
                      <option value="A">Loại A</option>
                      <option value="B">Loại B</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-muted uppercase mb-1 block">Số Hộp</label>
                    <input 
                      type="number" 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
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
                      className="w-full bg-white/5 border border-transparent rounded-lg p-2 text-xs text-primary font-bold outline-none"
                      value={item.quantityM2}
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end justify-center">
                    {items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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
            className="btn-primary px-8 py-2 shadow-indigo-500/20"
          >
            Lưu phiếu & Cập nhật Kho
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboundForm;
