import React from 'react';

interface MontajiLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const MontajiLogo: React.FC<MontajiLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300"
      >
        {/* Orbit Path */}
        <path
          d="M 120 105 A 130 130 0 1 1 290 280 A 130 130 0 0 1 75 190"
          stroke="#1f5b70"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Gold Ring Node */}
        <circle cx="70" cy="155" r="28" fill="#c59b5f" />
        <circle cx="70" cy="155" r="14" fill="#ffffff" />

        {/* Bottom Gold Node */}
        <circle cx="178" cy="324" r="22" fill="#c59b5f" />

        {/* Shopping Bag Handle */}
        <path
          d="M 260 120 C 260 85, 305 85, 305 120"
          stroke="#1f5b70"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Shopping Bag Body */}
        <path
          d="M 235 120 L 330 120 L 340 220 C 340 226, 335 230, 328 230 L 238 230 C 231 230, 226 226, 226 220 Z"
          fill="#1f5b70"
        />
        <circle cx="255" cy="140" r="7" fill="#ffffff" />
        <circle cx="305" cy="140" r="7" fill="#ffffff" />
        <rect x="256" y="160" width="48" height="42" rx="12" fill="#ffffff" />
        <rect x="266" y="170" width="28" height="22" rx="6" fill="#1f5b70" />

        {/* House Outline */}
        <path
          d="M 180 135 L 105 205 L 123 205 L 123 285 L 255 285 L 255 205 L 273 205 Z"
          stroke="#1f5b70"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Center Person */}
        <circle cx="177" cy="205" r="21" fill="#1f5b70" />
        <path d="M 148 285 C 148 240, 206 240, 206 285 Z" fill="#1f5b70" />

        {/* Left Person */}
        <circle cx="135" cy="225" r="16" fill="#1f5b70" />
        <path d="M 112 285 C 112 250, 158 250, 158 285 Z" fill="#1f5b70" />

        {/* Right Person */}
        <circle cx="221" cy="225" r="16" fill="#1f5b70" />
        <path d="M 198 285 C 198 250, 244 250, 244 285 Z" fill="#1f5b70" />
      </svg>

      {showText && (
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#153e4d] tracking-tight">مُنتجي</span>
            <span className="text-[10px] bg-[#c59b5f]/15 text-[#9e763b] font-bold px-1.5 py-0.5 rounded border border-[#c59b5f]/30">
              عُمان
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            منظومة ريادة الأعمال والابتكار
          </p>
        </div>
      )}
    </div>
  );
};
