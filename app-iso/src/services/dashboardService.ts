import { supabase } from './supabaseClient';
import type { ISODocument, DepartmentStats, DashboardSummary } from '../types';

export const ISO_DEPARTMENTS = [
  { id: 'd2', label: 'Ban ISO' },
  { id: 'd4', label: 'P.TC-HC' },
  { id: 'd5', label: 'Phòng KHTH' },
  { id: 'd6', label: 'P.TK' },
  { id: 'd7', label: 'P.KT-CN' },
  { id: 'd8', label: 'PXSX' },
  { id: 'd9', label: 'PXCĐ NL' },
  { id: 'd10', label: 'P.KD' }
];

export interface PriorityItem {
  id: string;
  title: string;
  type: 'expiring' | 'pending' | 'overdue';
  department: string;
  dueDate?: string;
  status?: string;
}

export const dashboardService = {
  async getStats(): Promise<{ 
    departments: DepartmentStats[], 
    summary: DashboardSummary,
    priorityItems: PriorityItem[]
  }> {
    // 1. Lấy toàn bộ tài liệu
    const { data: docs, error } = await supabase
      .from('iso_documents')
      .select('*');

    if (error) throw error;
    const documents = docs as ISODocument[];

    // 2. Tính toán Summary
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const summary: DashboardSummary = {
      total: documents.length,
      active: documents.filter(d => d.status === 'active').length,
      pending: documents.filter(d => d.status === 'under_review').length,
      expiring: documents.filter(d => {
        if (!d.nextreviewdate || d.status !== 'active') return false;
        const reviewDate = new Date(d.nextreviewdate);
        return reviewDate <= thirtyDaysFromNow && reviewDate >= now;
      }).length,
      obsolete: documents.filter(d => d.status === 'obsolete').length
    };

    // 3. Tính toán cho 8 phòng ban chính (ISO_DEPARTMENTS)
    const departmentStats: DepartmentStats[] = ISO_DEPARTMENTS.map(dept => {
      const deptDocs = documents.filter(d => d.departmentid === dept.id);
      
      const stats = {
        department_id: dept.id,
        department_name: dept.label, // Added to match interface
        total: deptDocs.length,
        active: deptDocs.filter(d => d.status === 'active').length,
        pending: deptDocs.filter(d => d.status === 'under_review').length,
        expiring: deptDocs.filter(d => {
          if (!d.nextreviewdate || d.status !== 'active') return false;
          const reviewDate = new Date(d.nextreviewdate);
          return reviewDate <= thirtyDaysFromNow && reviewDate >= now;
        }).length,
        obsolete: deptDocs.filter(d => d.status === 'obsolete').length,
        overdue: deptDocs.filter(d => {
          if (!d.nextreviewdate || d.status !== 'active') return false;
          const reviewDate = new Date(d.nextreviewdate);
          return reviewDate < now;
        }).length
      };

      let color: 'green' | 'yellow' | 'orange' | 'red' = 'green' as const;
      if (stats.overdue > 0) color = 'red';
      else if (stats.expiring > 0 || stats.pending > 0) color = 'orange';

      // Type-safe Return to match DepartmentStats
      return { 
        department_id: stats.department_id,
        department_name: stats.department_name,
        total: stats.total,
        active: stats.active,
        pending: stats.pending,
        expiring: stats.expiring,
        obsolete: stats.obsolete,
        status_color: color 
      };
    });

    // 5. Danh sách ưu tiên trích xuất từ raw documents
    const overdueItems = documents
      .filter(d => d.nextreviewdate && d.status === 'active' && new Date(d.nextreviewdate) < now)
      .map(d => ({
        id: d.id,
        title: d.name, // Dùng name từ schema
        type: 'overdue' as const,
        department: ISO_DEPARTMENTS.find(dept => dept.id === d.departmentid)?.label || d.departmentid,
        dueDate: d.nextreviewdate
      }));

    const expiringItems = documents
      .filter(d => d.nextreviewdate && d.status === 'active' && new Date(d.nextreviewdate) <= thirtyDaysFromNow && new Date(d.nextreviewdate) >= now)
      .map(d => ({
        id: d.id,
        title: d.name, // Dùng name từ schema
        type: 'expiring' as const,
        department: ISO_DEPARTMENTS.find(dept => dept.id === d.departmentid)?.label || d.departmentid,
        dueDate: d.nextreviewdate
      }));

    const pendingItems = documents
      .filter(d => d.status === 'under_review')
      .map(d => ({
        id: d.id,
        title: d.name, // Dùng name từ schema
        type: 'pending' as const,
        department: ISO_DEPARTMENTS.find(dept => dept.id === d.departmentid)?.label || d.departmentid,
        status: 'Chờ duyệt'
      }));

    const priorityItems: PriorityItem[] = [
      ...overdueItems,
      ...expiringItems,
      ...pendingItems
    ].slice(0, 6);

    return { departments: departmentStats, summary, priorityItems };
  }
};
