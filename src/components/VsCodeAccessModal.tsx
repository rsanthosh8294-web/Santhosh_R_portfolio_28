import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { CopyButton } from './CopyButton';
import {
  X,
  Code2,
  Terminal,
  FileCode2,
  Download,
  Github,
  Check,
  Sparkles,
  ExternalLink,
  Laptop,
  Folder,
  Key,
  Layers,
  Copy
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VsCodeAccessModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    personalInfo,
    technicalSkills,
    softSkills,
    tools,
    projects,
    educationHistory,
    certifications
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'json' | 'commands' | 'ts' | 'guide'>('json');

  if (!isOpen) return null;

  // Complete JSON representation of all portfolio details
  const fullPortfolioObject = {
    personalInfo,
    technicalSkills,
    softSkills,
    tools,
    projects,
    educationHistory,
    certifications,
    exportedAt: new Date().toISOString()
  };

  const fullJsonString = JSON.stringify(fullPortfolioObject, null, 2);

  // TypeScript representation for src/data/portfolioData.ts
  const tsDataSnippet = `
// portfolioData.ts - Exported for VS Code
export const PERSONAL_INFO = ${JSON.stringify(personalInfo, null, 2)};

export const TECHNICAL_SKILLS = ${JSON.stringify(technicalSkills, null, 2)};

export const SOFT_SKILLS = ${JSON.stringify(softSkills, null, 2)};

export const TOOLS_AND_PLATFORMS = ${JSON.stringify(tools, null, 2)};

export const PROJECTS = ${JSON.stringify(projects, null, 2)};

export const EDUCATION_HISTORY = ${JSON.stringify(educationHistory, null, 2)};

export const CERTIFICATIONS = ${JSON.stringify(certifications, null, 2)};
`.trim();

  // Bash commands to run in VS Code terminal
  const vsCodeTerminalCommands = `
# 1. Clone or extract your project repository in VS Code
git clone ${personalInfo.githubUrl || 'https://github.com/rsanthosh8294/santhosh-r-web'}.git
cd santhosh-r-web

# 2. Install dependencies
npm install

# 3. Start the local Vite development server
npm run dev

# 4. Open in browser at http://localhost:3000
`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>VS Code Access & Code Export</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Dev Toolkit
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Copy all portfolio details, source data, and terminal commands to open and run in Visual Studio Code.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('json');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'json'
                ? 'border-sky-400 text-sky-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-sky-400" />
            <span>Full JSON Details</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('ts');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'ts'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>portfolioData.ts Code</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('commands');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'commands'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>VS Code Terminal Commands</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('guide');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'guide'
                ? 'border-purple-400 text-purple-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Laptop className="w-4 h-4 text-purple-400" />
            <span>VS Code Open Guide</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: ALL DETAILS JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-sky-400" />
                    <span>Complete Portfolio JSON Payload</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Contains Personal Info, Technical Skills, Projects, Education, Certifications, and Tools.
                  </p>
                </div>
                <CopyButton
                  textToCopy={fullJsonString}
                  label="Copy All Details (JSON)"
                  copiedLabel="Copied All JSON!"
                  variant="gradient"
                />
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto">
                <pre>{fullJsonString}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: TYPESCRIPT DATA SNIPPET */}
          {activeTab === 'ts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span>src/data/portfolioData.ts Code</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Paste this directly into your local <code className="text-sky-300 font-mono">src/data/portfolioData.ts</code> file in VS Code.
                  </p>
                </div>
                <CopyButton
                  textToCopy={tsDataSnippet}
                  label="Copy portfolioData.ts Code"
                  copiedLabel="Copied Code!"
                  variant="gradient"
                />
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto">
                <pre>{tsDataSnippet}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: TERMINAL COMMANDS */}
          {activeTab === 'commands' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>VS Code Integrated Terminal Commands</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Run these commands in VS Code's terminal (<kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">Ctrl + `</kbd>) to set up and run locally.
                  </p>
                </div>
                <CopyButton
                  textToCopy={vsCodeTerminalCommands}
                  label="Copy Terminal Commands"
                  copiedLabel="Copied Commands!"
                  variant="gradient"
                />
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 max-h-96 overflow-y-auto">
                <pre>{vsCodeTerminalCommands}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: VS CODE GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-xs border border-sky-500/30">1</span>
                    <span>Option A: Export to GitHub / ZIP</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In the top right menu of AI Studio, click <strong>Settings</strong> and select <strong>Export to GitHub</strong> or <strong>Download ZIP</strong> to download the entire source code directory to your computer.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs border border-indigo-500/30">2</span>
                    <span>Option B: Open Folder in VS Code</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Open Visual Studio Code, click <strong>File &gt; Open Folder</strong>, and choose the unzipped or cloned project folder. Open terminal with <code className="text-sky-300 font-mono">Ctrl + `</code>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs border border-emerald-500/30">3</span>
                    <span>Install & Start Local Server</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Run <code className="text-emerald-300 font-mono">npm install</code> followed by <code className="text-emerald-300 font-mono">npm run dev</code>. The app will launch on <code className="text-sky-300 font-mono">http://localhost:3000</code>.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs border border-amber-500/30">4</span>
                    <span>Paste Custom Portfolio Data</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Copy the JSON or TypeScript code from the tabs above and paste it inside <code className="text-amber-300 font-mono">src/data/portfolioData.ts</code> to keep all your personalized details updated!
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Ready for VS Code & GitHub</span>
          </span>

          <div className="flex items-center gap-3">
            <CopyButton
              textToCopy={fullJsonString}
              label="Copy All Details"
              copiedLabel="Copied All Details!"
              variant="gradient"
              className="py-2 px-4"
            />

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
