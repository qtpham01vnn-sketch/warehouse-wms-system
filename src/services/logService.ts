import { supabase } from '../lib/supabaseClient';

export interface AuditLog {
  id?: string;
  user_id?: string;
  user_name: string;
  action: 'upload' | 'download' | 'delete' | 'view';
  doc_id?: string;
  doc_name: string;
  performedAt?: string;
}

export const logService = {
  createLog: async (log: AuditLog) => {
    const { error } = await supabase
      .from('iso_logs')
      .insert([
        {
          user_id: log.user_id,
          user_name: log.user_name,
          action: log.action,
          doc_id: log.doc_id,
          doc_name: log.doc_name,
          performedAt: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error creating audit log:', error);
      // We don't throw here to avoid blocking the main UI actions if logging fails
    }
  },

  getLogs: async (limit = 50) => {
    const { data, error } = await supabase
      .from('iso_logs')
      .select('*')
      .order('performedAt', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
