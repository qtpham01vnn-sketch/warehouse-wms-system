import { supabase } from '../lib/supabase';
import type { StockLevel } from '../types/warehouse';

export const inventoryService = {
  getStockLevels: async () => {
    // Join with products and batches to get complete info
    const { data, error } = await supabase
      .from('wms_inventory')
      .select(`
        id,
        product_id,
        batch_id,
        grade,
        quantity_boxes,
        quantity_m2,
        location,
        wms_products (sku, name, thumbnail_url),
        wms_batches (batch_code)
      `)
      .gt('quantity_boxes', 0);
    
    if (error) throw error;
    
    return (data || []).map(item => {
      const prod = item.wms_products as any;
      const batch = item.wms_batches as any;
      
      return {
        productId: item.product_id,
        batch: batch?.batch_code || 'N/A',
        grade: item.grade,
        quantityBoxes: item.quantity_boxes,
        quantityM2: item.quantity_m2,
        warehouseLocation: item.location,
        sku: prod?.sku || 'N/A',
        productName: prod?.name || 'Unknown',
        thumbnail: prod?.thumbnail_url
      };
    }) as any[];
  }
};
