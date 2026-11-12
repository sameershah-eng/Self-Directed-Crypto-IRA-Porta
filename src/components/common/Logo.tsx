import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: 'light' | 'dark' | 'gradient';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showWordmark = true,
  wordmarkClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Northvault Shield/Vault Monogram SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nvGradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <linearGradient id="nvInnerGlow" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Shield Outer Outline */}
        <path
          d="M20 3L6 8.5V19.2C6 28.1 12 36.2 20 38.5C28 36.2 34 28.1 34 19.2V8.5L20 3Z"
          fill="url(#nvGradient)"
          stroke="#4338CA"
          strokeWidth="1.2"
        />

        {/* Vault Hexagon / Key Core */}
        <path
          d="M20 12L27 16V24L20 28L13 24V16L20 12Z"
          fill="white"
          fillOpacity="0.92"
        />
        
        {/* North Compass Arrow Keyhole */}
        <path
          d="M20 16.5L23 21H21V24H19V21H17L20 16.5Z"
          fill="#4F46E5"
        />
      </svg>

      {showWordmark && (
        <span className={`font-bold tracking-tight text-slate-900 text-lg leading-none ${wordmarkClassName}`}>
          Northvault
          <span className="text-xs font-semibold text-indigo-600 tracking-wider ml-1.5 uppercase font-mono px-1 py-0.5 rounded bg-indigo-50 border border-indigo-100">IRA</span>
        </span>
      )}
    </div>
  );
};
