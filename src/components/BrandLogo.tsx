import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const [imgError, setImgError] = useState(false);

  const heightClass =
    size === 'sm' ? 'h-9 sm:h-10' : size === 'lg' ? 'h-14 sm:h-16' : 'h-11 sm:h-13';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Uploaded Brand Logo: 0dc0b976-6da9-449a-8141-655864a75b91.png */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-lg bg-[#080B12]">
        {!imgError ? (
          <img
            src="/0dc0b976-6da9-449a-8141-655864a75b91.png"
            alt="RAGHAV GARMENTS Official Logo"
            className={`${heightClass} w-auto max-w-[190px] sm:max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-102`}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-Fidelity SVG Fallback in exact Royal Blue and Black */
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#080B12] rounded-xl border border-slate-800">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 flex-shrink-0"
            >
              <rect width="100" height="100" rx="16" fill="#080B12" />
              <path d="M24 20V80H36V52H56C66 52 74 46 74 36C74 26 66 20 56 20H24Z" fill="#1455D9" />
              <path d="M48 48L72 80H58L38 52H48Z" fill="#1455D9" />
              <path d="M42 34V68L50 56L42 34Z" fill="#FFFFFF" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-black text-white tracking-wider text-sm font-heading">
                RAGHAV
              </span>
              <span className="font-bold text-[#1455D9] tracking-widest text-[10px] uppercase font-heading">
                GARMENTS
              </span>
            </div>
          </div>
        )}
      </div>

      {showText && (
        <span className="text-[10px] uppercase tracking-widest text-slate-400 hidden xl:inline font-semibold">
          Style That Defines You
        </span>
      )}
    </div>
  );
};
