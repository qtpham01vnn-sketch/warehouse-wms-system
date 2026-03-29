import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { storageService } from '../../services/storageService';
import { logService } from '../../services/logService';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { Document, IsoType, DocStatus } from '../../types';
import { File, FileText, Image as ImageIcon, Download, History, Upload, FolderOpen, AlertTriangle, CheckCircle2, Clock, Search, Server, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';
import './Documents.css';

const getFileIcon = (type: string, size = 20) => {
  if (type.includes('pdf')) return <FileText size={size} className="text-error" />;
  if (type.includes('image')) return <ImageIcon size={size} className="text-primary" />;
  if (type.includes('excel') || type.includes('spreadsheet')) return <FileText size={size} className="text-success" />;
  return <File size={size} className="text-info" />;
};

const getStatusBadgeHolo = (status: DocStatus, nextReviewDate?: string) => {
  const isExpired = nextReviewDate && isBefore(new Date(nextReviewDate), new Date());
  const isNearExpiray = nextReviewDate && isBefore(new Date(nextReviewDate), addDays(new Date(), 30));

  if (status === 'obsolete') return <span className="text-[10px] font-bold tracking-widest uppercase bg-error/10 text-error border border-error/50 px-2 py-1 rounded-sm">Lỗi thời (ARCHIVED)</span>;
  if (isExpired) return <span className="text-[10px] font-bold tracking-widest uppercase bg-error/20 text-error border border-error/50 px-2 py-1 rounded-sm flex items-center gap-1"><AlertTriangle size={10} /> CRITICAL EXPIRED</span>;
  if (isNearExpiray) return <span className="text-[10px] font-bold tracking-widest uppercase bg-warning/20 text-warning border border-warning/50 px-2 py-1 rounded-sm flex items-center gap-1"><Clock size={10} /> REVIEW NEEDED</span>;
  if (status === 'active') return <span className="text-[10px] font-bold tracking-widest uppercase bg-success/10 text-success border border-success/30 px-2 py-1 rounded-sm flex items-center gap-1"><CheckCircle2 size={10} /> HÀNH LỰC</span>;
  return <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 text-muted border border-white/20 px-2 py-1 rounded-sm">{status}</span>;
};

const ISO_CATEGORIES: { id: IsoType | 'all'; label: string; code: string }[] = [
  { id: 'procedure', label: 'Quy Trình ISO', code: 'ISO-QT' },
  { id: 'form', label: 'Biểu mẫu Hành chính', code: 'ISO-BM' },
  { id: 'instruction', label: 'Hướng dẫn CV', code: 'ISO-HD' },
  { id: 'record', label: 'Hồ sơ Mã hóa', code: 'DATA-REC' },
  { id: 'external', label: 'Kết nối Ngoại tuyến', code: 'EXT-LINK' },
];

const Documents: React.FC = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Accordion state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'procedure': true,
    'form': true,
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Form states for upload
  const [uploadForm, setUploadForm] = useState({
    title: '',
    docCode: '',
    version: '',
    isoType: 'procedure' as IsoType,
    nextReviewDate: '',
    changeDescription: '', 
    departmentId: currentUser?.departmentId || 'chung'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocs();
  }, [searchTerm]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      // Fetch all docs to group them client-side for the List View
      const { data } = await documentService.getDocuments({
        category: 'all',
        searchTerm,
        page: 1,
        pageSize: 1000, 
        sortBy: 'uploadedAt',
        sortOrder: 'desc'
      });
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'director';

  const handleDownload = async (doc: Document) => {
    await logService.createLog({
      user_id: currentUser?.id,
      user_name: currentUser?.name || 'Unknown',
      action: 'download',
      doc_id: doc.id,
      doc_name: doc.name
    });
    window.open(doc.url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadForm.title) {
        setUploadForm(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.docCode || !uploadForm.version || !uploadForm.changeDescription) {
      alert('Vui lòng nhập đầy đủ thông tin mã hóa, đặc biệt là Security Logs (Lý do thay đổi).');
      return;
    }

    setUploading(true);
    try {
      let fileUrl = '#';
      let fileSize = 0;
      let fileType = 'application/pdf';

      if (selectedFile) {
        const uploadResult = await storageService.uploadFile(selectedFile, 'iso-documents');
        fileUrl = uploadResult.url;
        fileSize = uploadResult.size;
        fileType = uploadResult.type;
      }

      const newDoc: Document = {
         id: `doc_${Date.now()}`,
         name: uploadForm.title || selectedFile?.name || 'Untitled Document',
         docCode: uploadForm.docCode,
         isoType: uploadForm.isoType,
         type: fileType,
         size: fileSize,
         departmentId: uploadForm.departmentId,
         uploadedBy: currentUser?.name || 'Admin',
         uploadedAt: new Date().toISOString(),
         url: fileUrl,
         currentVersion: uploadForm.version,
         changeDescription: uploadForm.changeDescription,
         versions: [],
         nextReviewDate: uploadForm.nextReviewDate || undefined,
         status: 'active',
         isCurrent: true
      };

      await documentService.saveDocument(newDoc);
      
      await logService.createLog({
        user_id: currentUser?.id,
        user_name: currentUser?.name || 'Admin',
        action: 'upload',
        doc_id: newDoc.id,
        doc_name: newDoc.name
      });
      
      await fetchDocs();
      setShowUpload(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Tải lên thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Grouping logic for Hybrid List View
  const groupedDocs: Record<string, Document[]> = {};
  ISO_CATEGORIES.forEach(cat => {
    if (cat.id !== 'all') groupedDocs[cat.id] = [];
  });
  
  documents.forEach(doc => {
    if (groupedDocs[doc.isoType]) {
      groupedDocs[doc.isoType].push(doc);
    } else {
      // Fallback
      if (!groupedDocs['external']) groupedDocs['external'] = [];
      groupedDocs['external'].push(doc);
    }
  });

  return (
    <div className="documents-page animate-fade-in relative h-full flex flex-col pt-2">
       <div className="page-header mb-8 pl-2 w-full flex-between">
        <div>
          <h1 className="page-title text-gradient">Quản lý Tài liệu ISO (Hybrid List)</h1>
          <p className="text-muted mt-2 text-sm font-mono">Tất cả tài liệu được tổ chức theo chuyên mục và luồng kế hoạch.</p>
        </div>
        <div className="flex gap-4 pr-4">
           <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
            <input 
               type="text" 
               className="bg-[#161625] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:border-primary focus:shadow-[0_0_15px_rgba(236,72,153,0.3)] outline-none min-w-[300px] transition-all font-medium"
               placeholder="Tìm kiếm tài liệu, mã hiệu..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button className="btn bg-primary/20 text-white hover:bg-primary border border-primary/50 shadow-[0_0_20px_rgba(236,72,153,0.3)] rounded-xl px-6 font-bold flex items-center gap-2 transition-all" onClick={() => setShowUpload(true)}>
              <Upload size={18} /> UPLOAD MỚI
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 pr-4 pl-2 custom-scrollbar space-y-6">
         {loading ? (
             <div className="flex-center py-20 bg-white/5 rounded-[24px] border border-white/10">
               <div className="relative flex-center">
                  <div className="w-16 h-16 border-[3px] border-primary border-t-transparent rounded-full animate-spin absolute" />
                  <Server size={24} className="text-primary animate-pulse" />
               </div>
             </div>
          ) : documents.length === 0 ? (
             <div className="flex-center py-20 bg-white/5 rounded-[24px] border border-white/10 flex-col opacity-60">
                 <FolderOpen size={48} className="text-muted mb-4" />
                 <h3 className="text-lg font-bold font-mono tracking-widest text-muted">404 NOT FOUND</h3>
             </div>
          ) : (
             ISO_CATEGORIES.filter(c => c.id !== 'all').map(category => {
               const groupDocs = groupedDocs[category.id as string] || [];
               if (groupDocs.length === 0 && searchTerm) return null; // Hide empty if searching

               const isExpanded = expandedGroups[category.id as string];

               return (
                 <div key={category.id} className="glass-panel overflow-hidden border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    {/* Header Row (Accordion Toggle) */}
                    <div 
                      className="flex items-center gap-3 p-4 bg-black/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
                      onClick={() => toggleGroup(category.id as string)}
                    >
                       <div className="text-primary">
                         {isExpanded ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                       </div>
                       <FolderOpen size={18} className="text-muted" />
                       <h3 className="font-bold text-white text-base tracking-wide flex-1">{category.label}</h3>
                       <span className="text-[10px] bg-white/10 text-muted px-2 py-1 rounded-md font-mono">{groupDocs.length} Tài liệu</span>
                    </div>

                    {/* Content List */}
                    {isExpanded && (
                      <div className="divide-y divide-white/5">
                        {groupDocs.length === 0 ? (
                           <div className="p-6 text-center text-muted italic text-sm">Chưa có tài liệu trong chuyên mục này.</div>
                        ) : (
                          groupDocs.map(doc => (
                            <div key={doc.id} className="flex items-center p-4 hover:bg-white/5 transition-colors group">
                              
                              <div className="w-8 h-8 rounded shrink-0 bg-black/50 border border-white/5 flex-center mr-4 group-hover:scale-110 transition-transform">
                                {getFileIcon(doc.type)}
                              </div>

                              <div className="flex-1 min-w-0 pr-4">
                                <h4 className="font-bold text-white text-sm mb-1 truncate group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleDownload(doc)}>
                                  {doc.name}
                                </h4>
                                <div className="flex items-center gap-3 text-[10px] text-muted font-mono uppercase">
                                  <span>{doc.docCode}</span>
                                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                  <span className="text-info">v{doc.currentVersion}</span>
                                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                  <span>{format(new Date(doc.uploadedAt), 'yyyy-MM-dd')}</span>
                                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                  <span>Own: {doc.departmentId}</span>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-4">
                                 {getStatusBadgeHolo(doc.status, doc.nextReviewDate)}
                                 
                                 <div className="flex gap-2">
                                    <button 
                                      className="btn w-8 h-8 rounded-lg flex-center bg-white/5 text-muted hover:text-white border border-white/10 hover:bg-white/20 transition-all"
                                      title="Lịch sử Audit"
                                      onClick={(e) => { e.stopPropagation(); setSelectedDocForHistory(doc); }}
                                    >
                                      <History size={14}/>
                                    </button>
                                    <button 
                                      className="btn w-8 h-8 rounded-lg flex-center bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-[0_0_10px_rgba(99,102,241,0) hover:shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                                      title="Tải xuống"
                                      onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                                    >
                                      <Download size={14} className="group-hover:animate-bounce"/>
                                    </button>
                                 </div>
                              </div>

                            </div>
                          ))
                        )}
                      </div>
                    )}
                 </div>
               );
             })
          )}
      </div>

      {/* Hologram Upload Modal */}
      {showUpload && (
        <div className="modal-overlay z-50 fixed inset-0 flex-center bg-black/80 backdrop-blur-md" onClick={() => setShowUpload(false)}>
           <div className="modal-content glass-panel p-8 max-w-2xl w-full animate-slide-up border-primary/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] rounded-[32px] relative overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[80px] pointer-events-none rounded-full"></div>
             
             <div className="flex-between mb-8 relative z-10">
               <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <Upload size={24} className="text-primary drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"/>
                    {uploadForm.docCode ? 'Cập Nhật / Vá Lỗi Hệ Thống' : 'Mã Hóa Tài Liệu (ISO Upload)'}
                  </h3>
                  <p className="text-sm text-primary mt-1 font-mono tracking-widest uppercase">Secured Transmission Protocol v4.0</p>
               </div>
               <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors" onClick={() => setShowUpload(false)}>✕</button>
             </div>
             
             <form onSubmit={handleUpload} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Mã Hiệu Bảo Mật</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#161625] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary focus:shadow-[0_0_15px_rgba(236,72,153,0.2)] outline-none transition-all font-mono"
                      placeholder="VD: QT-ISO-01"
                      value={uploadForm.docCode}
                      onChange={e => setUploadForm({...uploadForm, docCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Phiên Bản (Patch Ver)</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#161625] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary focus:shadow-[0_0_15px_rgba(236,72,153,0.2)] outline-none transition-all font-mono"
                      placeholder="VD: v2.0-hotfix"
                      value={uploadForm.version}
                      onChange={e => setUploadForm({...uploadForm, version: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Cấu Trúc Định Danh (Tên Tài Liệu)</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#161625] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary focus:shadow-[0_0_15px_rgba(236,72,153,0.2)] outline-none transition-all font-bold"
                    placeholder="VD: Quy trình Vận hành Trạm Rada..."
                    value={uploadForm.title}
                    onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="text-[10px] font-bold text-warning uppercase tracking-widest mb-2 flex justify-between">
                    Security Logs (Nội dung chỉnh sửa) <AlertTriangle size={12}/>
                  </label>
                  <textarea 
                    className="w-full bg-[#161625] border border-warning/30 rounded-xl p-4 text-sm text-white focus:border-warning focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] outline-none transition-all min-h-[80px]"
                    placeholder="Lý do cập nhật phiên bản, xóa/sửa đổi điều lệ nào..."
                    value={uploadForm.changeDescription}
                    onChange={e => setUploadForm({...uploadForm, changeDescription: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="form-group">
                     <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Chủng Loại Data</label>
                     <select 
                       className="w-full bg-[#161625] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                       value={uploadForm.isoType}
                       onChange={e => setUploadForm({...uploadForm, isoType: e.target.value as IsoType})}
                     >
                       {ISO_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                         <option key={c.id} value={c.id}>{c.label} ({c.code})</option>
                       ))}
                     </select>
                  </div>
                  <div className="form-group">
                     <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 block">Quét Lại (Next Scan)</label>
                     <input 
                       type="date" 
                       className="w-full bg-[#161625] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none transition-all cursor-pointer font-mono"
                       value={uploadForm.nextReviewDate}
                       onChange={e => setUploadForm({...uploadForm, nextReviewDate: e.target.value})}
                     />
                  </div>
                </div>

                <div 
                  className="upload-zone py-8 bg-[#161625] border-2 border-dashed border-primary/40 rounded-2xl text-center cursor-pointer hover:border-primary hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                    />
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                       <Upload size={32} className={`${selectedFile ? 'text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'text-primary drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]'} transition-colors`} />
                    </div>
                    <p className={`font-bold text-base mb-2 tracking-wide ${selectedFile ? 'text-success' : 'text-white'}`}>
                      {selectedFile ? selectedFile.name : 'Chèn Lõi Năng Lượng (File)'}
                    </p>
                    <p className="text-[10px] text-muted font-mono tracking-widest">
                      {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB KHẢ DỤNG` : 'TRUYỀN TẢI TỐI ĐA 50MB (PDF/DOCX/XLSX)'}
                    </p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button type="button" className="btn bg-[#161625] text-white hover:bg-white/10 border border-white/10 px-8 rounded-xl font-bold" onClick={() => setShowUpload(false)} disabled={uploading}>Hủy Cấp Quyền</button>
                  <button type="submit" className="btn bg-primary text-white hover:bg-primary/80 shadow-[0_0_20px_rgba(236,72,153,0.5)] px-10 rounded-xl font-bold tracking-wide" disabled={uploading}>
                    {uploading ? (
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         ĐANG UPLOADING...
                      </div>
                    ) : (
                      'EXECUTE UPLOAD LÊN MÁY CHỦ'
                    )}
                  </button>
                </div>
             </form>
           </div>
        </div>
      )}

      {/* Audit Trail Terminal Modal */}
      {selectedDocForHistory && (
        <div className="modal-overlay z-50 fixed inset-0 flex-center bg-black/80 backdrop-blur-md" onClick={() => setSelectedDocForHistory(null)}>
           <div className="modal-content !bg-[#0f0f13] border border-white/10 p-8 max-w-3xl w-full animate-slide-up rounded-2xl shadow-[-20px_20px_50px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
              <div className="flex-between mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-lg bg-black/50 border border-white/10 flex-center text-muted font-mono"><History size={24}/></div>
                   <div>
                     <h3 className="text-xl font-bold text-white tracking-widest uppercase mb-1">Audit Trail History</h3>
                     <p className="text-sm font-mono text-primary">{selectedDocForHistory.docCode}</p>
                   </div>
                </div>
                <button className="w-10 h-10 rounded-full flex-center bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-muted hover:text-white" onClick={() => setSelectedDocForHistory(null)}>✕</button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {documents
                  .filter(d => d.docCode === selectedDocForHistory.docCode)
                  .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
                  .map((v, index) => (
                    <div 
                      key={v.id} 
                      className={`p-5 rounded-xl border flex-between transition-all font-mono relative overflow-hidden ${v.isCurrent ? 'bg-success/5 border-success/30 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                    >
                      {v.isCurrent && <div className="absolute top-0 left-0 w-1 h-full bg-success shadow-[0_0_10px_var(--color-success)]"></div>}
                      
                      <div className="flex items-center gap-5">
                        <div className="text-4xl font-black text-white/5 w-12 text-center">{(index + 1).toString().padStart(2, '0')}</div>
                        <div>
                          <p className="font-bold flex items-center gap-3 text-sm mb-2 text-white">
                            VERSION {v.currentVersion} 
                            {v.isCurrent && <span className="text-[10px] bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded tracking-widest"><CheckCircle2 size={10} className="inline mr-1"/> HÀNH LỰC</span>}
                            {!v.isCurrent && <span className="text-[10px] bg-white/5 text-muted border border-white/10 px-2 py-0.5 rounded tracking-widest opacity-60">LỖI THỜI</span>}
                          </p>
                          <div className="flex flex-col gap-1">
                             <p className="text-[10px] text-muted">Author: <span className="text-white/80">{v.uploadedBy}</span></p>
                             <p className="text-[10px] text-muted">Time: {format(new Date(v.uploadedAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                             <p className="text-[10px] text-muted">Log: <span className="text-warning italic">{v.changeDescription || 'Khởi tạo bản nháp đầu tiên'}</span></p>
                          </div>
                        </div>
                      </div>
                      <button className={`w-12 h-12 rounded-xl flex-center border transition-all ${v.isCurrent ? 'bg-success/10 border-success/30 text-success hover:bg-success hover:text-white' : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/20'}`} title="Tải xuống Bản sao này" onClick={() => handleDownload(v)}>
                         <Download size={20} />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 text-[10px] uppercase font-mono text-muted">
                 <ShieldCheck size={14} className="text-success" />
                 <span>Các phiên bản cũ được lưu trữ mã hóa tuyệt mật, phục vụ mục đích tra cứu và Audit từ Tổ trưởng ISO.</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
