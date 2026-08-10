import { Project, Skill, ToolItem, EducationItem, SoftSkill, Certification, PersonalInfo } from '../types';
import cgpaPreviewImg from '../assets/images/cgpa_calculator_preview_1784886363500.jpg';
import portfolio3dPreviewImg from '../assets/images/portfolio_3d_preview_1784886390576.jpg';

export const PERSONAL_INFO: PersonalInfo = {
  name: 'Santhosh R',
  role: 'Full Stack Developer',
  location: 'Coimbatore, Tamil Nadu, India',
  email: 'rsanthosh8294@gmail.com',
  phone: '7094834531',
  githubUser: 'rsanthosh8294',
  portfolioUsername: 'rsanthosh8294-web',
  githubUrl: 'https://github.com/rsanthosh8294',
  linkedinUrl: 'https://linkedin.com/in/santhosh-r',
  instagramUrl: 'https://instagram.com/santhosh_r',
  liveUrl: 'https://bwm-smoky.vercel.app',
  tagline: 'Passionate about building modern, responsive, and user-friendly web experiences.',
  summary: 'Computer Science student with knowledge of C, Java, HTML, CSS, and basic web development. Quick learner with strong analytical skills. Seeking an entry-level opportunity to build technical expertise and contribute to organizational success.',
  availabilityStatus: 'Open for Internships & Full-Time Projects'
};

export const SOFT_SKILLS: SoftSkill[] = [
  {
    name: 'Problem Solving',
    icon: 'Brain',
    description: 'Aptitude for breaking down complex logic into clean, actionable, algorithmic solutions.'
  },
  {
    name: 'Time Management',
    icon: 'Clock',
    description: 'Disciplined approach to prioritizing tasks, meeting deadlines, and optimizing project flow.'
  },
  {
    name: 'Communication',
    icon: 'MessageSquare',
    description: 'Effective articulate teamwork, documentation, and clear presentation of ideas.'
  },
  {
    name: 'Self Learner',
    icon: 'Sparkles',
    description: 'Eager adaptability to modern technologies, frameworks, and developer toolchains.'
  }
];

export const TECHNICAL_SKILLS: Skill[] = [
  {
    name: 'HTML5',
    category: 'Frontend',
    level: 90,
    iconName: 'Code',
    color: '#E34F26',
    description: 'Semantic tags, accessibility standards, audio/video APIs, and DOM structures.'
  },
  {
    name: 'CSS3',
    category: 'Frontend',
    level: 88,
    iconName: 'Palette',
    color: '#1572B6',
    description: 'Flexbox, Grid, CSS Variables, Animations, Glassmorphic styling & Keyframes.'
  },
  {
    name: 'JavaScript',
    category: 'Languages',
    level: 85,
    iconName: 'FileCode',
    color: '#F7DF1E',
    description: 'ES6+ Syntax, Async/Await, Fetch API, Event Handling, and Array Methods.'
  },
  {
    name: 'React.js',
    category: 'Frontend',
    level: 80,
    iconName: 'Atom',
    color: '#61DAFB',
    description: 'Functional components, Hooks, Context API, state management, and Vite ecosystem.'
  },
  {
    name: 'Git & GitHub',
    category: 'Tools',
    level: 85,
    iconName: 'GitBranch',
    color: '#F05032',
    description: 'Version control, branch management, pull requests, and collaborative workflows.'
  },
  {
    name: 'Responsive Web Design',
    category: 'Frontend',
    level: 92,
    iconName: 'Layout',
    color: '#38BDF8',
    description: 'Mobile-first breakpoints, fluid typography, media queries, and touch UI.'
  },
  {
    name: 'Python',
    category: 'Languages',
    level: 78,
    iconName: 'Terminal',
    color: '#3776AB',
    description: 'Data structures, scripting, basic automation, and logic development.'
  },
  {
    name: 'Java (Basic)',
    category: 'Languages',
    level: 70,
    iconName: 'Coffee',
    color: '#5382A1',
    description: 'OOP concepts, inheritance, polymorphism, and core Java syntax.'
  },
  {
    name: 'MySQL Basics',
    category: 'Databases',
    level: 68,
    iconName: 'Database',
    color: '#4479A1',
    description: 'Relational database fundamentals, SQL queries, JOINs, and table schema creation.'
  },
  {
    name: 'Supabase',
    category: 'Backend',
    level: 72,
    iconName: 'Zap',
    color: '#3ECF8E',
    description: 'PostgreSQL-backed serverless database, Auth, Storage, and Realtime queries.'
  }
];

