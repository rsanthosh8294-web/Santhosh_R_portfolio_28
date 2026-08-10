import React, { useState, useEffect } from 'react';
import { usePortfolio, ThemeMode } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import {
  Search,
  X,
  Code2,
  UserCheck,
  Cpu,
  FolderGit2,
  GraduationCap,
  Mail,
  Calculator,
  FileText,
  Volume2,
  Sliders,
  Palette
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCgpaCalculator: () => void;
  onOpenResumeModal: () => void;
  onOpenVsCodeModal: () => void;
}

export const CommandPalette: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenCgpaCalculator,
  onOpenResumeModal,
  onOpenVsCodeModal
}) => {
  const { openEditor, toggleThemeMode, setThemeMode } = usePortfolio();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        soundFx.playClick();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'theme-toggle',
      title: 'Cycle Next Theme Mode (Cyber -> Emerald -> Sunset -> Light)',
      category: 'Visual Theme',
      icon: <Palette className="w-4 h-4 text-purple-400" />,
      action: () => {
        toggleThemeMode();
        onClose();
      }
    },
    {
      id: 'theme-cyber',
      title: 'Switch to Cyberpunk Blue Theme',
      category: 'Visual Theme',
      icon: <Palette className="w-4 h-4 text-sky-400" />,
      action: () => {
        setThemeMode('cyber');
        onClose();
      }
    },
    {
      id: 'theme-emerald',
      title: 'Switch to Emerald Matrix Theme',
      category: 'Visual Theme',
      icon: <Palette className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setThemeMode('emerald');
        onClose();
      }
    },
    {
      id: 'theme-sunset',
      title: 'Switch to Sunset Violet Theme',
      category: 'Visual Theme',
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      action: () => {
        setThemeMode('sunset');
        onClose();
      }
    },
    {
      id: 'theme-light',
      title: 'Switch to Clean Light Glass Theme',
      category: 'Visual Theme',
      icon: <Palette className="w-4 h-4 text-slate-300" />,
      action: () => {
        setThemeMode('light');
        onClose();
      }
    },
    {
      id: 'vscode-access',
      title: 'VS Code Access & Code Export (Copy Details & Commands)',
      category: 'Developer Toolkit',
      icon: <Code2 className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onOpenVsCodeModal();
        onClose();
      }
    },
    {
      id: 'edit-portfolio',
      title: 'Edit Portfolio Details (Personal Info, Skills, Projects, Education)',
      category: 'Management',
      icon: <Sliders className="w-4 h-4 text-emerald-400" />,
      action: () => {
        openEditor();
        onClose();
      }
    },
    {
      id: 'ambient-audio',
      title: 'Toggle Futuristic Ambient Sound & FX',
      category: 'Audio Immersion',
      icon: <Volume2 className="w-4 h-4 text-sky-400" />,
      action: () => {
        soundFx.toggleSound();
        onClose();
      }
    },
    {
      id: 'cgpa',
      title: 'Open SGPA & CGPA Calculator Tool',
      category: 'Interactive Application',
      icon: <Calculator className="w-4 h-4 text-sky-400" />,
      action: () => {
        onOpenCgpaCalculator();
        onClose();
      }
    },
    {
      id: 'resume',
      title: 'View & Download Resume',
      category: 'Document',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      action: () => {
        onOpenResumeModal();
        onClose();
      }
    },
    {
      id: 'about',
      title: 'Jump to About Section',
      category: 'Navigation',
      icon: <UserCheck className="w-4 h-4 text-indigo-400" />,
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'skills',
      title: 'Jump to Skills & Tech Stack',
      category: 'Navigation',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'projects',
      title: 'Jump to Featured Projects',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-sky-400" />,
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'experience',
      title: 'Jump to Education Timeline',
      category: 'Navigation',
      icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'contact',
      title: 'Jump to Contact Form',
      category: 'Navigation',
      icon: <Mail className="w-4 h-4 text-rose-400" />,
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    }
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or section name..."
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Command Items */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-500 font-mono">
              No matching commands found.
            </p>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  soundFx.playClick();
                  cmd.action();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full p-3 rounded-2xl bg-slate-950/40 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/30 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                    {cmd.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-white">
                      {cmd.title}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {cmd.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 group-hover:text-sky-400">
                  ↵
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-500 flex justify-between">
          <span>Use ↑↓ to navigate, Enter to select</span>
          <span>ESC to close</span>
        </div>

      </div>
    </div>
  );
};
