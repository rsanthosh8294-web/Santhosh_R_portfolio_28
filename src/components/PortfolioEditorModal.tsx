import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { Skill, Project, EducationItem, Certification } from '../types';
import {
  X,
  User,
  Cpu,
  FolderGit2,
  GraduationCap,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  FileText,
  Sliders,
  ExternalLink,
  Code
} from 'lucide-react';

export const PortfolioEditorModal: React.FC = () => {
  const {
    personalInfo,
    technicalSkills,
    projects,
    educationHistory,
    certifications,
    isEditorOpen,
    closeEditor,
    updatePersonalInfo,
    updateTechnicalSkills,
    updateProjects,
    updateEducation,
    updateCertifications,
    resetAllData,
    exportJSON,
    importJSON
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'projects' | 'academics' | 'json'>('personal');
  const [personalForm, setPersonalForm] = useState(personalInfo);
  const [skillsList, setSkillsList] = useState<Skill[]>(technicalSkills);
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [educationList, setEducationList] = useState<EducationItem[]>(educationHistory);
  const [certsList, setCertsList] = useState<Certification[]>(certifications);
  const [jsonInput, setJsonInput] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Keep local form in sync when editor opens
  React.useEffect(() => {
    if (isEditorOpen) {
      setPersonalForm(personalInfo);
      setSkillsList(technicalSkills);
      setProjectsList(projects);
      setEducationList(educationHistory);
      setCertsList(certifications);
      setSavedSuccessMsg('');
    }
  }, [isEditorOpen, personalInfo, technicalSkills, projects, educationHistory, certifications]);

  if (!isEditorOpen) return null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPersonalForm(prev => ({ ...prev, avatarImage: dataUrl }));
        soundFx.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPersonalForm(prev => ({
          ...prev,
          customResumeFile: dataUrl,
          customResumeFileName: file.name
        }));
        soundFx.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjectImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const copy = [...projectsList];
        copy[index].image = dataUrl;
        setProjectsList(copy);
        soundFx.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    updatePersonalInfo(personalForm);
    soundFx.playSuccess();
    setSavedSuccessMsg('Personal details saved successfully!');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  const handleSaveSkills = () => {
    soundFx.playClick();
    updateTechnicalSkills(skillsList);
    soundFx.playSuccess();
    setSavedSuccessMsg('Technical skills updated!');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  const handleSaveProjects = () => {
    soundFx.playClick();
    updateProjects(projectsList);
    soundFx.playSuccess();
    setSavedSuccessMsg('Projects list saved!');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  const handleSaveAcademics = () => {
    soundFx.playClick();
    updateEducation(educationList);
    updateCertifications(certsList);
    soundFx.playSuccess();
    setSavedSuccessMsg('Academics & Certifications saved!');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all portfolio details back to default values?')) {
      soundFx.playClick();
      resetAllData();
      soundFx.playSuccess();
      closeEditor();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importJSON(content);
        if (ok) {
          soundFx.playSuccess();
          setSavedSuccessMsg('Portfolio JSON imported successfully!');
          setTimeout(() => setSavedSuccessMsg(''), 2500);
        } else {
          alert('Invalid portfolio JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-sky-500/30 shadow-2xl shadow-sky-950/50 text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Portfolio Details Editor
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE EDIT MODE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Modify your personal details, skills, projects, and bio. Changes save instantly to browser storage.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              closeEditor();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800 overflow-x-auto scrollbar-none">
          {[
            { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
            { id: 'skills', label: 'Skills & Tech', icon: <Cpu className="w-4 h-4" /> },
            { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
            { id: 'academics', label: 'Education & Certs', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'json', label: 'Export / Import', icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Success Alert Banner */}
        {savedSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Scrollable Form Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: PERSONAL & CONTACT INFO */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSavePersonal} className="space-y-5">
              
              {/* File Upload Section (Avatar Image & Resume PDF) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-sky-400" />
                  File Upload Options (Profile Photo & Resume Document)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Avatar Upload Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">Upload Profile Photo / Avatar</label>
                    <div className="flex items-center gap-3">
                      {personalForm.avatarImage ? (
                        <img
                          src={personalForm.avatarImage}
                          alt="Avatar Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-sky-500/50 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                          No Photo
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <label className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Image</span>
                          <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                        </label>
                        {personalForm.avatarImage && (
                          <button
                            type="button"
                            onClick={() => setPersonalForm(prev => ({ ...prev, avatarImage: undefined }))}
                            className="block text-[10px] text-rose-400 hover:underline"
                          >
                            Remove custom photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">Upload Resume File (.pdf, .docx, .txt)</label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Select Resume File</span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleResumeFileUpload} className="hidden" />
                      </label>
                      {personalForm.customResumeFile && (
                        <button
                          type="button"
                          onClick={() => setPersonalForm(prev => ({ ...prev, customResumeFile: undefined, customResumeFileName: undefined }))}
                          className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px]"
                        >
                          Clear File
                        </button>
                      )}
                    </div>
                    {personalForm.customResumeFileName && (
                      <p className="text-[11px] font-mono text-emerald-400 truncate flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{personalForm.customResumeFileName}</span>
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Main Contact & Bio Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={personalForm.role}
                    onChange={(e) => setPersonalForm({ ...personalForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Address</label>
                  <input
                    type="text"
                    value={personalForm.location}
                    onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
                  <input
                    type="text"
                    value={personalForm.availabilityStatus || ''}
                    placeholder="e.g. Open to Internships & Full-Time Projects"
                    onChange={(e) => setPersonalForm({ ...personalForm, availabilityStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={personalForm.githubUrl}
                    onChange={(e) => setPersonalForm({ ...personalForm, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={personalForm.linkedinUrl}
                    onChange={(e) => setPersonalForm({ ...personalForm, linkedinUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={personalForm.instagramUrl || ''}
                    onChange={(e) => setPersonalForm({ ...personalForm, instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Website URL</label>
                  <input
                    type="url"
                    value={personalForm.liveUrl}
                    onChange={(e) => setPersonalForm({ ...personalForm, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={personalForm.tagline}
                  onChange={(e) => setPersonalForm({ ...personalForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio & Summary</label>
                <textarea
                  rows={3}
                  value={personalForm.summary}
                  onChange={(e) => setPersonalForm({ ...personalForm, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Personal & Contact Details</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TECHNICAL SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Manage your technical skills, categories, proficiency percentages, and descriptions.
                </p>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSkillsList([
                      ...skillsList,
                      {
                        name: 'New Skill',
                        category: 'Frontend',
                        level: 80,
                        iconName: 'Code',
                        color: '#38BDF8',
                        description: 'Skill description goes here.'
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="space-y-3">
                {skillsList.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1 min-w-[150px]">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const copy = [...skillsList];
                            copy[idx].name = e.target.value;
                            setSkillsList(copy);
                          }}
                          placeholder="Skill Name"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-bold"
                        />
                      </div>

                      <select
                        value={skill.category}
                        onChange={(e) => {
                          const copy = [...skillsList];
                          copy[idx].category = e.target.value as any;
                          setSkillsList(copy);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Languages">Languages</option>
                        <option value="Databases">Databases</option>
                        <option value="Tools">Tools</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-sky-400 w-10 text-right">{skill.level}%</span>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={skill.level}
                          onChange={(e) => {
                            const copy = [...skillsList];
                            copy[idx].level = parseInt(e.target.value);
                            setSkillsList(copy);
                          }}
                          className="w-24 accent-sky-500"
                        />
                      </div>

                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setSkillsList(skillsList.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={skill.description}
                      onChange={(e) => {
                        const copy = [...skillsList];
                        copy[idx].description = e.target.value;
                        setSkillsList(copy);
                      }}
                      placeholder="Brief skill description..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-400 text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveSkills}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Skills</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Update your featured projects, repository links, tags, and descriptions.
                </p>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setProjectsList([
                      ...projectsList,
                      {
                        id: `project-${Date.now()}`,
                        title: 'New Web Project',
                        category: 'Web Application',
                        description: 'Detailed project description goes here.',
                        highlights: ['Core feature point 1', 'Core feature point 2'],
                        image: 'https://picsum.photos/seed/newproject/800/600',
                        tags: ['React', 'TypeScript', 'Tailwind CSS'],
                        githubUrl: 'https://github.com/santhosh.R',
                        liveUrl: 'https://bwm-smoky.vercel.app',
                        featured: true
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {projectsList.map((proj, idx) => (
                  <div key={proj.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx].title = e.target.value;
                            setProjectsList(copy);
                          }}
                          placeholder="Project Title"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-bold text-sm"
                        />
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setProjectsList(projectsList.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx].category = e.target.value;
                            setProjectsList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Completion Date / Timeline</label>
                        <input
                          type="text"
                          value={proj.completionDate || ''}
                          placeholder="e.g. March 2026"
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx].completionDate = e.target.value;
                            setProjectsList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={proj.tags.join(', ')}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx].tags = e.target.value.split(',').map((t) => t.trim());
                            setProjectsList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Live Demo URL</label>
                        <input
                          type="url"
                          value={proj.liveUrl || ''}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx].liveUrl = e.target.value;
                            setProjectsList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub Repo URL</label>
                        <input
                          type="url"
                          value={proj.githubUrl}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx].githubUrl = e.target.value;
                            setProjectsList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Upload Custom Cover Image</label>
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-medium cursor-pointer inline-flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProjectImageUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                          {proj.image && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              Image attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const copy = [...projectsList];
                          copy[idx].description = e.target.value;
                          setProjectsList(copy);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveProjects}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Projects List</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ACADEMICS & CERTS */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Education List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">Education Timeline</h3>
                {educationList.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree / Qualification</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const copy = [...educationList];
                            copy[idx].degree = e.target.value;
                            setEducationList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-semibold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Institution Name</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const copy = [...educationList];
                            copy[idx].institution = e.target.value;
                            setEducationList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Period / Duration Label</label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const copy = [...educationList];
                            copy[idx].period = e.target.value;
                            setEducationList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date / Year</label>
                        <input
                          type="text"
                          value={edu.startDate || ''}
                          placeholder="e.g. Aug 2024"
                          onChange={(e) => {
                            const copy = [...educationList];
                            copy[idx].startDate = e.target.value;
                            setEducationList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date / Expected Graduation</label>
                        <input
                          type="text"
                          value={edu.endDate || ''}
                          placeholder="e.g. May 2028"
                          onChange={(e) => {
                            const copy = [...educationList];
                            copy[idx].endDate = e.target.value;
                            setEducationList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Score / Grade Status</label>
                        <input
                          type="text"
                          value={edu.score || ''}
                          onChange={(e) => {
                            const copy = [...educationList];
                            copy[idx].score = e.target.value;
                            setEducationList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Certifications</h3>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import Certificate File(s)</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          soundFx.playClick();
                          const newCerts: Certification[] = [];
                          let count = 0;
                          (Array.from(files) as File[]).forEach((file: File) => {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const result = evt.target?.result as string;
                              const cleanName = file.name.replace(/\.[^/.]+$/, '');
                              newCerts.push({
                                title: cleanName,
                                issuer: 'Uploaded Organization',
                                date: new Date().getFullYear().toString(),
                                skills: ['Verified Skill'],
                                fileUrl: result,
                                fileName: file.name,
                                fileType: file.type,
                              });
                              count++;
                              if (count === files.length) {
                                soundFx.playSuccess();
                                setCertsList([...certsList, ...newCerts]);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setCertsList([
                          ...certsList,
                          {
                            title: 'New Certification Title',
                            issuer: 'Issuing Organization',
                            date: '2026',
                            skills: ['Web Development']
                          }
                        ]);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Certification</span>
                    </button>
                  </div>
                </div>

                {certsList.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const copy = [...certsList];
                          copy[idx].title = e.target.value;
                          setCertsList(copy);
                        }}
                        placeholder="Certification Title"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-bold text-xs"
                      />
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setCertsList(certsList.filter((_, i) => i !== idx));
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const copy = [...certsList];
                          copy[idx].issuer = e.target.value;
                          setCertsList(copy);
                        }}
                        placeholder="Issuer"
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => {
                          const copy = [...certsList];
                          copy[idx].date = e.target.value;
                          setCertsList(copy);
                        }}
                        placeholder="Year"
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                      />
                    </div>

                    {/* Attached File Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900/80 gap-2">
                      {cert.fileUrl ? (
                        <div className="flex items-center gap-2 overflow-hidden text-xs text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                          <FileText className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                          <span className="truncate max-w-[180px] font-mono text-[11px]">{cert.fileName || 'Attached Certificate File'}</span>
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              const copy = [...certsList];
                              delete copy[idx].fileUrl;
                              delete copy[idx].fileName;
                              delete copy[idx].fileType;
                              setCertsList(copy);
                            }}
                            className="text-slate-400 hover:text-rose-400 text-[10px] font-semibold ml-1"
                            title="Remove file"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No certificate file attached</span>
                      )}

                      <label className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition-colors">
                        <Upload className="w-3 h-3 text-purple-400" />
                        <span>{cert.fileUrl ? 'Replace File' : 'Attach File'}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            soundFx.playClick();
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const result = evt.target?.result as string;
                              const copy = [...certsList];
                              copy[idx] = {
                                ...copy[idx],
                                fileUrl: result,
                                fileName: file.name,
                                fileType: file.type,
                              };
                              setCertsList(copy);
                              soundFx.playSuccess();
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveAcademics}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Academics & Certs</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT / IMPORT / RESET */}
          {activeTab === 'json' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-slate-300 text-xs space-y-2">
                <h4 className="font-bold text-sky-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Backup & Export Options
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  You can download your entire customized portfolio configuration as a JSON file, or restore default values anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Export Button */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    exportJSON();
                  }}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 text-left space-y-2 transition-all group"
                >
                  <div className="p-2.5 w-fit rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-white text-xs">Export JSON Backup</h5>
                  <p className="text-[11px] text-slate-400">Download your edited portfolio details as a `.json` backup file.</p>
                </button>

                {/* Import Button */}
                <label className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-left space-y-2 transition-all cursor-pointer group">
                  <div className="p-2.5 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-white text-xs">Import JSON File</h5>
                  <p className="text-[11px] text-slate-400">Upload a previously saved portfolio JSON file to load your details.</p>
                  <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 text-left space-y-2 transition-all group"
                >
                  <div className="p-2.5 w-fit rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-white text-xs">Reset to Defaults</h5>
                  <p className="text-[11px] text-slate-400">Wipe custom browser storage and restore original Santhosh R portfolio details.</p>
                </button>

              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Code className="w-3.5 h-3.5 text-sky-400" />
            LocalStorage Active
          </span>
          <button
            onClick={() => {
              soundFx.playClick();
              closeEditor();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close Editor
          </button>
        </div>

      </div>
    </div>
  );
};
