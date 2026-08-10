import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import { CopyButton } from './CopyButton';
import santhoshAvatarImg from '../assets/images/santhosh_developer_id_photo_1784902447117.jpg';
import {
  Github,
  GitFork,
  Star,
  Users,
  BookOpen,
  Activity,
  RefreshCw,
  ExternalLink,
  Code,
  Sparkles,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  location?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  topics?: string[];
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url?: string };
  created_at: string;
  payload: any;
}

const FALLBACK_PROFILE: GitHubProfile = {
  login: 'rsanthosh8294',
  name: 'Santhosh R',
  avatar_url: santhoshAvatarImg,
  bio: 'Full Stack Web Developer & Computer Science Student. Specializing in React, TypeScript, Tailwind CSS, Java, and modern web applications.',
  public_repos: 8,
  public_gists: 2,
  followers: 18,
  following: 14,
  created_at: '2023-01-15T10:00:00Z',
  html_url: 'https://github.com/rsanthosh8294',
  location: 'Coimbatore, Tamil Nadu, India'
};

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: 'santhosh-r-portfolio-3d',
    full_name: 'rsanthosh8294/santhosh-r-portfolio-3d',
    description: 'Interactive 3D developer portfolio built with React, Three.js, Canvas, Audio Synthesis, and Tailwind CSS.',
    html_url: 'https://github.com/rsanthosh8294/santhosh-r-portfolio-3d',
    stargazers_count: 12,
    forks_count: 3,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    fork: false,
    topics: ['react', 'threejs', 'tailwindcss', 'portfolio']
  },
  {
    id: 102,
    name: 'cgpa-calculator-coimbatore',
    full_name: 'rsanthosh8294/cgpa-calculator-coimbatore',
    description: 'Anna University CGPA & SGPA grade calculator web application with custom credit weighting.',
    html_url: 'https://github.com/rsanthosh8294/cgpa-calculator-coimbatore',
    stargazers_count: 8,
    forks_count: 2,
    language: 'TypeScript',
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    fork: false,
    topics: ['cgpa-calculator', 'anna-university', 'react']
  },
  {
    id: 103,
    name: 'fullstack-student-management',
    full_name: 'rsanthosh8294/fullstack-student-management',
    description: 'Java Swing and JDBC student record management system with MySQL backend.',
    html_url: 'https://github.com/rsanthosh8294/fullstack-student-management',
    stargazers_count: 5,
    forks_count: 1,
    language: 'Java',
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    fork: false,
    topics: ['java', 'jdbc', 'mysql', 'swing']
  },
  {
    id: 104,
    name: 'react-tailwind-ui-kit',
    full_name: 'rsanthosh8294/react-tailwind-ui-kit',
    description: 'Collection of accessible, animated UI components designed with React and Tailwind CSS.',
    html_url: 'https://github.com/rsanthosh8294/react-tailwind-ui-kit',
    stargazers_count: 7,
    forks_count: 2,
    language: 'JavaScript',
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    fork: false,
    topics: ['tailwindcss', 'react', 'ui-components']
  },
  {
    id: 105,
    name: 'python-data-structures-algorithms',
    full_name: 'rsanthosh8294/python-data-structures-algorithms',
    description: 'Data structures and algorithms implementation library with time complexity analysis.',
    html_url: 'https://github.com/rsanthosh8294/python-data-structures-algorithms',
    stargazers_count: 4,
    forks_count: 1,
    language: 'Python',
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    fork: false,
    topics: ['python', 'dsa', 'algorithms']
  },
  {
    id: 106,
    name: 'web-dev-learning-roadmap',
    full_name: 'rsanthosh8294/web-dev-learning-roadmap',
    description: 'Curated HTML, CSS, JavaScript, and React code samples for computer science students.',
    html_url: 'https://github.com/rsanthosh8294/web-dev-learning-roadmap',
    stargazers_count: 6,
    forks_count: 2,
    language: 'HTML',
    updated_at: new Date(Date.now() - 432000000).toISOString(),
    fork: false,
    topics: ['html', 'css', 'javascript', 'roadmap']
  }
];

const FALLBACK_EVENTS: GitHubEvent[] = [
  {
    id: 'evt-1',
    type: 'PushEvent',
    repo: { name: 'rsanthosh8294/santhosh-r-portfolio-3d' },
    created_at: new Date().toISOString(),
    payload: { commits: [{ message: 'feat: add interactive VS Code access modal and code copy features' }] }
  },
  {
    id: 'evt-2',
    type: 'CreateEvent',
    repo: { name: 'rsanthosh8294/cgpa-calculator-coimbatore' },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    payload: {}
  },
  {
    id: 'evt-3',
    type: 'WatchEvent',
    repo: { name: 'facebook/react' },
    created_at: new Date(Date.now() - 172800000).toISOString(),
    payload: {}
  }
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  C: '#555555',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB'
};

