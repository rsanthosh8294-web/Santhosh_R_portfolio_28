import React from 'react';
import { Sparkles, Code2, Zap } from 'lucide-react';

interface HeaderScrollingLineProps {
  items?: string[];
  speed?: 'normal' | 'fast';
  reverse?: boolean;
  className?: string;
  showLaserUnderline?: boolean;
}

export const HeaderScrollingLine: React.FC<HeaderScrollingLineProps> = ({
  items = [
    '✦ SANTHOSH R',
    '✦ FULL STACK DEVELOPER',
    '✦ B.E. CSE (CGPA 8.01)',
    '✦ REACT 18 & THREE.JS',
    '✦ INSTANT UPLOAD PORTFOLIO',
    '✦ LIVE ON BWM-SMOKY.VERCEL.APP',
    '✦ OPEN FOR TECH ROLES',
  ],
  speed = 'normal',
  reverse = false,
  className = '',
  showLaserUnderline = true,
}) => {
  // Duplicate array 3x to ensure smooth infinite loop
  const triplicatedItems = [...items, ...items, ...items, ...items];
  const animationClass = reverse
    ? 'animate-marquee-reverse'
    : speed === 'fast'
    ? 'animate-marquee-fast'
    : 'animate-marquee';

  return (
    <div className={`w-full overflow-hidden select-none py-1.5 my-2 ${className}`}>
      {/* Infinite Marquee Ticker */}
      <div className="relative w-full overflow-hidden flex items-center bg-slate-950/60 backdrop-blur-md border-y border-slate-800/80 shadow-inner">
        {/* Left/Right Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className={`${animationClass} gap-6 items-center py-2 px-4`}>
          {triplicatedItems.map((text, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-sky-400 hover:text-purple-300 transition-colors whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Laser Scrolling Line Underline */}
      {showLaserUnderline && (
        <div className="w-full h-[2px] scrolling-header-laser mt-1 rounded-full opacity-80" />
      )}
    </div>
  );
};
