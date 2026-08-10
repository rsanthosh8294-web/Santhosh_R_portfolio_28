import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PERSONAL_INFO,
  SOFT_SKILLS,
  TECHNICAL_SKILLS,
  TOOLS_AND_PLATFORMS,
  PROJECTS,
  EDUCATION_HISTORY,
  CERTIFICATIONS
} from '../data/portfolioData';
import { Project, Skill, ToolItem, EducationItem, SoftSkill, Certification } from '../types';

export type PersonalInfoType = typeof PERSONAL_INFO;
export type ThemeMode = 'cyber' | 'emerald' | 'sunset' | 'light';

interface PortfolioContextType {
  personalInfo: PersonalInfoType;
  softSkills: SoftSkill[];
  technicalSkills: Skill[];
  tools: ToolItem[];
  projects: Project[];
  educationHistory: EducationItem[];
  certifications: Certification[];
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  isEditorOpen: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  updatePersonalInfo: (data: Partial<PersonalInfoType>) => void;
  updateTechnicalSkills: (skills: Skill[]) => void;
  updateSoftSkills: (skills: SoftSkill[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateEducation: (edu: EducationItem[]) => void;
  updateCertifications: (certs: Certification[]) => void;
  resetAllData: () => void;
  importJSON: (jsonStr: string) => boolean;
  exportJSON: () => void;
}

const STORAGE_KEY = 'santhosh_portfolio_custom_data_v1';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(PERSONAL_INFO);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>(SOFT_SKILLS);
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>(TECHNICAL_SKILLS);
  const [tools, setTools] = useState<ToolItem[]>(TOOLS_AND_PLATFORMS);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [educationHistory, setEducationHistory] = useState<EducationItem[]>(EDUCATION_HISTORY);
  const [certifications, setCertifications] = useState<Certification[]>(CERTIFICATIONS);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('cyber');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Sync theme attribute on document root whenever themeMode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('santhosh_portfolio_theme_v1', mode);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleThemeMode = () => {
    const modes: ThemeMode[] = ['cyber', 'emerald', 'sunset', 'light'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
  };

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('santhosh_portfolio_theme_v1') as ThemeMode;
      if (savedTheme && ['cyber', 'emerald', 'sunset', 'light'].includes(savedTheme)) {
        setThemeModeState(savedTheme);
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo) {
          setPersonalInfo({ ...parsed.personalInfo, liveUrl: parsed.personalInfo.liveUrl?.includes('deploy-site-six-kappa') ? 'https://bwm-smoky.vercel.app' : (parsed.personalInfo.liveUrl || 'https://bwm-smoky.vercel.app') });
        }
        if (parsed.softSkills) setSoftSkills(parsed.softSkills);
        if (parsed.technicalSkills) setTechnicalSkills(parsed.technicalSkills);
        if (parsed.tools) setTools(parsed.tools);
        if (parsed.projects) {
          const hasBwm = parsed.projects.some((p: Project) => p.id === 'bwm-app' || p.liveUrl?.includes('bwm-smoky.vercel.app'));
          if (!hasBwm) {
            const bwmProj = PROJECTS.find((p) => p.id === 'bwm-app');
            setProjects(bwmProj ? [bwmProj, ...parsed.projects] : parsed.projects);
          } else {
            setProjects(parsed.projects);
          }
        }
        if (parsed.educationHistory) setEducationHistory(parsed.educationHistory);
        if (parsed.certifications) setCertifications(parsed.certifications);
      }
    } catch (err) {
      console.error('Failed to load portfolio data from storage', err);
    }
  }, []);

  // Sync to localStorage whenever any state updates
  const saveAll = (
    info = personalInfo,
    tech = technicalSkills,
    soft = softSkills,
    projs = projects,
    edu = educationHistory,
    certs = certifications,
    tls = tools
  ) => {
    try {
      const payload = {
        personalInfo: info,
        technicalSkills: tech,
        softSkills: soft,
        projects: projs,
        educationHistory: edu,
        certifications: certs,
        tools: tls,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to save portfolio data to storage', err);
    }
  };

  const updatePersonalInfo = (data: Partial<PersonalInfoType>) => {
    setPersonalInfo((prev) => {
      const updated = { ...prev, ...data };
      saveAll(updated, technicalSkills, softSkills, projects, educationHistory, certifications, tools);
      return updated;
    });
  };

  const updateTechnicalSkills = (skills: Skill[]) => {
    setTechnicalSkills(skills);
    saveAll(personalInfo, skills, softSkills, projects, educationHistory, certifications, tools);
  };

  const updateSoftSkills = (skills: SoftSkill[]) => {
    setSoftSkills(skills);
    saveAll(personalInfo, technicalSkills, skills, projects, educationHistory, certifications, tools);
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    saveAll(personalInfo, technicalSkills, softSkills, newProjects, educationHistory, certifications, tools);
  };

  const updateEducation = (edu: EducationItem[]) => {
    setEducationHistory(edu);
    saveAll(personalInfo, technicalSkills, softSkills, projects, edu, certifications, tools);
  };

  const updateCertifications = (certs: Certification[]) => {
    setCertifications(certs);
    saveAll(personalInfo, technicalSkills, softSkills, projects, educationHistory, certs, tools);
  };

  const resetAllData = () => {
    setPersonalInfo(PERSONAL_INFO);
    setSoftSkills(SOFT_SKILLS);
    setTechnicalSkills(TECHNICAL_SKILLS);
    setTools(TOOLS_AND_PLATFORMS);
    setProjects(PROJECTS);
    setEducationHistory(EDUCATION_HISTORY);
    setCertifications(CERTIFICATIONS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
      if (parsed.technicalSkills) setTechnicalSkills(parsed.technicalSkills);
      if (parsed.softSkills) setSoftSkills(parsed.softSkills);
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.educationHistory) setEducationHistory(parsed.educationHistory);
      if (parsed.certifications) setCertifications(parsed.certifications);
      if (parsed.tools) setTools(parsed.tools);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true;
    } catch (err) {
      console.error('Invalid portfolio JSON', err);
      return false;
    }
  };

  const exportJSON = () => {
    const data = {
      personalInfo,
      technicalSkills,
      softSkills,
      tools,
      projects,
      educationHistory,
      certifications,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `santhosh-portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        softSkills,
        technicalSkills,
        tools,
        projects,
        educationHistory,
        certifications,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        isEditorOpen,
        openEditor: () => setIsEditorOpen(true),
        closeEditor: () => setIsEditorOpen(false),
        updatePersonalInfo,
        updateTechnicalSkills,
        updateSoftSkills,
        updateProjects,
        updateEducation,
        updateCertifications,
        resetAllData,
        importJSON,
        exportJSON
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
