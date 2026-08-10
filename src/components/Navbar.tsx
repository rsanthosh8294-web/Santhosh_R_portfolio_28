import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import {
  Code2,
  Menu,
  X,
  Volume2,
  VolumeX,
  Search,
  FileText,
  Sparkles,
  Github,
  Mail,
  Sliders
} from 'lucide-react';

interface Props {
  activeSection: string;
  onOpenCommandPalette: () => void;
  onOpenResumeModal: () => void;
  onOpenVsCodeModal?: () => void;
  onOpenVercelModal?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeSection,
  onOpenCommandPalette,
  onOpenResumeModal,
  onOpenVsCodeModal,
  onOpenVercelModal,
}) => {
  const { personalInfo, openEditor } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = soundFx.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', id: 'hero' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'GitHub', href: '#github', id: 'github' },
    { name: 'Education', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const toggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  const handleNavClick = (href: string) => {
    soundFx.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-slate-950/80 backdrop-blur-xl border-b border-sky-500/10 shadow-lg shadow-black/40'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="group flex items-center gap-2.5 font-bold text-xl tracking-wider text-slate-100"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-[1px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                {personalInfo.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-mono">
                Portfolio 3D
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-sky-300 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-400/30" />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Edit Portfolio Details Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                openEditor();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="Edit Portfolio Details"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Edit Details</span>
            </button>

            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenCommandPalette();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Quick Command Palette (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span className="hidden lg:inline text-slate-400">Ctrl+K</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                soundEnabled
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Resume Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenResumeModal();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="relative group overflow-hidden px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:opacity-95 shadow-md shadow-sky-500/20 transition-all duration-300"
            >
              <span className="flex items-center gap-1.5 relative z-10">
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-sky-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-2xl p-5 shadow-2xl transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                  activeSection === link.id
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{link.name}</span>
                <Sparkles className="w-4 h-4 text-slate-500" />
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-800/80 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResumeModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-center flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View & Download Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
