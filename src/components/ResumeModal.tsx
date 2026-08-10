import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { CopyButton } from './CopyButton';
import {
  X,
  Printer,
  Download,
  GraduationCap,
  Code2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { personalInfo, technicalSkills, softSkills, educationHistory } = usePortfolio();

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleDownloadTxt = () => {
    soundFx.playClick();
    if (personalInfo.customResumeFile) {
      const a = document.createElement('a');
      a.href = personalInfo.customResumeFile;
      a.download = personalInfo.customResumeFileName || `${personalInfo.name.replace(/\s+/g, '_')}_Resume`;
      a.click();
      return;
    }

    const resumeText = `
===================================================
${personalInfo.name.toUpperCase()} - RESUME
${personalInfo.role}
Location: ${personalInfo.location}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
GitHub: ${personalInfo.githubUrl}
===================================================

SUMMARY:
${personalInfo.summary}

EDUCATION:
${educationHistory.map((e) => `- ${e.degree} | ${e.institution} (${e.period})\n  ${e.description}`).join('\n\n')}

TECHNICAL SKILLS:
${technicalSkills.map((s) => `- ${s.name} (${s.category}) - ${s.level}%`).join('\n')}

SOFT SKILLS:
${softSkills.map((s) => `- ${s.name}: ${s.description}`).join('\n')}
`;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Santhosh_R_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const plainResumeText = `
===================================================
${personalInfo.name.toUpperCase()} - RESUME
${personalInfo.role}
Location: ${personalInfo.location}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
GitHub: ${personalInfo.githubUrl}
===================================================

SUMMARY:
${personalInfo.summary}

EDUCATION:
${educationHistory.map((e) => `- ${e.degree} | ${e.institution} (${e.period})\n  ${e.description}`).join('\n\n')}

TECHNICAL SKILLS:
${technicalSkills.map((s) => `- ${s.name} (${s.category}) - ${s.level}%`).join('\n')}

SOFT SKILLS:
${softSkills.map((s) => `- ${s.name}: ${s.description}`).join('\n')}
`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:bg-white">
        
        {/* Header - Hidden during print */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 print:hidden flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Santhosh R - Curriculum Vitae</h2>
              <p className="text-xs text-slate-400">Official formatted resume document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={plainResumeText}
              label="Copy Text"
              copiedLabel="Copied!"
              variant="gradient"
              className="py-2 px-3 text-xs"
            />

            <button
              onClick={handlePrint}
              onMouseEnter={() => soundFx.playHover()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              onMouseEnter={() => soundFx.playHover()}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download TXT</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Sheet Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 print:text-black print:bg-white print:p-0">
          
          {/* Header info */}
          <div className="border-b border-slate-800 print:border-gray-300 pb-6 space-y-2">
            <h1 className="text-3xl font-extrabold text-white print:text-black">
              {personalInfo.name}
            </h1>
            <p className="text-base font-semibold text-sky-400 print:text-indigo-600">
              {personalInfo.role}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 print:text-gray-700 pt-1">
              <span>📍 {personalInfo.location}</span>
              <span>📧 {personalInfo.email}</span>
              <span>📞 {personalInfo.phone}</span>
              <span>💻 GitHub: {personalInfo.githubUser}</span>
            </div>
          </div>

          {/* Professional Objective */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-sky-400 print:text-black uppercase tracking-wider font-mono">
              Professional Objective
            </h3>
            <p className="text-xs leading-relaxed text-slate-300 print:text-gray-800">
              {personalInfo.summary}
            </p>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-sky-400 print:text-black uppercase tracking-wider font-mono">
              Education History
            </h3>
            <div className="space-y-3">
              {educationHistory.map((e) => (
                <div key={e.degree} className="p-3.5 rounded-xl bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200 space-y-1">
                  <div className="flex justify-between items-center text-sm font-bold text-white print:text-black">
                    <span>{e.degree}</span>
                    <span className="text-xs font-mono text-sky-400 print:text-gray-600">{e.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 print:text-gray-700 font-medium">
                    {e.institution} ({e.location})
                  </p>
                  <p className="text-xs text-slate-300 print:text-gray-800 pt-1">
                    {e.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-sky-400 print:text-black uppercase tracking-wider font-mono">
              Technical Skill Set
            </h3>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((s) => (
                <span
                  key={s.name}
                  className="px-2.5 py-1 rounded bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs font-mono text-slate-200 print:text-gray-800"
                >
                  {s.name} ({s.category})
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-sky-400 print:text-black uppercase tracking-wider font-mono">
              Soft Skills
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 print:text-gray-800">
              {softSkills.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>{s.name}:</strong> {s.description}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 text-right print:hidden">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
