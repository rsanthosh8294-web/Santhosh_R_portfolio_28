import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconOnly?: boolean;
  variant?: 'subtle' | 'gradient' | 'badge' | 'ghost';
  title?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  iconOnly = false,
  variant = 'subtle',
  title = 'Copy to clipboard'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      soundFx.playSuccess();

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return copied
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border-sky-500/30';
      case 'badge':
        return copied
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-sky-500/40';
      case 'ghost':
        return copied
          ? 'text-emerald-400 bg-emerald-500/10'
          : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800/60';
      case 'subtle':
      default:
        return copied
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : 'bg-slate-900/90 hover:bg-slate-800 text-sky-400 border-slate-800 hover:border-sky-500/40';
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      onMouseEnter={() => soundFx.playHover()}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all duration-200 cursor-pointer ${getVariantStyles()} ${className}`}
      title={copied ? 'Copied to clipboard' : title}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
          {!iconOnly && <span className="text-emerald-300 font-semibold">{copiedLabel}</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 shrink-0" />
          {!iconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
