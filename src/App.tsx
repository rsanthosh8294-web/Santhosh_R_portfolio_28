import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { PortfolioEditorModal } from './components/PortfolioEditorModal';
import { ThreeBackground } from './components/ThreeBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { GitHubStats } from './components/GitHubStats';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CgpaCalculatorModal } from './components/CgpaCalculatorModal';
import { ResumeModal } from './components/ResumeModal';
import { CommandPalette } from './components/CommandPalette';
import { VsCodeAccessModal } from './components/VsCodeAccessModal';
import { VercelAuthModal } from './components/VercelAuthModal';
import { SectionReveal } from './components/SectionReveal';
import { AmbientAudioWidget } from './components/AmbientAudioWidget';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isCgpaModalOpen, setIsCgpaModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isVsCodeModalOpen, setIsVsCodeModalOpen] = useState<boolean>(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState<boolean>(false);

  // Intersection Observer to highlight active section in Navbar
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'github', 'experience', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PortfolioProvider>
      <div className="relative min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
        
        {/* 3D WebGL Background Canvas */}
        <ThreeBackground />

        {/* Main Navigation Bar */}
        <Navbar
          activeSection={activeSection}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
          onOpenVsCodeModal={() => setIsVsCodeModalOpen(true)}
          onOpenVercelModal={() => setIsVercelModalOpen(true)}
        />

        {/* Page Sections */}
        <main className="relative z-10">
          <SectionReveal>
            <Hero onOpenResumeModal={() => setIsResumeModalOpen(true)} />
          </SectionReveal>
          <SectionReveal>
            <About onOpenResumeModal={() => setIsResumeModalOpen(true)} />
          </SectionReveal>
          <SectionReveal>
            <Skills />
          </SectionReveal>
          <SectionReveal>
            <Projects onOpenCgpaCalculator={() => setIsCgpaModalOpen(true)} />
          </SectionReveal>
          <SectionReveal>
            <GitHubStats />
          </SectionReveal>
          <SectionReveal>
            <Experience />
          </SectionReveal>
          <SectionReveal>
            <Contact />
          </SectionReveal>
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals & Overlays */}
        <CgpaCalculatorModal
          isOpen={isCgpaModalOpen}
          onClose={() => setIsCgpaModalOpen(false)}
        />

        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onOpenCgpaCalculator={() => setIsCgpaModalOpen(true)}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
          onOpenVsCodeModal={() => setIsVsCodeModalOpen(true)}
        />

        <VsCodeAccessModal
          isOpen={isVsCodeModalOpen}
          onClose={() => setIsVsCodeModalOpen(false)}
        />

        <VercelAuthModal
          isOpen={isVercelModalOpen}
          onClose={() => setIsVercelModalOpen(false)}
        />

        {/* Dynamic Portfolio Data Editor Modal */}
        <PortfolioEditorModal />

        {/* Floating Futuristic Ambient Sound Controller Widget */}
        <AmbientAudioWidget />

      </div>
    </PortfolioProvider>
  );
}
