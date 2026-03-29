import { supabase } from '../lib/supabase';
import type { TileProduct } from '../types/warehouse';

export const productService = {
  getProducts: async () => {
    const { data, error } = await supabase
      .from('wms_products')
      .select('*')
      .order('sku', { ascending: true });
    
    if (error) throw error;
    
    // Map DB fields to our Frontend TileProduct interface
    return (data || []).map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      size: p.size,
      surface: p.surface,
      color: p.color,
      category: p.category,
      unit: p.unit,
      pcsPerBox: p.pcs_per_box,
      m2PerBox: p.m2_per_box,
      weightPerBox: p.weight_per_box,
      thumbnail: p.thumbnail_url
    })) as TileProduct[];
  },

  getBatches: async () => {
    const { data, error } = await supabase
      .from('wms_batches')
      .select('*')
      .order('batch_code', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
};
