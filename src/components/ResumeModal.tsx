import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { CopyButton } from './CopyButton';
import {
  X,
  Printer,
  Download,
  FileText,
  Sparkles,
  Sliders,
  Check,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  CheckCircle2,
  FileCode,
  Upload
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { personalInfo, technicalSkills, softSkills, educationHistory, projects, certifications } = usePortfolio();

  // Customization controls for 1-Page A4 Sheet
  const [template, setTemplate] = useState<'modern' | 'classic' | 'executive'>('modern');
  const [fontScale, setFontScale] = useState<'compact' | 'balanced' | 'spacious'>('balanced');
  const [showProjects, setShowProjects] = useState(true);
  const [showCertifications, setShowCertifications] = useState(true);
  const [showSoftSkills, setShowSoftSkills] = useState(true);
  const [showWebsiteHeader, setShowWebsiteHeader] = useState(false);
  const [uploadedResumeFile, setUploadedResumeFile] = useState<{ name: string; url: string } | null>(null);

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result as string;
      if (url) {
        setUploadedResumeFile({ name: file.name, url });
        soundFx.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleDownloadHtml = () => {
    soundFx.playClick();
    const element = document.getElementById('a4-resume-sheet');
    if (!element) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Interview Resume (A4)</title>
  <style>
    @page { size: A4 portrait; margin: 8mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 10px; -webkit-print-color-adjust: exact; }
    .a4-container { max-width: 210mm; margin: 0 auto; background: #fff; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="a4-container">
    ${element.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name.replace(/\s+/g, '_')}_Interview_Resume_A4.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    soundFx.playClick();
    const resumeText = `
===================================================
${personalInfo.name.toUpperCase()} - INTERVIEW RESUME
${personalInfo.role}
Location: ${personalInfo.location} | Email: ${personalInfo.email} | Phone: ${personalInfo.phone}
Portfolio: ${personalInfo.liveUrl || 'https://bwm-smoky.vercel.app'}
GitHub: ${personalInfo.githubUrl}
===================================================

PROFESSIONAL SUMMARY:
${personalInfo.summary}

EDUCATION:
${educationHistory.map((e) => `- ${e.degree} | ${e.institution} (${e.period})\n  Location: ${e.location}${e.score ? ` | Grade: ${e.score}` : ''}\n  ${e.description}`).join('\n\n')}

TECHNICAL SKILLS:
${technicalSkills.map((s) => `- ${s.name} (${s.category})`).join('\n')}

PROJECTS:
${projects.map((p) => `- ${p.title} (${p.category}): ${p.description}\n  Tech Stack: ${p.tags.join(', ')}\n  Live Demo: ${p.liveUrl || 'https://bwm-smoky.vercel.app'}`).join('\n\n')}

CERTIFICATIONS:
${certifications.map((c) => `- ${c.title} (${c.issuer}, ${c.date})`).join('\n')}

SOFT SKILLS:
${softSkills.map((s) => `- ${s.name}: ${s.description}`).join('\n')}
`.trim();

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const plainResumeText = `
${personalInfo.name} - ${personalInfo.role}
Contact: ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
Portfolio: ${personalInfo.liveUrl || 'https://bwm-smoky.vercel.app'} | GitHub: ${personalInfo.githubUrl}

SUMMARY:
${personalInfo.summary}

EDUCATION:
${educationHistory.map((e) => `${e.degree} - ${e.institution} (${e.period})`).join('\n')}

SKILLS:
${technicalSkills.map((s) => s.name).join(', ')}

PROJECTS:
${projects.map((p) => `${p.title}: ${p.description}`).join('\n')}
`.trim();

  // Font scale css helper
  const scaleClass =
    fontScale === 'compact'
      ? 'text-[10px] leading-snug space-y-2'
      : fontScale === 'spacious'
      ? 'text-xs leading-relaxed space-y-3.5'
      : 'text-[11px] leading-normal space-y-2.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:block">
      <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:bg-white print:rounded-none">
        
        {/* Header Bar - Hidden during Print */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 print:hidden flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1-Page A4 Interview Resume Sheet</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  Fits 100% on 1 A4 Page
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Formatted specifically for job interviews & recruiter downloads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              onMouseEnter={() => soundFx.playHover()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download A4 PDF</span>
            </button>

            {/* Custom Resume PDF / Document Upload */}
            <label className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1.5 border border-purple-500/30 transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>{uploadedResumeFile ? 'Replace Resume File' : 'Upload Custom Resume File'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleResumeFileUpload}
                className="hidden"
              />
            </label>

            {uploadedResumeFile && (
              <a
                href={uploadedResumeFile.url}
                download={uploadedResumeFile.name}
                className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/40 transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="truncate max-w-[120px]">{uploadedResumeFile.name}</span>
              </a>
            )}

            <button
              onClick={handleDownloadHtml}
              onMouseEnter={() => soundFx.playHover()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>HTML Sheet</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              onMouseEnter={() => soundFx.playHover()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>TXT</span>
            </button>

            <CopyButton
              textToCopy={plainResumeText}
              label="Copy Text"
              copiedLabel="Copied!"
              variant="gradient"
              className="py-2 px-3 text-xs"
            />

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls - Hidden during Print */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/80 print:hidden flex items-center justify-between gap-4 overflow-x-auto text-xs">
          {/* Template Style */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 font-medium">Layout:</span>
            <div className="flex p-0.5 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setTemplate('modern');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  template === 'modern' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Modern 2-Column
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setTemplate('classic');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  template === 'classic' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Classic Standard
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setTemplate('executive');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  template === 'executive' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Executive Minimal
              </button>
            </div>
          </div>

          {/* Scale Adjuster */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 font-medium">Page Density:</span>
            <div className="flex p-0.5 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setFontScale('compact');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  fontScale === 'compact' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compact (Fit All)
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setFontScale('balanced');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  fontScale === 'balanced' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Balanced 1-Page
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setFontScale('spacious');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  fontScale === 'spacious' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Spacious
              </button>
            </div>
          </div>

          {/* Section Toggles */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showProjects}
                onChange={(e) => setShowProjects(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
              />
              <span>Projects</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showCertifications}
                onChange={(e) => setShowCertifications(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
              />
              <span>Certs</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showSoftSkills}
                onChange={(e) => setShowSoftSkills(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
              />
              <span>Soft Skills</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showWebsiteHeader}
                onChange={(e) => setShowWebsiteHeader(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
              />
              <span>Web Header</span>
            </label>
          </div>
        </div>

        {/* Modal Scroll Container */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/60 print:bg-white print:p-0 print:overflow-visible flex justify-center">
          
          {/* Printable A4 Sheet Target */}
          <div
            id="a4-resume-sheet"
            className={`a4-print-target w-full max-w-[210mm] min-h-[290mm] bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-8 print:p-0 print:shadow-none print:rounded-none border border-slate-200 print:border-none font-sans text-slate-900 ${scaleClass}`}
            style={{ boxSizing: 'border-box' }}
          >
            {/* TEMPLATE 1: MODERN TWO COLUMN */}
            {template === 'modern' && (
              <div className="grid grid-cols-12 gap-5 h-full">
                {/* Left Column Sidebar (4/12 width) */}
                <div className="col-span-4 bg-slate-100/90 -m-6 sm:-m-8 p-5 sm:p-6 border-r border-slate-200/80 flex flex-col justify-between space-y-4 print:bg-slate-100">
                  <div className="space-y-4">
                    {/* Candidate Photo / Initials badge */}
                    <div className="text-center pb-2 border-b border-slate-300/70">
                      {personalInfo.avatarUrl ? (
                        <img
                          src={personalInfo.avatarUrl}
                          alt={personalInfo.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-purple-600 shadow-sm mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                          {personalInfo.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <h2 className="font-bold text-slate-900 text-sm tracking-tight">{personalInfo.name}</h2>
                      <p className="text-[10px] font-semibold text-purple-700 uppercase tracking-wider">{personalInfo.role}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5 text-[10px]">
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] border-b border-slate-300/80 pb-0.5">
                        Contact Details
                      </h3>
                      <div className="space-y-1 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">{personalInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{personalInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{personalInfo.location}</span>
                        </div>
                        {showWebsiteHeader && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3 h-3 text-purple-600 shrink-0" />
                            <a href={personalInfo.liveUrl || 'https://bwm-smoky.vercel.app'} target="_blank" rel="noreferrer" className="text-purple-700 font-semibold underline truncate">
                              {personalInfo.liveUrl ? personalInfo.liveUrl.replace('https://', '') : 'bwm-smoky.vercel.app'}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Github className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">{personalInfo.githubUser}</span>
                        </div>
                      </div>
                    </div>

                    {/* Technical Skills */}
                    <div className="space-y-1.5 text-[10px]">
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] border-b border-slate-300/80 pb-0.5">
                        Technical Skills
                      </h3>
                      <div className="space-y-1.5">
                        {technicalSkills.map((s) => (
                          <div key={s.name}>
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>{s.name}</span>
                              <span className="text-[9px] text-slate-500">{s.level}%</span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-slate-300/80 overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${s.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    {showSoftSkills && (
                      <div className="space-y-1.5 text-[10px]">
                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] border-b border-slate-300/80 pb-0.5">
                          Soft Strengths
                        </h3>
                        <div className="space-y-1 text-slate-700">
                          {softSkills.map((s) => (
                            <div key={s.name} className="flex items-start gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span><strong>{s.name}:</strong> {s.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Badge */}
                  <div className="pt-2 border-t border-slate-300/60 text-[9px] text-slate-500 text-center font-mono">
                    Verified Interview Portfolio • 2026
                  </div>
                </div>

                {/* Right Column Main Body (8/12 width) */}
                <div className="col-span-8 pl-3 space-y-3.5">
                  {/* Header Banner */}
                  <div className="border-b-2 border-slate-900 pb-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                      {personalInfo.name}
                    </h1>
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                      {personalInfo.role}
                    </p>
                  </div>

                  {/* Professional Summary */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-purple-700" />
                      <span>Professional Objective</span>
                    </h3>
                    <p className="text-[10px] text-slate-700 leading-relaxed font-normal">
                      {personalInfo.summary}
                    </p>
                  </div>

                  {/* Education */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                      <span>Education & Academics</span>
                    </h3>
                    <div className="space-y-1.5">
                      {educationHistory.map((edu) => (
                        <div key={edu.degree} className="text-[10px]">
                          <div className="flex justify-between items-baseline font-bold text-slate-900">
                            <span>{edu.degree}</span>
                            <span className="font-mono text-purple-700 text-[9.5px]">{edu.period}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 font-medium">
                            <span>{edu.institution} ({edu.location})</span>
                            {edu.score && <span className="font-semibold text-slate-800">{edu.score}</span>}
                          </div>
                          <p className="text-slate-600 mt-0.5 text-[9.5px]">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  {showProjects && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-purple-700" />
                        <span>Featured Technical Projects</span>
                      </h3>
                      <div className="space-y-2">
                        {projects.slice(0, 3).map((p) => (
                          <div key={p.id} className="text-[10px]">
                            <div className="flex justify-between items-baseline font-bold text-slate-900">
                              <span>{p.title} <span className="text-[9px] font-normal text-slate-500">({p.category})</span></span>
                              <a href={p.liveUrl || 'https://bwm-smoky.vercel.app'} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline font-mono text-[9px]">
                                {p.liveUrl ? p.liveUrl.replace('https://', '') : 'bwm-smoky.vercel.app'}
                              </a>
                            </div>
                            <p className="text-slate-700 text-[9.5px] mt-0.5">{p.description}</p>
                            <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-0.5 text-[9px]">
                              {p.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.tags.map((t) => (
                                <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[8.5px] font-mono border border-slate-200">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {showCertifications && certifications.length > 0 && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-purple-700" />
                        <span>Certifications & Verified Credentials</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                        {certifications.map((c) => (
                          <div key={c.title} className="p-1.5 rounded bg-slate-50 border border-slate-200/80">
                            <p className="font-bold text-slate-900 leading-tight">{c.title}</p>
                            <p className="text-slate-600 text-[9px] flex justify-between pt-0.5">
                              <span>{c.issuer}</span>
                              <span className="font-mono text-purple-700">{c.date}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TEMPLATE 2: CLASSIC STANDARD */}
            {template === 'classic' && (
              <div className="space-y-3.5">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                  <h1 className="text-2xl font-bold uppercase text-slate-900 tracking-wide">{personalInfo.name}</h1>
                  <p className="text-xs font-semibold text-slate-700 uppercase">{personalInfo.role}</p>
                  <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono text-slate-600 pt-1">
                    <span>📍 {personalInfo.location}</span>
                    <span>📧 {personalInfo.email}</span>
                    <span>📞 {personalInfo.phone}</span>
                    {showWebsiteHeader && (
                      <span>🌐 {personalInfo.liveUrl || 'bwm-smoky.vercel.app'}</span>
                    )}
                    <span>💻 {personalInfo.githubUser}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Objective / Summary</h2>
                  <p className="text-[10px] text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                </div>

                {/* Education */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Education</h2>
                  {educationHistory.map((edu) => (
                    <div key={edu.degree} className="text-[10px]">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.degree} - {edu.institution}</span>
                        <span>{edu.period}</span>
                      </div>
                      <p className="text-slate-600 text-[9.5px]">{edu.description} {edu.score ? `(${edu.score})` : ''}</p>
                    </div>
                  ))}
                </div>

                {/* Technical Skills */}
                <div className="space-y-1">
                  <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Technical Skill Set</h2>
                  <div className="text-[10px] text-slate-800 space-y-0.5">
                    <p><strong>Languages & Web:</strong> {technicalSkills.map((s) => s.name).join(', ')}</p>
                    {showSoftSkills && (
                      <p><strong>Soft Skills:</strong> {softSkills.map((s) => s.name).join(', ')}</p>
                    )}
                  </div>
                </div>

                {/* Projects */}
                {showProjects && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Key Projects</h2>
                    {projects.slice(0, 3).map((p) => (
                      <div key={p.id} className="text-[10px] space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{p.title}</span>
                          <span className="font-mono font-normal text-[9px] text-indigo-700">{p.liveUrl || 'bwm-smoky.vercel.app'}</span>
                        </div>
                        <p className="text-slate-700">{p.description}</p>
                        <ul className="list-disc list-inside text-slate-600 text-[9px]">
                          {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {showCertifications && certifications.length > 0 && (
                  <div className="space-y-1">
                    <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Certifications</h2>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {certifications.map((c) => (
                        <div key={c.title}>
                          <span className="font-bold text-slate-900">{c.title}</span> - <span className="text-slate-600">{c.issuer} ({c.date})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TEMPLATE 3: EXECUTIVE MINIMAL */}
            {template === 'executive' && (
              <div className="space-y-4">
                {/* Executive Header */}
                <div className="flex justify-between items-end border-b-2 border-slate-900 pb-3">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{personalInfo.name}</h1>
                    <p className="text-xs font-bold text-purple-800 tracking-widest uppercase">{personalInfo.role}</p>
                  </div>
                  <div className="text-right text-[9.5px] font-mono text-slate-600 space-y-0.5">
                    <p>{personalInfo.email} • {personalInfo.phone}</p>
                    <p>{personalInfo.location}{showWebsiteHeader ? ` • ${personalInfo.liveUrl ? personalInfo.liveUrl.replace('https://', '') : 'bwm-smoky.vercel.app'}` : ''}</p>
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">Executive Profile</h2>
                  <p className="text-[10px] text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">Academic Background</h2>
                  <div className="space-y-1.5">
                    {educationHistory.map((edu) => (
                      <div key={edu.degree} className="text-[10px] flex justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{edu.degree}</p>
                          <p className="text-slate-600">{edu.institution} ({edu.location})</p>
                        </div>
                        <div className="text-right font-mono text-purple-800">
                          <p>{edu.period}</p>
                          {edu.score && <p className="font-semibold">{edu.score}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Skills */}
                <div>
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">Technical Competencies</h2>
                  <div className="flex flex-wrap gap-1.5 text-[9.5px]">
                    {technicalSkills.map((s) => (
                      <span key={s.name} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {showProjects && (
                  <div>
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">Signature Projects</h2>
                    <div className="space-y-2">
                      {projects.slice(0, 3).map((p) => (
                        <div key={p.id} className="text-[10px] border-l-2 border-purple-700 pl-2">
                          <p className="font-bold text-slate-900">{p.title} <span className="font-normal text-slate-500">({p.tags.join(', ')})</span></p>
                          <p className="text-slate-700 text-[9.5px]">{p.description}</p>
                          <p className="text-purple-800 font-mono text-[9px] mt-0.5">{p.liveUrl || 'https://bwm-smoky.vercel.app'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {showCertifications && certifications.length > 0 && (
                  <div>
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">Certifications</h2>
                    <div className="flex flex-wrap gap-3 text-[9.5px]">
                      {certifications.map((c) => (
                        <span key={c.title} className="text-slate-800 font-medium">
                          • {c.title} ({c.issuer})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer - Hidden during Print */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Click <strong>Print / Download A4 PDF</strong> to save as vector PDF from your browser</span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Sheet
          </button>
        </div>

      </div>
    </div>
  );
};
