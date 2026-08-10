import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { CopyButton } from './CopyButton';
import {
  UserCheck,
  Brain,
  Clock,
  MessageSquare,
  Sparkles,
  Download,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Award
} from 'lucide-react';

interface Props {
  onOpenResumeModal: () => void;
}

export const About: React.FC<Props> = ({ onOpenResumeModal }) => {
  const { personalInfo, softSkills } = usePortfolio();

  const getSoftSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-6 h-6 text-sky-400" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-indigo-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-sky-400" />;
    }
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>01 // ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Driven by Curiosity, <br />
            <span className="gradient-text">Focused on Execution</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Get to know my academic background, technical mindset, and core developer soft skills.
          </p>
        </div>

        {/* Top Grid: Bio Card + Quick Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Professional Summary Glass Card */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl space-y-6 flex flex-col justify-between border border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Computer Science Student</h3>
                  <p className="text-xs font-mono text-slate-400">Park College of Engineering and Technology</p>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-4" />

              <p className="text-slate-300 text-base leading-relaxed">
                {personalInfo.summary}
              </p>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Key Highlights:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Strong C & Java OOP foundations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Web Stack: HTML5, CSS3, JS, React</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Analytical & Logical problem solver</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Quick learner & adaptable team contributor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Button */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-slate-400">Interested in my full profile?</p>
                <p className="text-sm font-semibold text-slate-200">Download formatted resume PDF/Doc</p>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenResumeModal();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 hover:opacity-90 shadow-md shadow-sky-400/20 transition-all duration-300"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          {/* Quick Contact & Info Card */}
          <div className="lg:col-span-5 glass-panel p-8 sm:p-10 rounded-3xl space-y-6 flex flex-col justify-between border border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Profile Snapshot</span>
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Full Name</p>
                    <p className="text-sm font-bold text-white">{personalInfo.name}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Location</p>
                    <p className="text-sm font-bold text-white">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-mono">Email Address</p>
                      <a href={`mailto:${personalInfo.email}`} className="text-sm font-bold text-sky-400 hover:underline">
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                  <CopyButton
                    textToCopy={personalInfo.email}
                    label="Copy Email"
                    variant="subtle"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-mono">Phone Number</p>
                      <p className="text-sm font-bold text-white">{personalInfo.phone}</p>
                    </div>
                  </div>
                  <CopyButton
                    textToCopy={personalInfo.phone}
                    label="Copy Phone"
                    variant="subtle"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-800/40 text-xs text-sky-300 font-mono">
              ⚡ Open for Software Developer Internships & Full-time Web Engineering Opportunities.
            </div>
          </div>

        </div>

        {/* Soft Skills Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Core Soft Skills
            </h3>
            <p className="text-slate-400 text-sm">
              Essential professional qualities that drive effective software delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {softSkills.map((skill) => (
              <div
                key={skill.name}
                onMouseEnter={() => soundFx.playHover()}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-sky-500/40 space-y-3 group"
              >
                <div className="p-3 rounded-xl bg-slate-900/80 w-fit group-hover:scale-110 transition-transform">
                  {getSoftSkillIcon(skill.icon)}
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  {skill.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
