import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { HeaderScrollingLine } from './HeaderScrollingLine';
import {
  Cpu,
  Code2,
  Palette,
  FileCode,
  Atom,
  GitBranch,
  Layout,
  Terminal,
  Coffee,
  Database,
  Zap,
  Github,
  Globe,
  Laptop,
  Check
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { technicalSkills, tools } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Languages', 'Backend & Databases', 'Tools'];

  const getIconComponent = (iconName: string, color: string) => {
    const props = { className: 'w-6 h-6', style: { color } };
    switch (iconName) {
      case 'Code':
        return <Code2 {...props} />;
      case 'Palette':
        return <Palette {...props} />;
      case 'FileCode':
        return <FileCode {...props} />;
      case 'Atom':
        return <Atom {...props} />;
      case 'GitBranch':
        return <GitBranch {...props} />;
      case 'Layout':
        return <Layout {...props} />;
      case 'Terminal':
        return <Terminal {...props} />;
      case 'Coffee':
        return <Coffee {...props} />;
      case 'Database':
        return <Database {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Github':
        return <Github {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'Laptop':
        return <Laptop {...props} />;
      default:
        return <Code2 {...props} />;
    }
  };

  const filteredSkills = technicalSkills.filter((skill) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Backend & Databases')
      return skill.category === 'Backend' || skill.category === 'Databases';
    return skill.category === activeCategory;
  });

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>02 // SKILLS & TECH STACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Technical Abilities & <br />
            <span className="gradient-text">Development Toolbelt</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Languages, frameworks, database systems, and developer tools I build with.
          </p>

          <HeaderScrollingLine
            reverse
            items={[
              '✦ REACT 18 & JAVASCRIPT ES6+',
              '✦ THREE.JS & WEBGL SHADERS',
              '✦ TAILWIND CSS & SHADCN UI',
              '✦ NODE.JS & EXPRESS BACKEND',
              '✦ PYTHON & SQL DATABASES',
              '✦ GIT & VERCEL DEPLOYMENT',
            ]}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 border border-sky-400/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={() => soundFx.playHover()}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-sky-500/40 space-y-4 group relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: skill.color }}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                    {getIconComponent(skill.iconName, skill.color)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <span
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800"
                  style={{ color: skill.color }}
                >
                  {skill.level}%
                </span>
              </div>

              {/* Skill Description */}
              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                {skill.description}
              </p>

              {/* Progress Bar Visual */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: skill.color,
                      boxShadow: `0 0 10px ${skill.color}80`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools & Platforms Sub-section */}
        <div className="pt-8 border-t border-slate-800/80 space-y-6">
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <Laptop className="w-6 h-6 text-sky-400" />
              <span>Tools & Platforms</span>
            </h3>
            <p className="text-slate-400 text-sm">
              Standard software development environment and continuous deployment targets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.name}
                onMouseEnter={() => soundFx.playHover()}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-sky-500/40 flex items-center gap-4 group"
              >
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 group-hover:scale-110 transition-transform">
                  {getIconComponent(tool.iconName, '#38BDF8')}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-slate-400">{tool.category}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {tool.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
