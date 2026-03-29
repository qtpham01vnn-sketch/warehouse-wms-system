import type { TileProduct, StockLevel, WarehouseTransaction } from '../types/warehouse';

export const MOCK_PRODUCTS: TileProduct[] = [
  {
    id: 'p1',
    sku: 'PN8801',
    name: 'Phuong Nam Carrara White',
    size: '80x80',
    surface: 'Polished',
    color: 'White',
    category: 'Floor Tile',
    unit: 'BOX',
    pcsPerBox: 3,
    m2PerBox: 1.92,
    weightPerBox: 45,
    thumbnail: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee6d?w=100&h=100&fit=crop'
  },
  {
    id: 'p2',
    sku: 'PN6602',
    name: 'Stone Grey Matt',
    size: '60x60',
    surface: 'Matt',
    color: 'Grey',
    category: 'Floor Tile',
    unit: 'BOX',
    pcsPerBox: 4,
    m2PerBox: 1.44,
    weightPerBox: 32,
    thumbnail: 'https://images.unsplash.com/photo-1502005075199-5193663c823d?w=100&h=100&fit=crop'
  },
  {
    id: 'p3',
    sku: 'PN3603',
    name: 'Wooden Brown Plank',
    size: '15x60',
    surface: 'Sugar',
    color: 'Brown',
    category: 'Wall Tile',
    unit: 'BOX',
    pcsPerBox: 11,
    m2PerBox: 0.99,
    weightPerBox: 22,
    thumbnail: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=100&h=100&fit=crop'
  }
];

export const MOCK_STOCK: StockLevel[] = [
  { productId: 'p1', batch: '2024-03-A', grade: '1', quantityBoxes: 120, quantityM2: 230.4 },
  { productId: 'p1', batch: '2024-03-A', grade: '2', quantityBoxes: 15, quantityM2: 28.8 },
  { productId: 'p1', batch: '2024-03-B', grade: '1', quantityBoxes: 80, quantityM2: 153.6 },
  { productId: 'p2', batch: '2024-02-C', grade: '1', quantityBoxes: 300, quantityM2: 432.0 },
  { productId: 'p3', batch: '2023-12-Z', grade: '1', quantityBoxes: 50, quantityM2: 49.5 }
];

export const MOCK_TRANSACTIONS: WarehouseTransaction[] = [
  {
    id: 't1',
    type: 'IN',
    date: '2024-03-28T09:00:00Z',
    referenceNumber: 'PN-IN-001',
    partnerName: 'Nha May Gach Men Phuong Nam',
    items: [
      { productId: 'p1', batch: '2024-03-B', grade: '1', quantityBoxes: 80 }
    ],
    status: 'COMPLETED'
  },
  {
    id: 't2',
    type: 'OUT',
    date: '2024-03-29T14:30:00Z',
    referenceNumber: 'PN-OUT-005',
    partnerName: 'Dai Ly 79',
    items: [
      { productId: 'p2', batch: '2024-02-C', grade: '1', quantityBoxes: 20 }
    ],
    status: 'PENDING'
  }
];
