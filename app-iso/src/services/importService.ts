import JSZip from 'jszip';
import { supabase } from './supabaseClient';

export interface ZipFileEntry {
  name: string;
  prefix: string;
  code: string;
  extension: string;
  blob: Blob;
  status: 'valid' | 'invalid' | 'duplicate';
  error?: string;
  fileCode: string; // Standardized code (e.g., BM.09.08.01)
  displayName: string; // Human-readable name extracted from filename
  originalFilename: string; // Original basename for reference
}

export interface ImportValidationResult {
  isValid: boolean;
  files: ZipFileEntry[];
  qtFile?: ZipFileEntry;
  errors: string[];
}

export const importService = {
  async parseZip(file: File): Promise<ImportValidationResult> {
    const zip = await JSZip.loadAsync(file);
    const files: ZipFileEntry[] = [];
    const errors: string[] = [];
    const codes = new Set<string>();
    let qtCount = 0;

    const entries = Object.keys(zip.files).filter(name => !zip.files[name].dir);

    for (const name of entries) {
      const zipEntry = zip.files[name];
      const blob = await zipEntry.async('blob');
      
      // V4: Extract basename to support nested folders (supports both / and \)
      const basename = name.split(/[/\\]/).pop() || '';
      
      // V8: Highly Flexible Regex (Prefix, Separator, Code, Description)
      // Handles 'BM 09.08.01', 'QT.09.01', 'BM-09-08-01'
      const match = basename.match(/^([A-Z]+)[\.\s\-_]+([0-9\.]+)[\.\s\-_]*(.*)\.(pdf|docx|xlsx|doc)$/i);
      
      if (!match) {
        files.push({
          name,
          prefix: '',
          code: '',
          extension: basename.split('.').pop() || '',
          blob,
          status: 'invalid',
          error: 'Sai định dạng naming (VD: QT.09.01 ... hoặc BM 09.08.01 ...)',
          fileCode: '',
          displayName: basename,
          originalFilename: basename
        });
        continue;
      }

      const prefix = match[1].toUpperCase();
      const code = match[2]; // Captures correctly dots/numbers
      const rawDescription = match[3] || '';
      const extension = match[4];
      const standardizedCode = `${prefix}.${code}`;

      // V6: Extract human-readable name from description part
      let displayName = rawDescription
        .replace(/^[\s\-_]+/, '') // Remove leading separators
        .replace(/\s+/g, ' ')      // Collapse whitespace
        .trim();
        
      // Ensure displayName isn't empty or just repeating the prefix
      if (!displayName || displayName.toUpperCase() === prefix) {
         displayName = standardizedCode;
      }

      if (codes.has(standardizedCode)) {
        files.push({
          name,
          prefix,
          code,
          extension,
          blob,
          status: 'duplicate',
          error: `Trùng mã hiệu: ${standardizedCode}`,
          fileCode: standardizedCode,
          displayName,
          originalFilename: basename
        });
        continue;
      }

      codes.add(standardizedCode);
      if (prefix === 'QT') qtCount++;

      files.push({
        name,
        prefix,
        code,
        extension,
        blob,
        status: 'valid',
        fileCode: standardizedCode,
        displayName,
        originalFilename: basename
      });
    }

    const qtFile = files.find(f => f.prefix === 'QT' && f.status === 'valid');

    // V4: Explicit error messages
    if (qtCount === 0) {
      errors.push('Thiếu file Quy trình (QT.) trong gói ZIP.');
    } else if (qtCount > 1) {
      errors.push('ZIP này có 2 file QT, vui lòng tách thành 2 gói riêng.');
    }

    if (files.some(f => f.status !== 'valid')) {
      errors.push('Còn file không hợp lệ hoặc bị lỗi định dạng.');
    }

    return {
      isValid: errors.length === 0,
      files,
      qtFile,
      errors
    };
  },

  async executeImport(
    validation: ImportValidationResult, 
    userId: string, 
    _userName: string,
    departmentId: string,
    onProgress: (percent: number, status: string) => void
  ) {
    if (!validation.isValid || !validation.qtFile) {
      throw new Error('Dữ liệu không hợp lệ để thực hiện import.');
    }

    const import_batch_id = crypto.randomUUID();
    const qtCode = validation.qtFile.code;
    const validFiles = validation.files.filter(f => f.status === 'valid');
    const totalToUpload = validFiles.length;
    let uploadedCount = 0;
    
    let createdDocId: string | null = null;
    const uploadedPaths: string[] = [];

    onProgress(5, `Khởi tạo Batch: ${import_batch_id}`);

    try {
      onProgress(10, 'Đang tạo bản ghi Quy trình (QT)...');
      
      const docPayload: any = {
        code: validation.qtFile.fileCode,
        doccode: validation.qtFile.fileCode,
        name: validation.qtFile.displayName, 
        type: 'QT',
        isotype: 'QT',
        departmentid: departmentId,
        owner_id: userId,
        status: 'draft',
        version: '1.0',
        access_scope: 'department_only'
      };

      console.log('--- INSERTING MAIN DOCUMENT (iso_documents) ---');
      console.log('Payload:', JSON.stringify(docPayload, null, 2));

      const { data: insertedDoc, error: docError } = await supabase
        .from('iso_documents')
        .insert([docPayload])
        .select()
        .single();

      if (docError) {
        console.error('DATABASE ERROR (iso_documents):', JSON.stringify(docError, null, 2));
        throw docError;
      }
      createdDocId = insertedDoc.id;
      console.log('MAIN DOCUMENT CREATED. ID:', createdDocId);

      for (const entry of validFiles) {
        const isQT = entry.prefix === 'QT';
        const originalName = entry.name.split(/[/\\]/).pop() || entry.name;
        
        const statusMsg = `Đang tải lên ${isQT ? 'file chính' : 'file đính kèm'}: ${originalName}`;
        onProgress(10 + Math.floor((uploadedCount / totalToUpload) * 85), statusMsg);

        const safeName = this._sanitizeFileName(originalName);
        const safeDeptId = this._sanitizeFileName(departmentId);
        const safeQtCode = this._sanitizeFileName(qtCode);
        
        const storagePath = `iso-documents/${safeDeptId}/${safeQtCode}/${safeName}`;
        console.log(`--- UPLOADING FILE TO STORAGE ---`);
        console.log(`Original Name: ${originalName}`);
        console.log(`Sanitized Storage Path: ${storagePath}`);

        const fileUrl = await this._uploadFile(entry.blob, storagePath);
        uploadedPaths.push(storagePath);
        console.log(`Upload successful. URL: ${fileUrl}`);

        const filePayload = {
          document_id: createdDocId,
          file_code: entry.fileCode,
          file_name: originalName, // Display name
          file_type: entry.prefix,
          file_url: fileUrl,
          storage_path: storagePath, // Storage reference
          import_batch_id: import_batch_id
        };

        console.log(`--- INSERTING SUB-FILE (iso_document_files) ---`);
        console.log('Payload:', JSON.stringify(filePayload, null, 2));

        const { error: fileError } = await supabase
          .from('iso_document_files')
          .insert([filePayload]);

        if (fileError) {
          console.error('DATABASE ERROR (iso_document_files):', JSON.stringify(fileError, null, 2));
          throw fileError;
        }
        
        if (isQT) {
           await supabase.from('iso_documents').update({ url: fileUrl }).eq('id', createdDocId);
        }

        uploadedCount++;
      }

      onProgress(100, 'Import hoàn tất thành công!');
      return { success: true, batchId: import_batch_id, documentId: createdDocId };

    } catch (err: any) {
      console.error('CRITICAL IMPORT ERROR:', err);
      if (createdDocId) {
        await supabase.from('iso_document_files').delete().eq('import_batch_id', import_batch_id);
        await supabase.from('iso_documents').delete().eq('id', createdDocId);
      }
      const failMsg = `Lỗi Import. Đã rollback database. Storage cần xóa: ${uploadedPaths.join(', ')}`;
      onProgress(-1, failMsg);
      throw new Error(err.message);
    }
  },

  _sanitizeFileName(name: string): string {
    const lastDot = name.lastIndexOf('.');
    const base = lastDot >= 0 ? name.slice(0, lastDot) : name;
    const ext = lastDot >= 0 ? name.slice(lastDot).toLowerCase() : '';

    const noAccent = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const safe = noAccent
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `${safe}${ext}`;
  },

  async _uploadFile(blob: Blob, path: string): Promise<string> {
    const { error } = await supabase.storage
      .from('iso-files')
      .upload(path, blob, { upsert: true });
    
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('iso-files').getPublicUrl(path);
    return publicUrl;
  }
};
