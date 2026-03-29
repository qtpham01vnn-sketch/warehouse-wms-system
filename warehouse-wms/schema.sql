-- SQL Script for Ceramic Tile Warehouse WMS (Supabase)

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS wms_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    size TEXT NOT NULL,
    surface TEXT NOT NULL,
    color TEXT,
    category TEXT DEFAULT 'Floor Tile',
    unit TEXT DEFAULT 'BOX',
    pcs_per_box INTEGER DEFAULT 1,
    m2_per_box DECIMAL(10, 2) DEFAULT 1.0,
    weight_per_box DECIMAL(10, 2),
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Batches Table
CREATE TABLE IF NOT EXISTS wms_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code TEXT UNIQUE NOT NULL,
    production_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Inventory Table (Current Balances)
CREATE TABLE IF NOT EXISTS wms_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES wms_products(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES wms_batches(id) ON DELETE CASCADE,
    grade TEXT NOT NULL,
    quantity_boxes INTEGER DEFAULT 0,
    quantity_m2 DECIMAL(10, 2) DEFAULT 0.0,
    location TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, batch_id, grade)
);

-- 4. Create Transactions Table
CREATE TABLE IF NOT EXISTS wms_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'TRANSFER', 'ADJUST')),
    reference_number TEXT UNIQUE NOT NULL,
    partner_name TEXT,
    status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Transaction Items Table
CREATE TABLE IF NOT EXISTS wms_transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES wms_transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES wms_products(id),
    batch_id UUID REFERENCES wms_batches(id),
    grade TEXT NOT NULL,
    quantity_boxes INTEGER NOT NULL,
    quantity_m2 DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(12, 2)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_inventory_product ON wms_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_batch ON wms_inventory(batch_id);

-- SEED DATA
INSERT INTO wms_products (sku, name, size, surface, color, pcs_per_box, m2_per_box) 
VALUES 
('PN8801', 'Phuong Nam Carrara White', '80x80', 'Polished', 'White', 3, 1.92),
('PN6602', 'Stone Grey Matt', '60x60', 'Matt', 'Grey', 4, 1.44),
('PN3603', 'Wooden Brown Plank', '15x60', 'Sugar', 'Brown', 11, 0.99);

INSERT INTO wms_batches (batch_code) VALUES ('2024-03-A'), ('2024-03-B'), ('2024-02-C');
