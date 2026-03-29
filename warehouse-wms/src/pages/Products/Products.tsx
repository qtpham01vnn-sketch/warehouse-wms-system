import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Maximize2,
  Box,
  Layers,
  Package,
  Loader2
} from 'lucide-react';
import { productService } from '../../services/productService';
import type { TileProduct } from '../../types/warehouse';
import './Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<TileProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-page animate-fade-in">
      <div className="page-header flex-between mb-8">
        <div>
          <h1 className="page-title text-gradient">Danh mục Sản phẩm</h1>
          <p className="page-subtitle">Quản lý mã gạch, quy cách và thông số kỹ thuật nội bộ.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> Thêm Sản phẩm mới
        </button>
      </div>

      <div className="glass-panel p-4 mb-6 filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Tìm kiếm SKU, tên sản phẩm..." />
        </div>
        <div className="filter-actions">
          <button className="btn-outline">
            <Filter size={16} /> Bộ lọc
          </button>
          <div className="divider"></div>
          <span className="results-count">
            {loading ? 'Đang tải...' : <>Hiển thị <b>{products.length}</b> sản phẩm</>}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex-center py-20">
           <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="glass-card product-card">
              <div className="product-image-box">
                <img src={product.thumbnail || 'https://via.placeholder.com/150?text=Tile'} alt={product.name} className="product-thumb" />
                <div className="product-category-tag">{product.category}</div>
              </div>
              
              <div className="product-content">
                <div className="flex-between mb-1">
                  <span className="product-sku text-gradient">{product.sku}</span>
                  <button className="btn-icon-sm"><MoreVertical size={16} /></button>
                </div>
                <h3 className="product-name">{product.name}</h3>
                
                <div className="product-specs-grid">
                  <div className="spec-item">
                    <Maximize2 size={12} className="text-muted" />
                    <span>{product.size} cm</span>
                  </div>
                  <div className="spec-item">
                    <Layers size={12} className="text-muted" />
                    <span>{product.surface}</span>
                  </div>
                  <div className="spec-item">
                    <Box size={12} className="text-muted" />
                    <span>{product.pcsPerBox} viên/hộp</span>
                  </div>
                  <div className="spec-item">
                    <Package size={12} className="text-muted" />
                    <span>{product.m2PerBox} m²/hộp</span>
                  </div>
                </div>

                <div className="product-footer mt-4">
                  <div className="color-indicator">
                    <span className="dot" style={{ background: product.color?.toLowerCase() || '#ccc' }}></span>
                    <span className="color-name">{product.color || 'N/A'}</span>
                  </div>
                  <button className="btn-text">Chi tiết</button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center glass-panel">
               Danh mục trống. Vui lòng thêm sản phẩm vào database.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
