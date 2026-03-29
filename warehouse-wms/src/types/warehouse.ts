export type TileGrade = 'A' | 'B' | 'C' | '1' | '2';
export type TransactionType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUST';

export interface TileProduct {
  id: string;
  sku: string;
  name: string;
  size: string; // e.g., "80x80", "60x60"
  surface: string; // e.g., "Polished", "Matt", "Sugar"
  color: string;
  category: string; // e.g., "Floor Tile", "Wall Tile"
  unit: 'PCS' | 'BOX' | 'M2';
  pcsPerBox: number;
  m2PerBox: number;
  weightPerBox: number;
  thumbnail?: string;
}

export interface StockLevel {
  productId: string;
  batch: string; // Lô sản xuất
  grade: TileGrade;
  quantityBoxes: number; // Số hộp
  quantityM2: number; // Số mét vuông (calculated)
  warehouseLocation?: string;
}

export interface WarehouseTransaction {
  id: string;
  type: TransactionType;
  date: string;
  referenceNumber: string; // Phiếu nhập/xuất số
  partnerName: string; // Nhà cung cấp hoặc Khách hàng
  items: TransactionItem[];
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface TransactionItem {
  productId: string;
  batch_id: string; // Refers to wms_batches.id
  grade: TileGrade;
  quantityBoxes: number;
  quantityM2: number;
  price?: number;
}
