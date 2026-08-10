export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  completionDate?: string;
  interactiveDemo?: 'cgpa_calculator' | 'custom';
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Languages' | 'Databases' | 'Tools';
  level: number; // 0 - 100
  iconName: string;
  color: string;
  description: string;
}

export interface ToolItem {
  name: string;
  category: string;
  iconName: string;
  badge: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string; // e.g. "2024 – Present"
  startDate?: string;
  endDate?: string;
  score?: string;
  description: string;
  highlights: string[];
}

export interface SoftSkill {
  name: string;
  icon: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  issueDate?: string;
  credentialId?: string;
  skills: string[];
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface PersonalInfo {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  githubUser: string;
  portfolioUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  liveUrl: string;
  tagline: string;
  summary: string;
  availabilityStatus?: string;
  avatarImage?: string; // Data URL or Image URL
  customResumeFile?: string; // Data URL of PDF / File
  customResumeFileName?: string;
}

export interface CgpaSubject {
  id: string;
  name: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'RA';
}

export interface SemesterData {
  semesterNumber: number;
  subjects: CgpaSubject[];
}
