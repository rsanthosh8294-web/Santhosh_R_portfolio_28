import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  ExternalLink,
  Key,
  Shield,
  Layers,
  RefreshCw,
  Copy,
  Check,
  Server,
  Cloud,
  Globe,
  Zap,
  User,
  Activity
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelAuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tokenInput, setTokenInput] = useState<string>('');
  const [activeToken, setActiveToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'auth' | 'projects' | 'guide'>('auth');
  const [oauthUrlConfig, setOauthUrlConfig] = useState<{ configured: boolean; url?: string; redirectUri?: string }>({
    configured: false,
  });

  const callbackUrl = `${window.location.origin}/api/vercel/auth/callback`;

  // Check initial OAuth setup and existing server token status
  useEffect(() => {
    if (isOpen) {
      fetchOauthConfig();
      checkCurrentAuth();
    }
  }, [isOpen]);

  // Listen for OAuth popup postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'VERCEL_AUTH_SUCCESS') {
        const token = event.data.token;
        if (token) {
          setActiveToken(token);
          setAuthError(null);
          fetchUserProfile(token);
          fetchProjects(token);
          fetchDeployments(token);
        }
      } else if (event.data?.type === 'VERCEL_AUTH_ERROR') {
        setAuthError(event.data.error || 'Vercel authorization failed.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchOauthConfig = async () => {
    try {
      const res = await fetch('/api/vercel/auth/url');
      const data = await res.json();
      setOauthUrlConfig(data);
    } catch (e) {
      console.error('Failed to load Vercel OAuth config', e);
    }
  };

  const checkCurrentAuth = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/vercel/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated && data.user) {
        setUserProfile(data.user);
        fetchProjects(activeToken);
        fetchDeployments(activeToken);
      } else if (data.error) {
        // Not authenticated yet
        setUserProfile(null);
      }
    } catch (e: any) {
      setAuthError('Unable to connect to server API.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    soundFx.playClick();
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/vercel/auth/url');
      const data = await res.json();

      if (data.configured && data.url) {
        const popup = window.open(
          data.url,
          'vercel_oauth_popup',
          'width=600,height=700,status=no,scrollbars=yes'
        );
        if (!popup) {
          setAuthError('Popup blocker prevented opening Vercel login window. Please allow popups.');
        }
      } else {
        setAuthError('Vercel OAuth app not configured on server. Please use a Personal Access Token below or configure VERCEL_CLIENT_ID.');
      }
    } catch (e: any) {
      setAuthError('Failed to initiate Vercel OAuth login.');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    soundFx.playClick();
    setLoading(true);
    setAuthError(null);

    const token = tokenInput.trim();
    fetchUserProfile(token);
    fetchProjects(token);
    fetchDeployments(token);
  };

  const fetchUserProfile = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/vercel/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUserProfile(data.user);
        setActiveToken(token);
        setAuthError(null);
      } else {
        setAuthError(data.error || 'Failed to authenticate with Vercel Token.');
        setUserProfile(null);
      }
    } catch (e: any) {
      setAuthError('Error validating Vercel Token.');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (token?: string) => {
    try {
      const res = await fetch('/api/vercel/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token || activeToken }),
      });
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error('Error fetching Vercel projects', e);
    }
  };

  const fetchDeployments = async (token?: string) => {
    try {
      const res = await fetch('/api/vercel/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token || activeToken }),
      });
      const data = await res.json();
      if (res.ok && data.deployments) {
        setDeployments(data.deployments);
      }
    } catch (e) {
      console.error('Error fetching Vercel deployments', e);
    }
  };

  const copyCallbackUrl = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedUrl(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-lg">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 116 100">
                <path d="M57.5 0L115 100H0L57.5 0Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Vercel Authentication & Integrations
              </h2>
              <p className="text-xs text-slate-400">
                Authenticate with OAuth or Personal Access Token for live deployments
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'auth'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Authentication Status</span>
            {userProfile && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Deployments ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Setup Guide</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {authError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-xs text-red-300/80 mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* TAB 1: Authentication */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* Authenticated Profile Card */}
              {userProfile ? (
                <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {userProfile.avatar ? (
                        <img
                          src={`https://vercel.com/api/www/avatar/${userProfile.avatar}?s=80`}
                          alt="Vercel Avatar"
                          className="w-12 h-12 rounded-full border border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg border border-sky-500/30">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-100 text-lg">
                            {userProfile.name || userProfile.username}
                          </h3>
                          <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Authenticated
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">@{userProfile.username} • {userProfile.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserProfile(null);
                        setActiveToken('');
                        setProjects([]);
                        setDeployments([]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <p className="text-slate-400">Account Tier</p>
                      <p className="font-semibold text-slate-200 capitalize mt-0.5">
                        {userProfile.billing?.plan || 'Hobby / Pro'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <p className="text-slate-400">User ID</p>
                      <p className="font-mono text-slate-200 truncate mt-0.5">{userProfile.uid || userProfile.id}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                      <p className="text-slate-400">Deployments Access</p>
                      <p className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active Connection
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: OAuth Popup */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sky-400 font-semibold mb-2">
                        <Zap className="w-5 h-5" />
                        <span>OAuth 2.0 Single Click Sign-In</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Authenticate directly with your official Vercel account via secure OAuth 2.0 popup.
                      </p>
                    </div>

                    <button
                      onClick={handleOAuthLogin}
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-white hover:bg-slate-200 text-black transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 116 100">
                          <path d="M57.5 0L115 100H0L57.5 0Z" />
                        </svg>
                      )}
                      <span>Connect with Vercel OAuth</span>
                    </button>
                  </div>

                  {/* Option B: Personal Access Token */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                        <Key className="w-5 h-5" />
                        <span>Personal Access Token</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Enter a Vercel Personal Access Token generated from Vercel Account Settings.
                      </p>
                    </div>

                    <form onSubmit={handleTokenSubmit} className="space-y-2">
                      <input
                        type="password"
                        placeholder="Paste Vercel token (ver_...)"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                      />
                      <button
                        type="submit"
                        disabled={loading || !tokenInput.trim()}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        <span>Verify & Connect Token</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Deployments & Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">
                  Live Vercel Projects & Deployments
                </h3>
                <button
                  onClick={() => {
                    fetchProjects(activeToken);
                    fetchDeployments(activeToken);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800">
                  <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-300 text-sm font-medium">No Vercel Projects Loaded</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect your Vercel account or set <code className="text-sky-400">VERCEL_AUTH_TOKEN</code> in environment variables to view your projects.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-200 text-sm">{proj.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                            {proj.framework || 'Next.js / Vite'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>Updated {new Date(proj.updatedAt || Date.now()).toLocaleDateString()}</span>
                        </p>
                      </div>

                      {proj.targets?.production?.url && (
                        <a
                          href={`https://${proj.targets.production.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold flex items-center gap-1 border border-sky-500/20"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Setup Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  OAuth Redirect Callback URL
                </h3>
                <p className="text-slate-400">
                  When creating your Vercel OAuth integration in the Vercel Developer Portal, register this callback redirect URI:
                </p>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-200">
                  <span className="truncate flex-1 text-sky-300">{callbackUrl}</span>
                  <button
                    onClick={copyCallbackUrl}
                    className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-bold text-slate-200 text-sm">Required Environment Variables</h3>
                <p className="text-slate-400">
                  Configure these keys in your AI Studio settings or <code className="text-sky-400">.env</code> file:
                </p>

                <div className="space-y-2 font-mono text-[11px] text-slate-300 pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-sky-400">VERCEL_AUTH_TOKEN</span> = Personal Access Token from Vercel Account Settings
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-sky-400">VERCEL_CLIENT_ID</span> = Vercel OAuth Integration Client ID
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-sky-400">VERCEL_CLIENT_SECRET</span> = Vercel OAuth Integration Client Secret
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Vercel API Integration Operational</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
