import { supabase } from '../lib/supabaseClient';
import type { Document, DocStatus } from '../types';

export interface FetchDocsParams {
  category?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const documentService = {
  getDocuments: async (params: FetchDocsParams = {}): Promise<{ data: Document[], count: number }> => {
    const { category, searchTerm, page = 1, pageSize = 10, sortBy = 'uploadedAt', sortOrder = 'desc' } = params;
    
    let query = supabase
      .from('iso_documents')
      .select('*', { count: 'exact' });
    
    // Server-side Filtering
    if (category && category !== 'all') {
      query = query.eq('isoType', category);
    }

    if (searchTerm) {
      // Search in name or docCode
      query = query.or(`name.ilike.%${searchTerm}%,docCode.ilike.%${searchTerm}%`);
    }

    // Only show current versions in main list
    query = query.eq('isCurrent', true);

    // Server-side Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Server-side Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching documents from Supabase:', error);
      throw error;
    }
    return { data: (data || []) as Document[], count: count || 0 };
  },

  getDocumentsByDocCode: async (docCode: string): Promise<Document[]> => {
    const { data, error } = await supabase
      .from('iso_documents')
      .select('*')
      .eq('docCode', docCode)
      .order('uploadedAt', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Document[];
  },

  saveDocument: async (doc: Document) => {
    // 1. If this is a new version (same docCode), mark previous current as obsolete
    if (doc.isCurrent) {
      const { error: updateError } = await supabase
        .from('iso_documents')
        .update({ is_current: false, status: 'obsolete' as DocStatus })
        .eq('docCode', doc.docCode)
        .eq('is_current', true)
        .neq('id', doc.id);
        
      if (updateError) console.error('Warning: Failed to mark old versions as obsolete:', updateError);
    }

    // 2. Save current document
    const { error } = await supabase
      .from('iso_documents')
      .upsert(doc);

    if (error) {
      console.error('Error saving document to Supabase:', error);
      throw error;
    }
  },

  deleteDocument: async (id: string) => {
    const { error } = await supabase
      .from('iso_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
