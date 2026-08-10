import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { Certification } from '../types';
import { CertificateModal } from './CertificateModal';
import { HeaderScrollingLine } from './HeaderScrollingLine';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Upload,
  Eye,
  Download,
  FileText
} from 'lucide-react';

export const Experience: React.FC = () => {
  const { educationHistory, certifications, updateCertifications } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenImportModal = () => {
    soundFx.playClick();
    setSelectedCert(null);
    setSelectedIndex(null);
    setIsModalOpen(true);
  };

  const handleOpenCertModal = (cert: Certification, index: number) => {
    soundFx.playClick();
    setSelectedCert(cert);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveCertificate = (updatedCert: Certification) => {
    if (selectedIndex !== null) {
      const copy = [...certifications];
      copy[selectedIndex] = updatedCert;
      updateCertifications(copy);
      showToast(`Certificate "${updatedCert.title}" updated successfully!`);
    } else {
      updateCertifications([...certifications, updatedCert]);
      showToast(`New Certificate "${updatedCert.title}" added to portfolio!`);
    }
  };

  const handleImportNewCertificates = (newCerts: Certification[]) => {
    updateCertifications([...certifications, ...newCerts]);
    showToast(`${newCerts.length} certificate file(s) imported successfully!`);
  };

  const handleDirectCardUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const copy = [...certifications];
        copy[index] = {
          ...copy[index],
          fileUrl: result,
          fileName: file.name,
          fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        };
        updateCertifications(copy);
        soundFx.playSuccess();
        showToast(`Certificate file "${file.name}" attached successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDirectTopBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    soundFx.playClick();
    const fileList = Array.from(files);
    const newCerts: Certification[] = [];
    let count = 0;

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        newCerts.push({
          title: cleanName,
          issuer: 'Uploaded Certification',
          date: new Date().getFullYear().toString(),
          skills: ['Verified Credential'],
          fileUrl: result,
          fileName: file.name,
          fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        });

        count++;
        if (count === fileList.length) {
          soundFx.playSuccess();
          updateCertifications([...certifications, ...newCerts]);
          showToast(`Successfully uploaded ${fileList.length} certificate file(s)!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 border border-purple-500/50 text-purple-200 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>04 // ACADEMICS & TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Education Journey & <br />
            <span className="gradient-text-emerald">Verified Certifications</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Academic milestones and technical learning accomplishments.
          </p>

          <HeaderScrollingLine
            items={[
              '✦ B.E. CSE • 2021 - 2025',
              '✦ CGPA 8.01 FIRST CLASS',
              '✦ INSTANT FILE & CERTIFICATE UPLOAD',
              '✦ VERIFIED CREDENTIALS GALLERY',
              '✦ BWM-SMOKY.VERCEL.APP',
            ]}
          />
        </div>

        {/* 3D Vertical Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Timeline */}
          <div className="lg:col-span-7 space-y-8 relative">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <span>Academic Qualification Timeline</span>
            </h3>

            {/* Vertical Glow Line */}
            <div className="absolute left-6 top-16 bottom-6 w-0.5 bg-gradient-to-b from-sky-500 via-indigo-500 to-purple-500/20" />

            {educationHistory.map((edu) => (
              <div
                key={edu.degree}
                onMouseEnter={() => soundFx.playHover()}
                className="relative pl-14 group"
              >
                {/* Node Point */}
                <div className="absolute left-3.5 top-1.5 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border-2 border-sky-400 group-hover:scale-125 group-hover:bg-sky-400 transition-all duration-300 shadow-md shadow-sky-400/50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Card Content */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-sky-500/40 transition-all duration-300 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-sky-400 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.period}</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      {edu.score}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      {edu.degree}
                    </h4>
                    <p className="text-sm font-medium text-slate-300 flex items-center gap-1.5 pt-1">
                      <span>{edu.institution}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-mono">{edu.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {edu.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {edu.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Certifications Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Certifications & Credentials</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* Instant Top Batch File Upload */}
                <label className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-105">
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>Upload Files / Certs</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleDirectTopBatchUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleOpenImportModal}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                  title="Open Form / Details Modal"
                >
                  <span>Modal</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <div
                  key={`${cert.title}-${idx}`}
                  onMouseEnter={() => soundFx.playHover()}
                  className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {cert.fileUrl && (
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/80 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-purple-400" />
                          <span>File Attached</span>
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                        {cert.date}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-xs font-mono text-slate-400 pt-0.5">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-sky-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Actions Row: View / Download / Direct File Upload */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                    {cert.fileUrl ? (
                      <div className="flex items-center gap-2 w-full justify-between flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenCertModal(cert, idx)}
                            className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-400" />
                            <span>View</span>
                          </button>

                          <label className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5 text-sky-400" />
                            <span>Replace File</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => handleDirectCardUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <a
                          href={cert.fileUrl}
                          download={cert.fileName || `${cert.title}_Certificate`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Download Certificate File"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Download</span>
                        </a>
                      </div>
                    ) : (
                      <label className="w-full py-2 px-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-purple-400" />
                        <span>Upload Certificate File (PDF / Image)</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDirectCardUpload(idx, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Badge Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 to-sky-950/40 border border-sky-800/40 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-sky-400 mx-auto animate-pulse" />
              <p className="text-sm font-bold text-white">Continuous Skill Upgrade</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Currently taking advanced coursework in Full Stack Web Development & Data Structures in Java.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Certificate Import & Viewer Modal */}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certification={selectedCert}
        onSaveCertificate={handleSaveCertificate}
        onImportNewCertificates={handleImportNewCertificates}
      />
    </section>
  );
};
