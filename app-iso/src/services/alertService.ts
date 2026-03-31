import type { ISODocument, ISOCertificate, ISOAlert } from '../types';

export const alertService = {
  calculateAlerts(documents: ISODocument[], certificates: ISOCertificate[]): ISOAlert[] {
    const alerts: ISOAlert[] = [];
    const now = new Date();

    // 1. Process Certificates
    certificates.forEach(cert => {
      const expiry = new Date(cert.expiry_date);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        alerts.push({
          id: `cert-expired-${cert.id}`,
          related_id: cert.id,
          target_type: 'Certificate',
          alert_type: 'Expiry',
          priority: 'Danger',
          message: `Chứng nhận ${cert.name} đã hết hiệu lực!`,
          is_resolved: false,
          created_at: new Date().toISOString()
        });
      } else if (diffDays < 30) {
        alerts.push({
          id: `cert-danger-${cert.id}`,
          related_id: cert.id,
          target_type: 'Certificate',
          alert_type: 'Expiry',
          priority: 'Danger',
          message: `Chứng nhận ${cert.name} sắp hết hạn trong 30 ngày tới.`,
          is_resolved: false,
          created_at: new Date().toISOString()
        });
      } else if (diffDays < 60) {
        alerts.push({
          id: `cert-warning-${cert.id}`,
          related_id: cert.id,
          target_type: 'Certificate',
          alert_type: 'Expiry',
          priority: 'Warning',
          message: `Chứng nhận ${cert.name} sắp hết hạn trong 60 ngày tới.`,
          is_resolved: false,
          created_at: new Date().toISOString()
        });
      }
    });

    // 2. Process Documents
    documents.forEach(doc => {
      if (!doc.next_review_date) return;
      const reviewDate = new Date(doc.next_review_date);
      const diffDays = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        alerts.push({
          id: `doc-overdue-${doc.id}`,
          related_id: doc.id,
          target_type: 'Document',
          alert_type: 'Review',
          priority: 'Danger',
          message: `Tài liệu ${doc.code} đã quá hạn rà soát định kỳ.`,
          is_resolved: false,
          created_at: new Date().toISOString()
        });
      } else if (diffDays < 30) {
         alerts.push({
          id: `doc-warning-${doc.id}`,
          related_id: doc.id,
          target_type: 'Document',
          alert_type: 'Review',
          priority: 'Warning',
          message: `Tài liệu ${doc.code} sắp đến ngày rà soát (< 30 ngày).`,
          is_resolved: false,
          created_at: new Date().toISOString()
        });
      }
    });

    return alerts;
  }
};
