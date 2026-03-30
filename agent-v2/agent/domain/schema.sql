-- Equipment Management System MVP Schema (Supabase)

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Equipment (Assets)
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT NOT NULL UNIQUE,
    asset_name TEXT NOT NULL,
    model TEXT,
    serial_number TEXT UNIQUE,
    manufacturer TEXT,
    year INTEGER,
    purchase_date DATE,
    install_date DATE,
    department TEXT,
    location TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'repair', 'inactive')),
    cost DECIMAL(12, 2),
    maintenance_cycle INTEGER, -- in days
    next_maintenance_date DATE,
    warranty_expiry DATE,
    calibration_due DATE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Maintenance Logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    action_date DATE DEFAULT CURRENT_DATE,
    technician TEXT,
    description TEXT,
    cost DECIMAL(12, 2) DEFAULT 0,
    next_schedule_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Repair Requests
CREATE TABLE IF NOT EXISTS repair_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    request_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    description TEXT NOT NULL,
    technician_assigned TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completion_date TIMESTAMP WITH TIME ZONE,
    repair_cost DECIMAL(12, 2) DEFAULT 0
);

-- 5. Spare Parts Inventory
CREATE TABLE IF NOT EXISTS spare_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_code TEXT NOT NULL UNIQUE,
    part_name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    unit_cost DECIMAL(12, 2),
    min_threshold INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Spare Parts Usage (for Repairs)
CREATE TABLE IF NOT EXISTS spare_parts_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repair_id UUID REFERENCES repair_requests(id) ON DELETE CASCADE,
    part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
    quantity_used INTEGER NOT NULL DEFAULT 1,
    usage_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- e.g., 'maintenance_due', 'warranty_expiring'
    message TEXT NOT NULL,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
