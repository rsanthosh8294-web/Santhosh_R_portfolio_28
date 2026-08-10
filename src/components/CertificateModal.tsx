import React, { useState } from 'react';
import { Award, X, Download, FileText, Upload, Sparkles, CheckCircle2, ExternalLink, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Certification } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certification?: Certification | null;
  onSaveCertificate?: (updatedCert: Certification) => void;
  onImportNewCertificates?: (newCerts: Certification[]) => void;
}

export const CertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  certification,
  onSaveCertificate,
  onImportNewCertificates,
}) => {
  const [selectedFile, setSelectedFile] = useState<{ fileUrl: string; fileName: string; fileType: string } | null>(
    certification?.fileUrl ? { fileUrl: certification.fileUrl, fileName: certification.fileName || 'certificate', fileType: certification.fileType || 'application/pdf' } : null
  );

  const [title, setTitle] = useState(certification?.title || '');
  const [issuer, setIssuer] = useState(certification?.issuer || '');
  const [date, setDate] = useState(certification?.date || new Date().getFullYear().toString());
  const [skillsStr, setSkillsStr] = useState(certification?.skills?.join(', ') || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Sync state if certification prop changes
  React.useEffect(() => {
    if (certification) {
      setTitle(certification.title);
      setIssuer(certification.issuer);
      setDate(certification.date);
      setSkillsStr(certification.skills?.join(', ') || '');
      if (certification.fileUrl) {
        setSelectedFile({
          fileUrl: certification.fileUrl,
          fileName: certification.fileName || 'certificate_file',
          fileType: certification.fileType || 'application/pdf',
        });
      } else {
        setSelectedFile(null);
      }
    } else {
      setTitle('');
      setIssuer('');
      setDate(new Date().getFullYear().toString());
      setSkillsStr('');
      setSelectedFile(null);
    }
  }, [certification, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    
    // If multiple files are uploaded and onImportNewCertificates exists
    if (fileList.length > 1 && onImportNewCertificates) {
      const importedCerts: Certification[] = [];
      let processed = 0;

      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const fileNameClean = file.name.replace(/\.[^/.]+$/, '');
          importedCerts.push({
            title: fileNameClean,
            issuer: 'Uploaded Certification',
            date: new Date().getFullYear().toString(),
            skills: ['Certification', 'Verified'],
            fileUrl: result,
            fileName: file.name,
            fileType: file.type,
          });

          processed++;
          if (processed === fileList.length) {
            soundFx.playSuccess();
            onImportNewCertificates(importedCerts);
            setUploadSuccess(true);
            setTimeout(() => {
              setUploadSuccess(false);
              onClose();
            }, 1200);
          }
        };
        reader.readAsDataURL(file);
      });
      return;
    }

    // Single file upload
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedFile({
        fileUrl: result,
        fileName: file.name,
        fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
      });

      if (!title) {
        const fileNameClean = file.name.replace(/\.[^/.]+$/, '');
        setTitle(fileNameClean);
      }
      if (!issuer) {
        setIssuer('Uploaded Issuer');
      }

      soundFx.playSuccess();
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    soundFx.playClick();
    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const certData: Certification = {
      title: title.trim() || 'Imported Certification',
      issuer: issuer.trim() || 'Issuer',
      date: date.trim() || new Date().getFullYear().toString(),
      skills: skills.length > 0 ? skills : ['Certification'],
      fileUrl: selectedFile?.fileUrl,
      fileName: selectedFile?.fileName,
      fileType: selectedFile?.fileType,
    };

    if (onSaveCertificate) {
      onSaveCertificate(certData);
    } else if (onImportNewCertificates) {
      onImportNewCertificates([certData]);
    }
    onClose();
  };

  const isImage = selectedFile?.fileType?.startsWith('image/') || 
    selectedFile?.fileUrl?.startsWith('data:image/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-purple-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {certification ? 'Certification Details & File' : 'Import Certificate File'}
              </h2>
              <p className="text-xs text-slate-400">
                Upload or view official PDF & Image certificates
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* File Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileChange(e.dataTransfer.files);
            }}
            className={`relative p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 ${
              isDragOver
                ? 'border-purple-400 bg-purple-500/10'
                : selectedFile
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-800 hover:border-purple-500/40 bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 z-0">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {isImage ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 justify-center">
                    <span>{selectedFile.fileName}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    File attached • Click or drag to replace file
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 z-20">
                  {selectedFile.fileUrl && (
                    <a
                      href={selectedFile.fileUrl}
                      download={selectedFile.fileName}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>Download</span>
                    </a>
                  )}
                  {selectedFile.fileUrl && (
                    <a
                      href={selectedFile.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 border border-purple-500/30 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Fullscreen</span>
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                      setSelectedFile(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Click or Drag & Drop certificate files here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports <span className="text-purple-300">PDF documents</span>, <span className="text-purple-300">PNG, JPG, SVG</span> certificate images. Select multiple files to import in bulk!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section if File Attached */}
          {selectedFile && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Certificate File Preview
              </span>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center max-h-64 overflow-hidden">
                {isImage ? (
                  <img
                    src={selectedFile.fileUrl}
                    alt={selectedFile.fileName}
                    className="max-h-56 object-contain rounded-lg border border-slate-800"
                  />
                ) : (
                  <iframe
                    src={selectedFile.fileUrl}
                    title={selectedFile.fileName}
                    className="w-full h-56 rounded-lg border border-slate-800 bg-white"
                  />
                )}
              </div>
            </div>
          )}

          {/* Form Inputs for Metadata */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Certificate Information
            </span>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., AWS Certified Cloud Practitioner"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g., Amazon Web Services / Coursera"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g., 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Skills Learned (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="e.g., Cloud Architecture, Security, DevOps"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{certification ? 'Save Certificate' : 'Add to Portfolio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
