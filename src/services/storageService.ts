import { supabase } from '../lib/supabaseClient';

export const storageService = {
  uploadFile: async (file: File, bucket: string = 'plans') => {
    // Helper to sanitize filename (remove Vietnamese accents and special chars)
    const sanitize = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9._-]/g, '_'); // replace non-alphanumeric with _
    };

    // 1. Create a unique path with a timestamp to avoid name collisions
    const fileName = `${Date.now()}_${sanitize(file.name)}`;
    const filePath = `${fileName}`; // direct path in bucket to avoid folder issues for now

    // 2. Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase Upload Error:', error);
      throw error;
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      id: data.id,
      path: data.path,
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: file.type
    };
  },

  deleteFile: async (path: string, bucket: string = 'plans') => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Supabase Delete Error:', error);
      throw error;
    }
  }
};
