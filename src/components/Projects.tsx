import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { soundFx } from '../utils/audio';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Sparkles,
  Calculator,
  Layers,
  ArrowUpRight,
  Code2
} from 'lucide-react';

interface Props {
  onOpenCgpaCalculator: () => void;
}

export const Projects: React.FC<Props> = ({ onOpenCgpaCalculator }) => {
  const { projects } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterCategories = ['All', 'Web Application', 'Frontend & 3D WebGL', 'Full Stack Concept'];

  const filteredProjects = projects.filter((proj) => {
    if (selectedFilter === 'All') return true;
    return proj.category === selectedFilter;
  });

  const handleDemoClick = (project: Project) => {
    soundFx.playClick();
    if (project.interactiveDemo === 'cgpa_calculator') {
      onOpenCgpaCalculator();
    } else if (project.liveUrl && project.liveUrl !== '#') {
      window.open(project.liveUrl, '_blank');
    } else {
      // Default fallback demo trigger
      onOpenCgpaCalculator();
    }
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>03 // FEATURED PROJECTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Selected Work & <br />
            <span className="gradient-text">Interactive Web Apps</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore web applications, academic tools, and interactive digital experiences.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedFilter(cat);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedFilter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border border-sky-400/30 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => soundFx.playHover()}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner Container */}
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-sky-400">
                    {project.category}
                  </span>

                  {/* Featured Badge */}
                  {project.featured && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 pt-1">
                    {project.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <span className="text-sky-400 mt-0.5 font-bold">›</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => handleDemoClick(project)}
                  onMouseEnter={() => soundFx.playHover()}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-sky-400 to-indigo-300 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-sky-400/10"
                >
                  {project.interactiveDemo === 'cgpa_calculator' ? (
                    <>
                      <Calculator className="w-4 h-4" />
                      <span>Launch Calculator</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </>
                  )}
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