export const GitHubStats: React.FC = () => {
  const { personalInfo, openEditor } = usePortfolio();
  
  // Clean raw username string (strip @ and invalid chars like spaces or dots)
  const rawUsername = personalInfo.githubUser || 'rsanthosh8294';
  const cleanUsername = rawUsername.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9-]/g, '');

  const [targetUsername, setTargetUsername] = useState<string>(cleanUsername || 'rsanthosh8294');
  const [handleInput, setHandleInput] = useState<string>(cleanUsername || 'rsanthosh8294');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'activity'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  // Keep targetUsername synced with context changes if cleanUsername changes
  useEffect(() => {
    if (cleanUsername) {
      setTargetUsername(cleanUsername);
      setHandleInput(cleanUsername);
    }
  }, [cleanUsername]);

  const fetchGitHubData = useCallback(async (userToFetch?: string) => {
    const user = (userToFetch || targetUsername || 'rsanthosh8294').trim().replace(/^@/, '').replace(/[^a-zA-Z0-9-]/g, '');
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [profileRes, reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(user)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=100`),
        fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=10`)
      ]);

      if (!profileRes.ok) {
        // If searching default user or fallback user and API failed (e.g. 404 or 403 rate limit)
        if (user === cleanUsername || user === 'rsanthosh8294') {
          console.info(`Using curated portfolio fallback data for @${user}`);
          setProfile(FALLBACK_PROFILE);
          setRepos(FALLBACK_REPOS);
          setEvents(FALLBACK_EVENTS);
          setIsUsingFallback(true);
          setTargetUsername(user);
          return;
        }

        if (profileRes.status === 404) {
          throw new Error(`GitHub handle "${user}" was not found.`);
        } else if (profileRes.status === 403) {
          throw new Error('GitHub API rate limit reached. Displaying portfolio fallback profile.');
        } else {
          throw new Error(`Failed to fetch GitHub profile for "${user}".`);
        }
      }

      const profileData: GitHubProfile = await profileRes.json();
      const reposData: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];
      const eventsData: GitHubEvent[] = eventsRes.ok ? await eventsRes.json() : [];

      setProfile(profileData);
      setRepos(Array.isArray(reposData) ? reposData.filter(r => !r.fork) : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setTargetUsername(user);
      setIsUsingFallback(false);
    } catch (err: any) {
      console.error('GitHub API error:', err);
      // Fallback to portfolio profile if fetching fails
      if (user === cleanUsername || user === 'rsanthosh8294') {
        setProfile(FALLBACK_PROFILE);
        setRepos(FALLBACK_REPOS);
        setEvents(FALLBACK_EVENTS);
        setIsUsingFallback(true);
        setError(null);
      } else {
        setError(err.message || 'Error connecting to GitHub API');
      }
    } finally {
      setLoading(false);
    }
  }, [targetUsername, cleanUsername]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    soundFx.playClick();
    const clean = handleInput.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9-]/g, '');
    setTargetUsername(clean);
    fetchGitHubData(clean);
  };

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  // Derived Statistics
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

  // Language Breakdown
  const languageCounts: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  const languageStats = Object.entries(languageCounts)
    .map(([lang, count]) => ({
      name: lang,
      count,
      percentage: totalLangRepos > 0 ? Math.round((count / totalLangRepos) * 100) : 0,
      color: LANGUAGE_COLORS[lang] || '#38bdf8'
    }))
    .sort((a, b) => b.count - a.count);

  const availableLanguages = ['All', ...languageStats.map((l) => l.name)];

  // Filtered Repositories
  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  const formatEventType = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return 'Pushed commits to';
      case 'CreateEvent':
        return 'Created repository/branch at';
      case 'WatchEvent':
        return 'Starred repository';
      case 'ForkEvent':
        return 'Forked repository';
      case 'PullRequestEvent':
        return 'Opened pull request in';
      case 'IssuesEvent':
        return 'Activity on issue in';
      default:
        return 'Updated';
    }
  };

  return (
    <section id="github" className="py-20 relative z-10 bg-[#0a0d14]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-sky-500/20 text-sky-400 text-xs font-mono">
              <Github className="w-4 h-4 text-sky-400" />
              <span>Real-Time GitHub Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Open Source & Live Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Activity</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Live metrics, top repositories, and activity stream synchronized directly from GitHub user{' '}
              <a
                href={`https://github.com/${profile?.login || targetUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 underline hover:text-sky-300 font-mono"
              >
                @{profile?.login || targetUsername}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Live Username Lookup Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="GitHub handle..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-sky-500 text-xs text-white placeholder-slate-500 outline-none transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-semibold shrink-0 transition-colors"
              >
                Lookup
              </button>
            </form>

            <button
              onClick={() => {
                soundFx.playClick();
                fetchGitHubData();
              }}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Syncing...' : 'Sync Stats'}</span>
            </button>

            <a
              href={personalInfo.githubUrl || `https://github.com/${profile?.login || targetUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              <span>Visit Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Fallback Banner */}
        {isUsingFallback && (
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs flex items-center justify-between flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Displaying curated developer portfolio statistics for <strong>@{targetUsername}</strong>. Type any live GitHub handle in the box above to fetch live public statistics.
              </span>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                fetchGitHubData();
              }}
              className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-[11px] font-semibold transition-colors shrink-0"
            >
              Re-Sync API
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-8 bg-slate-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setTargetUsername(cleanUsername || 'rsanthosh8294');
                  setHandleInput(cleanUsername || 'rsanthosh8294');
                  fetchGitHubData(cleanUsername || 'rsanthosh8294');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Reset to Santhosh R
              </button>
              <button
                onClick={() => fetchGitHubData()}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Stats Cards */}
        {profile && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1: Repos */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-sky-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono font-medium">Public Repos</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.public_repos}
                </p>
                <span className="text-[11px] text-slate-400">Active projects & tools</span>
              </div>

              {/* Card 2: Total Stars */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono font-medium">Total Stars</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {totalStars}
                </p>
                <span className="text-[11px] text-slate-400">Across public repositories</span>
              </div>

              {/* Card 3: Total Forks */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono font-medium">Repository Forks</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <GitFork className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {totalForks}
                </p>
                <span className="text-[11px] text-slate-400">Community contributions</span>
              </div>

              {/* Card 4: Followers */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-mono font-medium">Followers</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.followers}
                </p>
                <span className="text-[11px] text-slate-400">{profile.following} following</span>
              </div>

            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('overview');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Overview & Languages
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('repos');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'repos'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Repositories ({repos.length})
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('activity');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'activity'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Recent Stream
                </button>
              </div>

              {activeTab === 'repos' && (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Language filter */}
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-sky-500 outline-none"
                  >
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>

                  {/* Search repo input */}
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search repos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* TAB 1: OVERVIEW & LANGUAGES */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Profile Info Card */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || profile.login}
                      className="w-16 h-16 rounded-2xl border-2 border-sky-500/30 object-cover shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{profile.name || profile.login}</h3>
                      <p className="text-xs font-mono text-sky-400">@{profile.login}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                      </p>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60 italic">
                      "{profile.bio}"
                    </p>
                  )}

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      GitHub Profile Quick Links
                    </h4>
                    <div className="flex flex-col gap-2 text-xs">
                      <a
                        href={profile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 text-slate-200 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Github className="w-4 h-4 text-sky-400" />
                          <span>View Official Profile</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>

                      <a
                        href={`${profile.html_url}?tab=repositories`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 text-slate-200 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                          <span>All Repositories ({profile.public_repos})</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Language Breakdown */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Code className="w-4 h-4 text-sky-400" />
                        <span>Language Distribution</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Based on primary language across public non-forked repositories
                      </p>
                    </div>
                    <span className="text-xs font-mono text-sky-400 font-semibold">
                      {languageStats.length} Languages
                    </span>
                  </div>

                  {/* Multi-color Progress bar */}
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                    {languageStats.map((lang) => (
                      <div
                        key={lang.name}
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: lang.color
                        }}
                        title={`${lang.name}: ${lang.percentage}%`}
                        className="h-full transition-all duration-500"
                      />
                    ))}
                  </div>

                  {/* Language Grid items */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {languageStats.map((lang) => (
                      <div
                        key={lang.name}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: lang.color }}
                          />
                          <span className="text-xs font-semibold text-slate-200">{lang.name}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{lang.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REPOSITORIES GRID */}
            {activeTab === 'repos' && (
              <div>
                {filteredRepos.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 rounded-2xl bg-slate-900/40 border border-slate-800">
                    <p className="text-sm">No repositories found matching your filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRepos.slice(0, 12).map((repo) => (
                      <div
                        key={repo.id}
                        className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundFx.playClick()}
                              className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors truncate flex items-center gap-1.5"
                            >
                              <span>{repo.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0 transition-colors" />
                            </a>
                            <CopyButton
                              textToCopy={`git clone ${repo.html_url}.git`}
                              label="Clone"
                              copiedLabel="Copied!"
                              variant="ghost"
                              title={`Copy "git clone ${repo.html_url}.git"`}
                              className="text-[10px] py-0.5 px-2"
                            />
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {repo.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
                          {repo.language ? (
                            <span className="flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#38bdf8' }}
                              />
                              <span>{repo.language}</span>
                            </span>
                          ) : (
                            <span>Code</span>
                          )}

                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                              <Star className="w-3.5 h-3.5 text-amber-400/80" />
                              <span>{repo.stargazers_count}</span>
                            </span>
                            <span className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                              <GitFork className="w-3.5 h-3.5 text-indigo-400/80" />
                              <span>{repo.forks_count}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RECENT STREAM */}
            {activeTab === 'activity' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>Public Activity Stream</span>
                </h3>

                {events.length === 0 ? (
                  <p className="text-xs text-slate-400">No recent public GitHub activity found.</p>
                ) : (
                  <div className="space-y-3">
                    {events.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/60 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-slate-300 font-medium">
                              {formatEventType(evt.type)}{' '}
                            </span>
                            <a
                              href={`https://github.com/${evt.repo.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-400 font-mono hover:underline font-semibold"
                            >
                              {evt.repo.name}
                            </a>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 shrink-0">
                          {new Date(evt.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
