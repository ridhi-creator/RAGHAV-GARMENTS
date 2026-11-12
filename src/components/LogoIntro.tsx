import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface LogoIntroProps {
  onDismiss: () => void;
}

export const LogoIntro: React.FC<LogoIntroProps> = ({ onDismiss }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    // Reveal logo smoothly
    const revealTimer = setTimeout(() => {
      setLogoReady(true);
    }, 100);

    // Auto fade out after 1.5 seconds
    const autoDismissTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1500);

    // Completely unmount after fade completes
    const removeTimer = setTimeout(() => {
      onDismiss();
    }, 1950);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(autoDismissTimer);
      clearTimeout(removeTimer);
    };
  }, [onDismiss]);

  const handleManualSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-label="Welcome to Raghav Garments"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#080B12] transition-opacity duration-500 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow and floating electric-blue orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[#1455D9]/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] animate-float-slow" />
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleManualSkip}
        className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
        title="Skip intro"
      >
        <span>Skip</span>
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Main Logo Intro Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        
        {/* Glow Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 bg-[#1455D9]/20 border border-[#1455D9]/50 rounded-full text-[11px] font-bold text-blue-300 tracking-wider uppercase mb-6 backdrop-blur-md transition-all duration-700 ${
            logoReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Raghav Garments Official</span>
        </div>

        {/* Official Brand Logo with electric-blue glow */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            logoReady
              ? 'opacity-100 scale-100 translate-y-0 animate-logo-glow'
              : 'opacity-0 scale-90 translate-y-4'
          }`}
        >
          <img
            src="/0dc0b976-6da9-449a-8141-655864a75b91.png"
            alt="RAGHAV GARMENTS"
            className="h-20 sm:h-24 w-auto max-w-[280px] sm:max-w-[340px] object-contain drop-shadow-[0_0_35px_rgba(20,85,217,0.85)]"
          />
        </div>

        {/* Dynamic Electric Blue Line with Shimmer */}
        <div className="w-48 h-0.5 mt-6 mb-4 bg-slate-800 relative overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1455D9] to-transparent animate-pulse" />
        </div>

        {/* Official Brand Tagline */}
        <p
          className={`text-xs sm:text-sm tracking-[0.28em] uppercase font-bold text-slate-300 transition-all duration-700 delay-150 ${
            logoReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Style That Defines You
        </p>

        <p
          className={`text-[11px] text-slate-400 mt-2 font-medium tracking-wide transition-all duration-700 delay-300 ${
            logoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Premium Men&apos;s Wear &bull; Direct Craftsmanship
        </p>
      </div>
    </div>
  );
};
