import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { CopyButton } from './CopyButton';
import {
  Code2,
  ArrowUp,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Globe
} from 'lucide-react';

interface FooterProps {
  onOpenVsCodeModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVsCodeModal }) => {
  const { personalInfo } = usePortfolio();

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-sky-400 font-bold text-xs">
              SR
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-white">{personalInfo.name}</p>
            <p className="text-xs text-slate-400 font-mono">
              {personalInfo.role}
            </p>
          </div>
        </div>

        {/* Social & Live Site Links */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {personalInfo.liveUrl && (
            <a
              href={personalInfo.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition-all"
              title="Live Deployed Site"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </a>
          )}

          <a
            href={personalInfo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            onMouseEnter={() => soundFx.playHover()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href={personalInfo.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            onMouseEnter={() => soundFx.playHover()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a
            href={personalInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            onMouseEnter={() => soundFx.playHover()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <a
            href={`mailto:${personalInfo.email}`}
            onClick={() => soundFx.playClick()}
            onMouseEnter={() => soundFx.playHover()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
            title={`Mail to ${personalInfo.email}`}
          >
            <Mail className="w-4 h-4" />
          </a>

          <CopyButton
            textToCopy={personalInfo.email}
            iconOnly
            variant="ghost"
            title="Copy email to clipboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400"
          />
        </div>

        {/* Back to Top & Copyright */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>© 2026 {personalInfo.name}. All Rights Reserved.</span>
          <button
            onClick={scrollToTop}
            onMouseEnter={() => soundFx.playHover()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-sky-400 transition-colors"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