export const TOOLS_AND_PLATFORMS: ToolItem[] = [
  {
    name: 'GitHub',
    category: 'Version Control',
    iconName: 'Github',
    badge: 'Repositories & CI/CD'
  },
  {
    name: 'Vercel',
    category: 'Deployment',
    iconName: 'Globe',
    badge: 'Live Web Hosting'
  },
  {
    name: 'Visual Studio Code',
    category: 'IDE / Editor',
    iconName: 'Laptop',
    badge: 'Primary Development Environment'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'bwm-app',
    title: 'BWM Web Application',
    category: 'Web Application',
    description: 'A modern, high-performance web application hosted live on Vercel featuring intuitive UI components, responsive design, and smooth user experience.',
    highlights: [
      'Deployed live on Vercel edge network (bwm-smoky.vercel.app)',
      'Clean component architecture with responsive layout and fluid transitions',
      'Optimized performance, fast page loads, and modern UI controls'
    ],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    tags: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    liveUrl: 'https://bwm-smoky.vercel.app',
    githubUrl: 'https://github.com/rsanthosh8294/bwm',
    featured: true
  },
  {
    id: 'cgpa-calculator',
    title: 'CGPA & SGPA Calculator',
    category: 'Web Application',
    description: 'A web-based academic helper application developed to assist college students in calculating their SGPA and overall CGPA quickly, accurately, and intuitively.',
    highlights: [
      'Allows users to enter course grades and credit values for multiple semesters seamlessly',
      'Automatically computes SGPA for each individual semester with weighted credit point algorithms',
      'Generates cumulative overall CGPA based on completed credit hours',
      'Interactive visual GPA breakdown with printable grade reports and instant reset options'
    ],
    image: cgpaPreviewImg,
    tags: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS'],
    liveUrl: 'https://bwm-smoky.vercel.app',
    githubUrl: 'https://github.com/santhosh.R/cgpa-calculator',
    featured: true,
    interactiveDemo: 'cgpa_calculator'
  },
  {
    id: 'portfolio-3d',
    title: 'Futuristic 3D Developer Portfolio',
    category: 'Frontend & 3D WebGL',
    description: 'A modern, responsive, glassmorphic portfolio website showcasing interactive 3D particle spheres, 3D card tilts, smooth scroll animations, and interactive utility tools.',
    highlights: [
      'Built with Three.js for realtime GPU-accelerated background 3D canvas visuals',
      'Glassmorphic UI components with glowing neon gradients and dynamic backdrop filters',
      'Embedded live interactive tools including an active CGPA calculator widget and resume download modal'
    ],
    image: portfolio3dPreviewImg,
    tags: ['React', 'Three.js', 'Tailwind CSS', 'Motion'],
    liveUrl: 'https://bwm-smoky.vercel.app',
    githubUrl: 'https://github.com/santhosh.R/rsanthosh8294-web',
    featured: true
  },
  {
    id: 'fullstack-hub',
    title: 'Responsive Web Experience Hub',
    category: 'Full Stack Concept',
    description: 'A streamlined web application showcasing responsive layout techniques, database connectivity with Supabase, and clean UI components.',
    highlights: [
      'Mobile-first responsive architecture supporting all screen orientations',
      'Integrates Supabase backend tables for persistent feedback and user session state',
      'Custom dark-mode visual controls and instant form validation'
    ],
    image: 'https://picsum.photos/seed/webhub/800/600',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Supabase'],
    liveUrl: 'https://bwm-smoky.vercel.app',
    githubUrl: 'https://github.com/santhosh.R/web-experience-hub',
    featured: false
  }
];

export const EDUCATION_HISTORY: EducationItem[] = [
  {
    degree: 'B.E. Computer Science and Engineering',
    institution: 'Park College of Engineering and Technology',
    location: 'Coimbatore, Tamil Nadu',
    period: '2024 – Present',
    score: 'Pursuing Degree',
    description: 'Focused on core computer science fundamentals, data structures, object-oriented programming, database management systems, and modern web application development.',
    highlights: [
      'Active learning in Java, C, and Web Development stacks',
      'Developed academic tools including the SGPA/CGPA Calculator',
      'Engaged in technical workshops and team development initiatives'
    ]
  },
  {
    degree: 'HSC (Higher Secondary Certificate)',
    institution: 'Government Model School',
    location: 'Tamil Nadu',
    period: 'Completed',
    score: 'First Class Excellence',
    description: 'Completed higher secondary education specializing in Mathematics, Physics, Chemistry, and Computer Science with strong academic performance.',
    highlights: [
      'Built foundational understanding in mathematical logic and computer fundamentals',
      'Participated in science exhibitions and school computer projects'
    ]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Full Stack Web Development Foundations',
    issuer: 'Online Learning Platform / Academic Workshop',
    date: '2025',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI']
  },
  {
    title: 'Java Programming & OOP Fundamentals',
    issuer: 'Tech Learning Academy',
    date: '2025',
    skills: ['Java', 'Object Oriented Programming', 'Logic Building']
  },
  {
    title: 'Version Control with Git & GitHub',
    issuer: 'Developer Community Workshop',
    date: '2024',
    skills: ['Git', 'GitHub', 'Open Source', 'Collaboration']
  }
];
