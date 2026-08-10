import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import santhoshAvatarImg from '../assets/images/santhosh_developer_id_photo_1784902447117.jpg';
import { CopyButton } from './CopyButton';
import { HeaderScrollingLine } from './HeaderScrollingLine';
import {
  ArrowRight,
  Code,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Github,
  Terminal,
  Compass,
  Download,
  ShieldCheck,
  Maximize2,
  X,
  BadgeCheck,
  Building2,
  GraduationCap,
  Edit3,
  Upload,
  RotateCcw,
  Check,
  Camera,
  Sliders
} from 'lucide-react';

interface Props {
  onOpenResumeModal: () => void;
}

interface IdCardData {
  name: string;
  role: string;
  institution: string;
  department: string;
  badgeNo: string;
  tagline: string;
  image: string;
}

export const Hero: React.FC<Props> = ({ onOpenResumeModal }) => {
  const { personalInfo, openEditor } = usePortfolio();

  const DEFAULT_ID_DATA: IdCardData = {
    name: personalInfo.name,
    role: personalInfo.role,
    institution: 'Park College',
    department: "B.E. CSE ('28)",
    badgeNo: '#DEV-2026-8294',
    tagline: personalInfo.tagline,
    image: santhoshAvatarImg
  };

  const [showIdModal, setShowIdModal] = useState(false);
  const [isEditingId, setIsEditingId] = useState(false);
  const [idData, setIdData] = useState<IdCardData>(() => {
    try {
      const saved = localStorage.getItem('santhosh_developer_id_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ID_DATA;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('santhosh_developer_id_data', JSON.stringify(idData));
    } catch (e) {
      console.error(e);
    }
  }, [idData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setIdData(prev => ({ ...prev, image: reader.result as string }));
          soundFx.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetId = () => {
    soundFx.playClick();
    setIdData(DEFAULT_ID_DATA);
    localStorage.removeItem('santhosh_developer_id_data');
  };

  const scrollToSection = (id: string) => {
    soundFx.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Intro Text */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-sky-500/30 text-xs font-mono text-sky-300 backdrop-blur-md self-center lg:self-start shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for Web & Engineering Roles</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>

          {/* Bold Name & Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Hello, I'm <br />
              <span className="gradient-text font-black text-glow-cyan">
                {personalInfo.name}
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-300 flex items-center justify-center lg:justify-start gap-2 pt-1">
              <Terminal className="w-6 h-6 text-indigo-400 shrink-0" />
              <span>{personalInfo.role}</span>
            </h2>

            <HeaderScrollingLine
              speed="fast"
              items={[
                '✦ B.E. CSE GRADUATE (CGPA 8.01)',
                '✦ REACT 18 & THREE.JS ARCHITECT',
                '✦ INSTANT PROJECT IMAGE UPLOADER',
                '✦ BWM-SMOKY.VERCEL.APP PORTFOLIO',
                '✦ OPEN FOR IMMEDIATE OPPORTUNITIES',
              ]}
            />
          </div>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            “{personalInfo.tagline}”
          </p>

          {/* Quick Location & Email Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-400 pt-1 font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 hover:text-sky-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{personalInfo.email}</span>
              </a>
              <CopyButton
                textToCopy={personalInfo.email}
                iconOnly
                variant="ghost"
                title="Copy email address"
                className="p-1 h-auto min-w-0"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{personalInfo.phone}</span>
            </div>
          </div>

          {/* Animated CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            {/* View Projects */}
            <button
              onClick={() => scrollToSection('projects')}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <span className="flex items-center gap-2">
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Contact Me */}
            <button
              onClick={() => scrollToSection('contact')}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400 transition-all duration-300 hover:text-white backdrop-blur-md active:scale-95"
            >
              Contact Me
            </button>

            {/* Download Resume */}
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenResumeModal();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl font-mono text-xs text-sky-400 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/60 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>A4 Interview Resume</span>
            </button>
          </div>

          {/* Technology Badges Row */}
          <div className="pt-6 border-t border-slate-800/60">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 text-center lg:text-left">
              Core Tech Stack & Tools
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {['React.js', 'JavaScript', 'HTML5 & CSS3', 'Supabase', 'Python', 'Java', 'Git'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800 text-xs font-mono hover:border-sky-500/40 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Holographic Card & Avatar Frame */}
        <div className="lg:col-span-5 flex justify-center relative">
          
          {/* Outer Glowing Radial Orb */}
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/30 via-indigo-500/20 to-purple-500/30 rounded-3xl blur-3xl opacity-70 animate-pulse-glow" />

          {/* Main 3D Card Glass Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md glass-panel-glow p-6 rounded-3xl border border-sky-500/30 shadow-2xl space-y-6 transform-style-3d hover:rotate-1 transition-transform duration-500">
            
            {/* Header Status Bar inside Card */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-sky-400 uppercase tracking-widest">
                Developer_ID.v3
              </span>
            </div>

            {/* Avatar Image Container with Holographic Border */}
            <div
              onClick={() => {
                soundFx.playClick();
                setShowIdModal(true);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="relative group mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-xl cursor-pointer"
              title="Click to view & edit Developer ID Badge"
            >
              <img
                src={idData.image}
                alt={`${idData.name} Developer ID`}
                className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-sky-500/30">
                <span className="flex items-center gap-1 text-sky-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ID Verified
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-300 font-semibold group-hover:text-sky-300">
                  <Edit3 className="w-3 h-3 text-sky-400" /> View & Edit ID
                </span>
              </div>
            </div>

            {/* Floating Hologram Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xl font-bold text-sky-400">{idData.department.split(' ')[1] || 'CSE'}</p>
                <p className="text-[11px] text-slate-400 font-mono">{idData.department}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xl font-bold text-purple-400">10+ Tech</p>
                <p className="text-[11px] text-slate-400 font-mono">Skills & Frameworks</p>
              </div>
            </div>

            {/* Bottom Code Snippet */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-1.5">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Code className="w-3 h-3 text-sky-400" /> santhosh_status.ts
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE
                  </span>
                  <CopyButton
                    textToCopy={`const dev = { name: "${idData.name}", goal: "Build Exceptional Web Apps" };`}
                    label="Copy Code"
                    copiedLabel="Copied!"
                    variant="ghost"
                    className="py-0 px-1.5 text-[10px]"
                  />
                </div>
              </div>
              <p className="text-slate-300 overflow-x-auto py-1">
                <span className="text-sky-400">const</span> dev = &#123; name: <span className="text-emerald-300">"{idData.name}"</span>, goal: <span className="text-amber-300">"Build Exceptional Web Apps"</span> &#125;;
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Developer ID Badge Full Modal with Edit Mode */}
      {showIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-sky-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            
            {/* Close Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowIdModal(false);
                setIsEditingId(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Lanyard Loop Graphic & Mode Switch */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full shadow-md" />
              
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsEditingId(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    !isEditingId ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BadgeCheck className="w-3.5 h-3.5" /> View Badge
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsEditingId(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    isEditingId ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit ID & Photo
                </button>
              </div>
            </div>

            {!isEditingId ? (
              /* --- BADGE DISPLAY VIEW --- */
              <div className="space-y-5">
                {/* Large ID Image */}
                <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-xl group">
                  <img
                    src={idData.image}
                    alt={`Developer ID Photo - ${idData.name}`}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    onClick={() => {
                      soundFx.playClick();
                      setIsEditingId(true);
                    }}
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-xl"
                  >
                    <span className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-bold font-mono flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> Change Photo
                    </span>
                  </div>
                </div>

                {/* Developer Details */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    {idData.name}
                  </h3>
                  <p className="text-sm font-semibold text-sky-400 font-mono">
                    {idData.role}
                  </p>
                  
                  <div className="pt-2 grid grid-cols-2 gap-2 text-left text-xs font-mono text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block">Institution</span>
                      <p className="font-semibold text-slate-200 truncate flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{idData.institution}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block">Department</span>
                      <p className="font-semibold text-slate-200 truncate flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{idData.department}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>ID BADGE NO: {idData.badgeNo}</span>
                      <span className="text-emerald-400">STATUS: ACTIVE</span>
                    </div>
                    <p className="text-slate-300 text-center pt-1 font-sans">
                      "{idData.tagline}"
                    </p>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsEditingId(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs font-mono text-sky-300 bg-slate-800 hover:bg-slate-700 border border-sky-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Badge
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShowIdModal(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs font-mono text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* --- EDIT ID DETAILS FORM VIEW --- */
              <div className="space-y-4 animate-fade-in text-xs font-mono">
                <div className="text-center pb-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Edit ID Badge Information
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Upload a new photo or edit the details printed on your Developer ID.
                  </p>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <label className="block text-slate-400 font-bold text-[11px] uppercase">
                    ID Badge Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={idData.image}
                      alt="Current Avatar Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-sky-500/40"
                    />
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer transition-colors w-full text-center">
                        <Upload className="w-3.5 h-3.5" /> Upload Image File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-500 block text-center">
                        Supports JPG, PNG, WEBP files
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Developer Name</label>
                    <input
                      type="text"
                      value={idData.name}
                      onChange={(e) => setIdData({ ...idData, name: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={idData.role}
                      onChange={(e) => setIdData({ ...idData, role: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Institution & Department */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Institution</label>
                    <input
                      type="text"
                      value={idData.institution}
                      onChange={(e) => setIdData({ ...idData, institution: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Department</label>
                    <input
                      type="text"
                      value={idData.department}
                      onChange={(e) => setIdData({ ...idData, department: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Badge Number & Tagline */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge No.</label>
                    <input
                      type="text"
                      value={idData.badgeNo}
                      onChange={(e) => setIdData({ ...idData, badgeNo: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tagline Quote</label>
                    <input
                      type="text"
                      value={idData.tagline}
                      onChange={(e) => setIdData({ ...idData, tagline: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-sky-500 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      soundFx.playSuccess();
                      setIsEditingId(false);
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Save & Preview Badge
                  </button>

                  <button
                    onClick={handleResetId}
                    className="w-full py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset to Original Photo & Info
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
