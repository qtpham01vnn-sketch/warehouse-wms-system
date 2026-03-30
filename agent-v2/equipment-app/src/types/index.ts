// Equipment Management System Types

export type AssetStatus = 'active' | 'maintenance' | 'repair' | 'inactive';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Equipment {
  id: string;
  asset_code: string;
  asset_name: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  year?: number;
  purchase_date?: string;
  install_date?: string;
  department?: string;
  location?: string;
  status: AssetStatus;
  cost?: number;
  maintenance_cycle?: number; // in days
  next_maintenance_date?: string;
  warranty_expiry?: string;
  calibration_due?: string;
  category_id?: string;
  created_at: string;
}

export interface MaintenanceLog {
  id: string;
  equipment_id: string;
  action_date: string;
  technician: string;
  description: string;
  cost: number;
  next_schedule_date?: string;
  created_at: string;
}

export interface RepairRequest {
  id: string;
  equipment_id: string;
  request_date: string;
  description: string;
  technician_assigned?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completion_date?: string;
  repair_cost: number;
}

export interface SparePart {
  id: string;
  part_code: string;
  part_name: string;
  description?: string;
  quantity: number;
  unit_cost: number;
  min_threshold: number;
  created_at: string;
}

export interface SparePartUsage {
  id: string;
  repair_id: string;
  part_id: string;
  quantity_used: number;
  usage_date: string;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  equipment_id: string;
  is_read: boolean;
  created_at: string;
}
