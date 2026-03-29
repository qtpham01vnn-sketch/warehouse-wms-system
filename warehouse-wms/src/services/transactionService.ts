import { supabase } from '../lib/supabase';
import type { WarehouseTransaction, TransactionItem } from '../types/warehouse';

export const transactionService = {
  getTransactions: async () => {
    const { data, error } = await supabase
      .from('wms_transactions')
      .select(`
        *,
        wms_transaction_items (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new Inbound/Outbound transaction and update inventory
   */
  processTransaction: async (tx: Omit<WarehouseTransaction, 'id'>) => {
    // 1. Create Transaction Record
    const { data: txData, error: txError } = await supabase
      .from('wms_transactions')
      .insert({
        type: tx.type,
        reference_number: tx.referenceNumber,
        partner_name: tx.partnerName,
        status: 'COMPLETED',
        notes: tx.notes
      })
      .select()
      .single();

    if (txError) throw txError;

    // 2. Process each item: Save Transaction Item and Update Inventory
    for (const item of tx.items) {
      // 2a. Save Transaction Item Detail
      const { error: itemError } = await supabase
        .from('wms_transaction_items')
        .insert({
          transaction_id: txData.id,
          product_id: item.productId,
          batch_id: item.batch_id, // We'll update the type to use ID
          grade: item.grade,
          quantity_boxes: item.quantityBoxes,
          quantity_m2: item.quantityM2
        });

      if (itemError) throw itemError;

      // 2b. Update Inventory Balance (Upsert logic)
      const multiplier = tx.type === 'IN' ? 1 : -1;
      
      // Get current balance
      const { data: currentInv, error: invFetchError } = await supabase
        .from('wms_inventory')
        .select('*')
        .match({ 
          product_id: item.productId, 
          batch_id: item.batch_id, 
          grade: item.grade 
        })
        .single();

      if (invFetchError && invFetchError.code !== 'PGRST116') throw invFetchError;

      const newQtyBoxes = (currentInv?.quantity_boxes || 0) + (item.quantityBoxes * multiplier);
      const newQtyM2 = (currentInv?.quantity_m2 || 0) + (item.quantityM2 * multiplier);

      const { error: invUpsertError } = await supabase
        .from('wms_inventory')
        .upsert({
          id: currentInv?.id || undefined, // use existing id for update
          product_id: item.productId,
          batch_id: item.batch_id,
          grade: item.grade,
          quantity_boxes: newQtyBoxes,
          quantity_m2: newQtyM2,
          updated_at: new Date().toISOString()
        });

      if (invUpsertError) throw invUpsertError;
    }

    return txData;
  }
};
