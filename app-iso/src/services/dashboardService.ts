import { supabase } from './supabaseClient';
import type { ISODocument, DepartmentStats, DashboardSummary } from '../types';

const DEPARTMENTS = [
  'Ban ISO',
  'P.TC-HC',
  'Phòng KHTH',
  'P.TK',
  'P.KT-CN',
  'PXSX',
  'PXCĐ NL',
  'P.KD'
];

export const dashboardService = {
  async getStats(): Promise<{ departments: DepartmentStats[], summary: DashboardSummary }> {
    // 1. Lấy toàn bộ tài liệu (được lọc bởi RLS tự động)
    const { data: docs, error } = await supabase
      .from('iso_documents')
      .select('*');

    if (error) throw error;
    const documents = docs as ISODocument[];

    // 2. Tính toán Summary (Tổng quát toàn công ty)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const summary: DashboardSummary = {
      total: documents.length,
      active: documents.filter(d => d.status === 'active').length,
      pending: documents.filter(d => d.status === 'under_review').length,
      expiring: documents.filter(d => {
        if (!d.next_review_date) return false;
        const reviewDate = new Date(d.next_review_date);
        return d.status === 'active' && reviewDate <= thirtyDaysFromNow && reviewDate >= now;
      }).length,
      obsolete: documents.filter(d => d.status === 'obsolete').length
    };

    // 3. Tính toán Tiles cho từng Phòng ban
    const departmentStats: DepartmentStats[] = DEPARTMENTS.map(dept => {
      const deptDocs = documents.filter(d => d.department_id === dept);
      
      const stats = {
        department_id: dept,
        total: deptDocs.length,
        active: deptDocs.filter(d => d.status === 'active').length,
        pending: deptDocs.filter(d => d.status === 'under_review').length,
        expiring: deptDocs.filter(d => {
          if (!d.next_review_date) return false;
          const reviewDate = new Date(d.next_review_date);
          return d.status === 'active' && reviewDate <= thirtyDaysFromNow;
        }).length,
        obsolete: deptDocs.filter(d => d.status === 'obsolete').length
      };

      // Xác định Status Color (Màu cảnh báo rủi ro)
      let color: 'green' | 'yellow' | 'orange' | 'red' = 'green' as const;
      if (stats.obsolete > 0) color = 'red';
      else if (stats.expiring > 0) color = 'orange';
      else if (stats.pending > 0) color = 'yellow';

      return { ...stats, status_color: color };
    });

    // 4. Sắp xếp theo mức rủi ro (Đỏ -> Cam -> Vàng -> Xanh)
    const colorPriority: Record<string, number> = { red: 0, orange: 1, yellow: 2, green: 3 };
    departmentStats.sort((a, b) => colorPriority[a.status_color] - colorPriority[b.status_color]);

    return { departments: departmentStats, summary };
  }
};
