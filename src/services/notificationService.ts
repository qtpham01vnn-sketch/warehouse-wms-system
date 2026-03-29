import { supabase } from '../lib/supabaseClient';

export interface ISOVideoNotification {
  id: string;
  type: 'upload' | 'expiry' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const notificationService = {
  getRecentNotifications: async (): Promise<ISOVideoNotification[]> => {
    // 1. Get recent logs
    const { data: logs, error } = await supabase
      .from('iso_logs')
      .select('*')
      .order('performedAt', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }

    // 2. Format as notifications
    const notifications = (logs || []).map(log => ({
      id: log.id,
      type: 'upload' as const,
      title: log.action === 'upload' ? 'Tài liệu mới' : 'Tài liệu được tải',
      message: `${log.user_name} ${log.action === 'upload' ? 'vừa tải lên' : 'vừa tải về'} ${log.doc_name}`,
      time: new Date(log.performedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    }));

    return notifications;
  }
};
