import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const equipmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('equipment')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select('*, categories(*), maintenance_logs(*), repair_requests(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('equipment')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    return data;
  }
};
