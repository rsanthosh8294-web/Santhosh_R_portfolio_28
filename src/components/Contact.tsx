import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { CopyButton } from './CopyButton';
import { HeaderScrollingLine } from './HeaderScrollingLine';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  CheckCircle2,
  Sparkles,
  MessageSquareCode,
  Sliders,
  Calendar,
  Clock
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { personalInfo, openEditor } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFx.playClick();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      soundFx.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>05 // GET IN TOUCH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Let's Build Something <br />
            <span className="gradient-text">Great Together</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Have a project in mind, an opportunity, or a question? Send me a direct message!
          </p>

          <HeaderScrollingLine
            speed="fast"
            items={[
              '✦ OPEN FOR SOFTWARE ENGINEERING ROLES',
              '✦ RSANTHOSH8294@GMAIL.COM',
              '✦ +91 82483 31802',
              '✦ CHENNAI / THIRUVALLUR, TAMIL NADU',
              '✦ BWM-SMOKY.VERCEL.APP',
            ]}
          />
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Social Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-2xl font-bold text-white">
                  Contact Information
                </h3>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    openEditor();
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>Edit Contact Info</span>
                </button>
              </div>

              {personalInfo.availabilityStatus && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold">{personalInfo.availabilityStatus}</span>
                </div>
              )}

              <p className="text-slate-300 text-sm leading-relaxed">
                Feel free to reach out via email or phone. I am actively seeking full-time and entry-level web developer roles in {personalInfo.location}.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-4">
              {/* Email */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-sky-500/40 flex items-center justify-between gap-4 group transition-colors">
                <a
                  href={`mailto:${personalInfo.email}`}
                  onMouseEnter={() => soundFx.playHover()}
                  className="flex items-center gap-4 flex-1"
                >
                  <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Direct Email</p>
                    <p className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {personalInfo.email}
                    </p>
                  </div>
                </a>
                <CopyButton
                  textToCopy={personalInfo.email}
                  label="Copy Email"
                  copiedLabel="Copied Email!"
                  variant="gradient"
                />
              </div>

              {/* Phone */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-4 group transition-colors">
                <a
                  href={`tel:${personalInfo.phone}`}
                  onMouseEnter={() => soundFx.playHover()}
                  className="flex items-center gap-4 flex-1"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Phone Number</p>
                    <p className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {personalInfo.phone}
                    </p>
                  </div>
                </a>
                <CopyButton
                  textToCopy={personalInfo.phone}
                  label="Copy Phone"
                  copiedLabel="Copied Phone!"
                  variant="subtle"
                />
              </div>

              {/* Location */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">Location</p>
                  <p className="text-base font-bold text-white">
                    {personalInfo.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Connect via Social Networks:
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="p-3.5 rounded-2xl bg-slate-900 hover:bg-sky-600 border border-slate-800 text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg shadow-sky-600/10"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all duration-300 hover:scale-110"
                  title="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="p-3.5 rounded-2xl bg-slate-900 hover:bg-rose-600 border border-slate-800 text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg shadow-rose-600/10"
                  title="Instagram Profile"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center justify-between">
              <span>Send Me a Message</span>
              <Sparkles className="w-5 h-5 text-sky-400" />
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  Thank you for getting in touch, {formData.name}! I will read your message and reply as soon as possible.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Santhosh, I saw your portfolio and would like to discuss..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => soundFx.playHover()}
                  className="w-full py-3.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 hover:opacity-95 shadow-lg shadow-sky-400/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="text-xs font-mono">Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message Now</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
