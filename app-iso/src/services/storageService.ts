import { supabase } from './supabaseClient';

export const storageService = {
  async uploadDocument(documentId: string, version: string, file: File) {
    const ext = file.name.split('.').pop();
    const path = `documents/${documentId}/${version}.${ext}`;
    const { error } = await supabase.storage
      .from('iso-files')
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('iso-files')
      .getPublicUrl(path);
      
    return publicUrl;
  },

  async uploadCertificate(certificateId: string, file: File) {
    const ext = file.name.split('.').pop();
    const path = `certificates/${certificateId}.${ext}`;
    const { error } = await supabase.storage
      .from('iso-files')
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('iso-files')
      .getPublicUrl(path);
      
    return publicUrl;
  }
};
