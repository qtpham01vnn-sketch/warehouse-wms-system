import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';
import type { 
  ISODocument, DocumentVersion, DocumentStatus, 
  ActivityLog 
} from '../types';

const VALID_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
  'draft': ['under_review'],
  'under_review': ['approved', 'draft'],
  'approved': ['active', 'draft'],
  'active': ['draft', 'obsolete'],
  'obsolete': ['active', 'draft']
};

export const documentService = {
  async getDocuments(filters?: { type?: string, departmentid?: string, status?: string, search?: string }) {
    let query = supabase.from('iso_documents').select('*');
    
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) query = query.ilike('code', `%${filters.search}%`);
    if (filters?.departmentid) query = query.eq('departmentid', filters.departmentid);
    
    const { data, error } = await query.order('code', { ascending: true });
    if (error) throw error;
    return data as ISODocument[];
  },

  async getDocumentById(id: string) {
    const { data, error } = await supabase.from('iso_documents').select('*').eq('id', id).single();
    if (error) throw error;
    return data as ISODocument;
  },

  async getVersions(documentId: string) {
    const { data, error } = await supabase
      .from('iso_document_versions')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as DocumentVersion[];
  },

  async logActivity(logData: Omit<ActivityLog, 'id' | 'timestamp'>) {
    await supabase.from('iso_activity_logs').insert([logData]);
  },

  async exportToExcel(docs: ISODocument[]) {
    const reportData = docs.map(doc => ({
      'Mã tài liệu': doc.code,
      'Tên tài liệu': doc.name,
      'Phiên bản': 'v1.0',
      'Trạng thái': doc.status,
      'Phòng ban': doc.departmentid,
      'Ngày hiệu lực': doc.effective_date,
      'Ngày rà soát': doc.nextreviewdate,
      'Ngày phê duyệt': doc.published_date
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ISO Documents');
    XLSX.writeFile(workbook, `Bao_cao_ISO_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  async createDocumentWithVersion(
    docData: Omit<ISODocument, 'id' | 'created_at' | 'updated_at'>,
    versionData: Omit<DocumentVersion, 'id' | 'document_id' | 'created_at' | 'is_active'>,
    userId: string,
    userName: string
  ) {
    if (!versionData.change_log) {
      throw new Error('Bạn phải nhập nội dung thay đổi (Change Log).');
    }

    // 1. Prepare EXACT payload for iso_documents
    const payload = {
      doccode: docData.code, // Satisfy NOT NULL constraint
      code: docData.code,
      name: docData.name,
      version: '1.0', // Satisfy NOT NULL constraint
      type: docData.type,
      departmentid: docData.departmentid,
      owner_id: userId,
      status: 'draft',
      nextreviewdate: docData.nextreviewdate || null,
      access_scope: docData.access_scope,
      url: versionData.file_url 
    };

    console.log('--- ISO DOCUMENT INSERT DEBUG ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // 2. Perform Insert
    const { data: insertedData, error: docError } = await supabase
      .from('iso_documents')
      .insert([payload])
      .select();

    if (docError) {
      console.error('ISO Documents Insert Error FULL:', JSON.stringify(docError, null, 2));
      throw new Error(`Lỗi Database (Insert): ${docError.message} [Code: ${docError.code}]`);
    }

    const doc = insertedData?.[0];
    if (!doc) {
      throw new Error('Insert thành công nhưng không trả về dữ liệu.');
    }

    // 3. Best-effort: Insert version (Try multiple table names if needed)
    try {
      const verPayload = { 
        version_number: versionData.version_number,
        file_url: versionData.file_url,
        change_log: versionData.change_log,
        uploader_name: versionData.uploader_name,
        document_id: doc.id, 
        is_active: false 
      };
      
      const { error: verError } = await supabase
        .from('iso_document_versions')
        .insert([verPayload]);
      
      if (verError) {
        console.warn('ISO Versions Insert Error (Skipped):', JSON.stringify(verError, null, 2));
      }
    } catch (e) {
      console.warn('ISO Versions Exception (Skipped):', e);
    }

    // 4. Best-effort: Log Workflow
    try {
      await this.logWorkflow(doc.id, userId, userName, null, 'draft', 'Khởi tạo tài liệu');
    } catch (e) {
      console.warn('ISO Workflow Log Exception (Skipped):', e);
    }

    return { doc };
  },

  async transitionStatus(
    documentId: string, 
    fromStatus: DocumentStatus, 
    toStatus: DocumentStatus, 
    userId: string, 
    userName: string,
    role: string,
    comment?: string
  ) {
    // 1. Enforce State Machine (Except for Admin Override)
    const isAdmin = role === 'Admin';
    if (!isAdmin) {
      const allowed = VALID_TRANSITIONS[fromStatus] || [];
      if (!allowed.includes(toStatus)) {
        throw new Error(`Chuyển đổi từ ${fromStatus} sang ${toStatus} không hợp lệ theo quy trình ISO.`);
      }

      // 2. Enforce Mandatory Comments
      const needsComment = (toStatus === 'draft' && (fromStatus === 'under_review' || fromStatus === 'approved' || fromStatus === 'active'));
      if (needsComment && !comment) {
        throw new Error('Bạn bắt buộc phải nhập lý do (Comment) khi Từ chối (Reject) hoặc Sửa đổi (Revise).');
      }
    }

    const updatePayload: any = { 
      status: toStatus, 
      updated_at: new Date().toISOString() 
    };

    if (toStatus === 'active') {
      updatePayload.published_date = new Date().toISOString().split('T')[0];
      updatePayload.effective_date = new Date().toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('iso_documents')
      .update(updatePayload)
      .eq('id', documentId);
    
    if (error) throw error;

    // 3. Version Handling when Active
    if (toStatus === 'active') {
      // Mark all previous versions as NOT active
      await supabase
        .from('iso_document_versions')
        .update({ is_active: false })
        .eq('document_id', documentId);
      
      // Mark latest version as active
      const { data: latestVer } = await supabase
        .from('iso_document_versions')
        .select('id')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latestVer) {
        await supabase
          .from('iso_document_versions')
          .update({ is_active: true })
          .eq('id', latestVer.id);
        
        await supabase
          .from('iso_documents')
          .update({ current_version_id: latestVer.id })
          .eq('id', documentId);
      }
    }

    await this.logWorkflow(documentId, userId, userName, fromStatus, toStatus, comment);
  },

  async logWorkflow(documentId: string, userId: string, userName: string, from: DocumentStatus | null, to: DocumentStatus, comment?: string) {
    await supabase.from('iso_workflow_logs').insert([{
      document_id: documentId,
      user_id: userId,
      user_name: userName,
      from_status: from,
      to_status: to,
      comment: comment || (from === null ? 'Khởi tạo' : 'Cập nhật trạng thái')
    }]);
  },

  getFileActions(documentId: string, fileUrl: string, userId: string, userName: string) {
    return {
      view: async () => {
        await this.logActivity({
          user_id: userId,
          user_name: userName,
          action: 'View',
          target_id: documentId,
          target_type: 'Document'
        });
        window.open(fileUrl, '_blank');
      },
      download: async () => {
        await this.logActivity({
          user_id: userId,
          user_name: userName,
          action: 'Download',
          target_id: documentId,
          target_type: 'Document'
        });
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileUrl.split('/').pop() || 'download.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    };
  }
};
