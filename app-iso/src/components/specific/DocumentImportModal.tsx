import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileArchive, AlertTriangle, CheckCircle2, 
  XCircle, Loader2, UploadCloud, 
  Box, FileText, UserPlus, Calendar, ShieldCheck
} from 'lucide-react';
import type { ImportValidationResult } from '../../services/importService';
import { importService } from '../../services/importService';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import './Form.css'; 

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DocumentImportModal: React.FC<DocumentImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ImportValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, status: '' });
  const [importResult, setImportResult] = useState<{ success: boolean; batchId: string; documentId?: string } | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'metadata' | 'success'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metadata form state
  const [metadata, setMetadata] = useState({
    name: '',
    drafter_name: '',
    reviewer_name: '',
    approver_name: '',
    nextreviewdate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    access_scope: 'department_only' as 'department_only' | 'company_wide'
  });

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      try {
        const result = await importService.parseZip(selectedFile);
        setValidation(result);
        if (result.qtFile) {
          setMetadata(prev => ({ 
            ...prev, 
            name: result.qtFile?.displayName || '',
            drafter_name: profile?.full_name || user?.email || ''
          }));
        }
        setStep('preview');
      } catch (err) {
        console.error('ZIP parsing error:', err);
        alert('Không thể đọc file ZIP. Vui lòng kiểm tra lại định dạng.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExecuteImport = async () => {
    console.log('--- START IMPORT BATCH CLICKED ---');
    console.log('Validation state:', !!validation);
    console.log('User state:', !!user);
    console.log('Profile state:', !!profile);

    if (!validation) {
      alert('Vui lòng chọn file ZIP và đợi quá trình kiểm tra hoàn tất.');
      return;
    }

    if (!user) {
      alert('Bạn cần đăng nhập để thực hiện import.');
      return;
    }

    setLoading(true);
    setImportResult(null);
    try {
      const actorName = profile?.full_name || user.email || 'Admin';
      const deptId = profile?.departmentid || 'ISO';

      console.log(`Executing import as: ${actorName} (Dept: ${deptId})`);
      
      const result = await importService.executeImport(
        validation,
        user.id,
        actorName,
        deptId,
        (percent, status) => {
          console.log(`Import Progress: ${percent}% - ${status}`);
          setProgress({ percent, status });
        }
      );
      
      console.log('Import SUCCESS. Batch ID:', result.batchId);
      setImportResult({ success: true, batchId: result.batchId, documentId: result.documentId || undefined });
      
      // Transition to metadata step instead of closing
      setStep('metadata');
    } catch (err: any) {
      console.error('CRITICAL ERROR DURING IMPORT EXECUTION:', err);
      setImportResult({ success: false, batchId: progress.status.split(': ')[1] || 'N/A' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!importResult?.documentId) return;
    
    setLoading(true);
    try {
      await documentService.updateDocumentMetadata(importResult.documentId, metadata);
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        if (importResult.documentId) {
          navigate(`/documents/${importResult.documentId}`);
        }
      }, 2000);
    } catch (err) {
      console.error('Metadata update error:', err);
      alert('Lỗi khi lưu metadata. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay z-50 fixed inset-0 flex-center bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="modal-content glass-panel p-8 max-w-4xl w-full animate-slide-up border-primary/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] rounded-[32px] relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[80px] pointer-events-none rounded-full"></div>

        <div className="flex-between mb-6 relative z-10">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-3 text-white uppercase tracking-wider">
              <FileArchive size={28} className="text-primary drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"/>
              Import ISO Package (ZIP)
            </h3>
            <p className="text-[10px] text-primary mt-1 font-mono tracking-widest uppercase">Secured Batch Processing Protocol v2.1</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex-center text-muted border border-white/10 transition-colors" onClick={onClose}>✕</button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div 
              className="upload-zone py-12 bg-[#161625] border-2 border-dashed border-primary/40 rounded-2xl text-center cursor-pointer hover:border-primary hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] transition-all group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".zip" />
              <UploadCloud size={48} className="text-primary mx-auto mb-4 animate-pulse" />
              <p className="font-bold text-lg mb-1">Chọn file ZIP để bắt đầu</p>
              <p className="text-xs text-muted font-mono uppercase tracking-widest">Hỗ trợ 1 QT + Nhiều BM/HS/PL</p>
            </div>
          )}

          {/* Step 2: Preview & Validation */}
          {step === 'preview' && file && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                 <div className="p-3 bg-primary/20 rounded-lg text-primary"><FileArchive size={24}/></div>
                 <div className="flex-1">
                    <p className="font-bold text-white mb-0.5">{file.name}</p>
                    <p className="text-[10px] text-muted font-mono uppercase font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB • {validation?.files.length || 0} Files Detected</p>
                 </div>
                 <button className="btn-sm text-xs bg-white/5 text-muted hover:text-white px-3 py-1 rounded-md" onClick={() => { setFile(null); setValidation(null); setStep('upload'); }}>Thay đổi</button>
              </div>

              {loading && !progress.status ? (
                <div className="py-12 flex-center flex-col gap-4">
                   <Loader2 size={32} className="text-primary animate-spin" />
                   <p className="text-sm font-mono text-primary animate-pulse uppercase tracking-widest">Đang phân tích cấu trúc ZIP...</p>
                </div>
              ) : (
                <>
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border border-white/5 rounded-xl bg-black/40">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-[#0f0f13] text-[10px] uppercase font-mono text-muted tracking-widest border-b border-white/10">
                        <tr>
                          <th className="p-4 font-black">STT</th>
                          <th className="p-4 font-black">File gốc</th>
                          <th className="p-4 font-black">Mã hiệu</th>
                          <th className="p-4 font-black">Tên hiển thị</th>
                          <th className="p-4 font-black">Type</th>
                          <th className="p-4 font-black">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {validation?.files.map((f, i) => (
                           <tr key={f.name} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-mono text-muted pl-4">{(i+1).toString().padStart(2, '0')}</td>
                              <td className="p-3 text-white/70 max-w-[200px] truncate" title={f.originalFilename || f.name}>
                                 {f.originalFilename || f.name.split(/[/\\]/).pop()}
                              </td>
                              <td className="p-3 font-mono text-primary font-bold">{f.fileCode || '—'}</td>
                              <td className="p-3 font-bold text-white flex items-center gap-2">
                                 {f.prefix === 'QT' ? <FileText size={14} className="text-warning flex-shrink-0" /> : <Box size={14} className="text-info flex-shrink-0" />}
                                 {f.displayName || f.name}
                              </td>
                              <td className="p-3 font-mono text-primary font-bold">{f.prefix || 'UNKNOWN'}</td>
                              <td className="p-3 pr-4">
                                 {f.status === 'valid' ? (
                                   <div className="flex items-center gap-1 text-success font-bold">
                                      <CheckCircle2 size={14}/> 
                                      <span>Hợp lệ</span>
                                   </div>
                                 ) : (
                                   <div className="flex flex-col gap-1">
                                      <span className="flex items-center gap-1 text-error font-bold uppercase">
                                         <AlertTriangle size={14}/> {f.status}
                                      </span>
                                      <span className="text-[10px] text-error/70 leading-tight italic">{f.error}</span>
                                   </div>
                                 )}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>

                  {validation?.errors && validation.errors.length > 0 && (
                    <div className="bg-error/10 border border-error/30 p-4 rounded-xl space-y-2">
                       <div className="flex items-center gap-2 text-error font-bold text-sm uppercase">
                          <AlertTriangle size={16}/> 
                          Lỗi Validation (Cần sửa trước khi Import):
                       </div>
                       <ul className="list-disc list-inside text-xs text-error/80 font-medium">
                         {validation.errors.map((err, i) => <li key={i}>{err}</li>)}
                       </ul>
                    </div>
                  )}

                  {progress.percent > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex-between text-[10px] font-mono uppercase font-bold tracking-widest mb-1">
                           <span className={progress.percent === -1 ? 'text-error' : 'text-primary'}>{progress.status}</span>
                           <span className="text-white">{progress.percent === -1 ? 'FAILED' : `${progress.percent}%`}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                           <div 
                             className={`h-full transition-all duration-500 ${progress.percent === -1 ? 'bg-error' : 'bg-primary shadow-[0_0_15px_rgba(236,72,153,0.8)]'}`}
                             style={{ width: `${progress.percent === -1 ? 100 : progress.percent}%` }}
                           />
                        </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Metadata Completion */}
          {step === 'metadata' && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="text-primary" size={24} />
                <div>
                  <p className="text-sm font-bold text-white">ZIP Processed Successfully!</p>
                  <p className="text-[10px] text-primary font-mono uppercase">Please complete the business metadata below to finalize.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 form-group">
                  <label className="text-[10px] font-mono text-primary uppercase font-bold mb-2 flex items-center gap-2">
                    <FileText size={12}/> Tên quy trình hiển thị
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-all outline-none"
                    value={metadata.name}
                    onChange={e => setMetadata({...metadata, name: e.target.value})}
                    placeholder="VD: Quy trình Vận hành Hệ thống"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[10px] font-mono text-primary uppercase font-bold mb-2 flex items-center gap-2">
                    <UserPlus size={12}/> Người soạn thảo
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-all outline-none"
                    value={metadata.drafter_name}
                    onChange={e => setMetadata({...metadata, drafter_name: e.target.value})}
                    placeholder="Họ tên người soạn"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[10px] font-mono text-primary uppercase font-bold mb-2 flex items-center gap-2">
                    <UserPlus size={12}/> Người xem xét
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-all outline-none"
                    value={metadata.reviewer_name}
                    onChange={e => setMetadata({...metadata, reviewer_name: e.target.value})}
                    placeholder="Họ tên người xem xét"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[10px] font-mono text-primary uppercase font-bold mb-2 flex items-center gap-2">
                    <UserPlus size={12}/> Người phê duyệt
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-all outline-none"
                    value={metadata.approver_name}
                    onChange={e => setMetadata({...metadata, approver_name: e.target.value})}
                    placeholder="Họ tên người phê duyệt"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[10px] font-mono text-primary uppercase font-bold mb-2 flex items-center gap-2">
                    <Calendar size={12}/> Ngày rà soát định kỳ
                  </label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-all outline-none"
                    value={metadata.nextreviewdate}
                    onChange={e => setMetadata({...metadata, nextreviewdate: e.target.value})}
                  />
                </div>

                <div className="col-span-2 form-group">
                  <label className="text-[10px] font-mono text-primary uppercase font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck size={12}/> Phạm vi truy nhập
                  </label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-all outline-none appearance-none"
                    value={metadata.access_scope}
                    onChange={e => setMetadata({...metadata, access_scope: e.target.value as any})}
                  >
                    <option value="department_only">Nội bộ phòng ban</option>
                    <option value="company_wide">Toàn công ty</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success State */}
          {step === 'success' && importResult && (
            <div className={`py-12 flex-center flex-col gap-6 animate-scale-in text-center ${importResult.success ? 'text-success' : 'text-error'}`}>
               <div className={`w-20 h-20 rounded-full flex-center border-4 ${importResult.success ? 'bg-success/10 border-success shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-error/10 border-error shadow-[0_0_30px_rgba(239,68,68,0.3)]'}`}>
                  {importResult.success ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
               </div>
               <div>
                  <h2 className="text-2xl font-bold mb-2 uppercase tracking-widest">{importResult.success ? 'Import Thành Công' : 'Import Thất Bại'}</h2>
                  <p className="text-xs font-mono text-muted uppercase tracking-widest">BATCH ID: <span className="text-white">{importResult.batchId}</span></p>
                  {!importResult.success && <p className="text-sm mt-4 font-bold text-error border border-error/20 p-3 rounded-lg bg-error/5 max-w-md mx-auto">{progress.status}</p>}
               </div>
            </div>
          )}

          <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
            <button className="btn bg-[#161625] text-white hover:bg-white/10 border border-white/10 px-8 rounded-xl font-bold transition-all" onClick={onClose} disabled={loading}>Đóng</button>
            {step === 'preview' && (
              <button 
                className={`btn px-10 rounded-xl font-bold tracking-wide transition-all ${validation?.isValid ? 'bg-primary text-white hover:bg-primary/80 shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'bg-white/5 text-muted border border-white/10 cursor-not-allowed grayscale'}`} 
                onClick={handleExecuteImport}
                disabled={!validation?.isValid || loading}
                title={!validation?.isValid ? `Lỗi: ${validation?.errors.join('; ')}` : 'Bắt đầu quá trình Import Batch'}
              >
                {loading ? (
                  <div className="flex items-center gap-3"><Loader2 size={18} className="animate-spin" /> EXECUTING...</div>
                ) : (
                  'BẮT ĐẦU IMPORT BATCH'
                )}
              </button>
            )}
            
            {step === 'metadata' && (
              <button 
                className="btn px-10 rounded-xl font-bold tracking-wide transition-all bg-primary text-white hover:bg-primary/80 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                onClick={handleSaveMetadata}
                disabled={loading || !metadata.drafter_name || !metadata.reviewer_name || !metadata.approver_name}
              >
                {loading ? (
                  <div className="flex items-center gap-3"><Loader2 size={18} className="animate-spin" /> SAVING...</div>
                ) : (
                  'HOÀN TẤT IMPORT'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentImportModal;
