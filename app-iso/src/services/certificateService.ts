import { supabase } from './supabaseClient';
import type { ISOCertificate } from '../types';

export const certificateService = {
  async getCertificates() {
    const { data, error } = await supabase
      .from('iso_certificates')
      .select('*')
      .order('expiry_date', { ascending: true });
    if (error) throw error;
    return data as ISOCertificate[];
  },

  async addCertificate(certData: Omit<ISOCertificate, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('iso_certificates')
      .insert([certData])
      .select()
      .single();
    if (error) throw error;
    return data as ISOCertificate;
  },

  async updateCertificate(id: string, updates: Partial<ISOCertificate>) {
    const { error } = await supabase
      .from('iso_certificates')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  getCertificateActions(fileUrl: string) {
    return {
      view: () => window.open(fileUrl, '_blank'),
      download: async () => {
        if (!fileUrl) return;
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileUrl.split('/').pop() || 'certificate.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    };
  }
};
