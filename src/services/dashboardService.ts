import { supabase } from '../lib/supabaseClient';
import { isBefore, addDays, parseISO, startOfMonth } from 'date-fns';

export interface ISOMetrics {
  totalDocs: number;
  activeDocs: number;
  obsoleteDocs: number;
  nearExpiryDocs: number;
  overdueDocs: number;
  monthlyActivity: number;
}

export interface ISOChartData {
  name: string;
  value: number;
  color: string;
}

export interface ExpiryAlert {
  id: string;
  name: string;
  docCode: string;
  type: 'overdue' | 'upcoming';
  date: string;
}

export const dashboardService = {
  /**
   * Lấy các chỉ số KPI thực tế từ Supabase
   */
  getISOMetrics: async (): Promise<ISOMetrics> => {
    const { data: docs, error } = await supabase
      .from('iso_documents')
      .select('nextReviewDate, status, isCurrent, uploadedAt');

    if (error) throw error;

    const now = new Date();
    const thirtyDaysFromNow = addDays(now, 30);
    const startOfCurrentMonth = startOfMonth(now);

    const metrics = (docs || []).reduce((acc, doc) => {
      if (!doc.isCurrent) return acc; // Chỉ tính bản hiện hành

      acc.totalDocs++;
      if (doc.status === 'active') acc.activeDocs++;
      if (doc.status === 'obsolete') acc.obsoleteDocs++;

      if (doc.nextReviewDate) {
        const reviewDate = parseISO(doc.nextReviewDate);
        if (isBefore(reviewDate, now)) {
          acc.overdueDocs++;
        } else if (isBefore(reviewDate, thirtyDaysFromNow)) {
          acc.nearExpiryDocs++;
        }
      }

      if (doc.uploadedAt && isBefore(startOfCurrentMonth, parseISO(doc.uploadedAt))) {
        acc.monthlyActivity++;
      }

      return acc;
    }, {
      totalDocs: 0,
      activeDocs: 0,
      obsoleteDocs: 0,
      nearExpiryDocs: 0,
      overdueDocs: 0,
      monthlyActivity: 0
    });

    return metrics;
  },

  /**
   * Lấy dữ liệu cơ cấu tài liệu (biểu đồ tròn)
   */
  getISOChartData: async (): Promise<ISOChartData[]> => {
    const { data, error } = await supabase
      .from('iso_documents')
      .select('isoType')
      .eq('isCurrent', true);

    if (error) throw error;

    const counts: Record<string, number> = {
      'procedure': 0,
      'form': 0,
      'instruction': 0,
      'record': 0,
      'external': 0
    };

    data?.forEach(d => {
      if (counts[d.isoType] !== undefined) {
        counts[d.isoType]++;
      }
    });

    const labels: Record<string, string> = {
      'procedure': 'Quy trình (QT)',
      'form': 'Biểu mẫu (BM)',
      'instruction': 'Hướng dẫn (HD)',
      'record': 'Hồ sơ (HS)',
      'external': 'Bên ngoài'
    };

    const colors: Record<string, string> = {
      'procedure': '#6366F1',
      'form': '#10B981',
      'instruction': '#F59E0B',
      'record': '#3B82F6',
      'external': '#94A3B8'
    };

    return Object.keys(counts).map(key => ({
      name: labels[key],
      value: counts[key],
      color: colors[key]
    }));
  },

  /**
   * Lấy danh sách cảnh báo hạn soát xét
   */
  getExpiryAlerts: async (): Promise<ExpiryAlert[]> => {
    const now = new Date().toISOString();
    const thirtyDaysFromNow = addDays(new Date(), 30).toISOString();

    const { data, error } = await supabase
      .from('iso_documents')
      .select('id, name, docCode, nextReviewDate')
      .eq('isCurrent', true)
      .not('nextReviewDate', 'is', null)
      .lte('nextReviewDate', thirtyDaysFromNow)
      .order('nextReviewDate', { ascending: true });

    if (error) throw error;

    return (data || []).map(doc => {
      const isOverdue = isBefore(parseISO(doc.nextReviewDate), new Date(now));
      return {
        id: doc.id,
        name: doc.name,
        docCode: doc.docCode,
        type: isOverdue ? 'overdue' : 'upcoming',
        date: doc.nextReviewDate
      };
    });
  },

  /**
   * Lấy lịch sử hoạt động mới nhất từ logs
   */
  getRecentActivity: async (limit = 5) => {
    const { data, error } = await supabase
      .from('iso_logs')
      .select('*')
      .order('performedAt', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(log => ({
      id: log.id,
      user: { name: log.user_name || 'Hệ thống', avatar: `https://ui-avatars.com/api/?name=${log.user_name || 'Sys'}&background=random` },
      actionText: log.action === 'upload' ? 'đã cập nhật' : log.action === 'download' ? 'đã tải về' : 'thao tác',
      targetText: log.doc_name || 'Tài liệu',
      timeText: new Date(log.performedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    }));
  }
};
