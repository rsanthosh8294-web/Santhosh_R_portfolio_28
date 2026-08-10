import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';
import { Volume2, VolumeX, Radio, ChevronDown, ChevronUp, Sparkles, SlidersHorizontal } from 'lucide-react';

export const AmbientAudioWidget: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(soundFx.enabled);
  const [volume, setVolume] = useState(soundFx.ambientVolume);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = soundFx.subscribe((enabled, vol) => {
      setIsEnabled(enabled);
      setVolume(vol);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    const nextState = soundFx.toggleSound();
    setIsEnabled(nextState);
  };

  const handleVolumeChange = (newVol: number) => {
    soundFx.setVolume(newVol);
    setVolume(newVol);
    soundFx.playHover();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 font-sans select-none">
      
      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="w-64 p-4 rounded-2xl bg-slate-950/90 border border-sky-500/30 backdrop-blur-xl shadow-2xl shadow-sky-950/50 text-slate-100 animate-fadeIn space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isEnabled ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Ambient Sound
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {isEnabled ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Subtle WebAudio sci-fi drone & interactive sound effects for an immersive experience.
          </p>

          {/* Volume Preset Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Volume Level</span>
              <span className="text-sky-400 font-semibold">{Math.round(volume * 2000)}%</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Low', val: 0.015 },
                { label: 'Subtle', val: 0.025 },
                { label: 'Rich', val: 0.045 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleVolumeChange(preset.val)}
                  className={`py-1.5 px-2 text-[11px] font-mono rounded-lg border transition-all ${
                    Math.abs(volume - preset.val) < 0.005
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Synth Engine
            </span>
            <span>A-Minor 110Hz</span>
          </div>
        </div>
      )}

      {/* Primary Floating Toggle Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-sky-500/40 backdrop-blur-xl shadow-xl transition-all group">
        
        {/* Main Mute/Unmute Action Button */}
        <button
          onClick={handleToggle}
          onMouseEnter={() => soundFx.playHover()}
          className={`px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all text-xs font-semibold ${
            isEnabled
              ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-400/30 shadow-lg shadow-sky-500/10'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
          title={isEnabled ? 'Mute Background Audio' : 'Unmute Background Ambient Sound'}
        >
          {isEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
              <div className="flex items-center gap-1">
                {/* Equalizer Spectrum Bars Animation */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-sky-400 rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_300ms] h-2" />
                  <span className="w-0.5 bg-sky-300 rounded-full animate-[bounce_1s_infinite_200ms] h-3" />
                  <span className="w-0.5 bg-purple-400 rounded-full animate-[bounce_1s_infinite_400ms] h-1.5" />
                </div>
                <span className="font-mono text-[11px] tracking-wide ml-1">AUDIO ON</span>
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-[11px] tracking-wide">AUDIO MUTED</span>
            </>
          )}
        </button>

        {/* Expand Controls Drawer Toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            setIsExpanded(!isExpanded);
          }}
          onMouseEnter={() => soundFx.playHover()}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition-colors"
          title="Audio Settings"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
        </button>

      </div>
    </div>
  );
};
