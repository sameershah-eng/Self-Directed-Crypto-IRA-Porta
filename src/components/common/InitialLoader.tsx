import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface InitialLoaderProps {
  onComplete: () => void;
  durationMs?: number;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete, durationMs = 1600 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F8FB]"
    >
      {/* Soft background ambient gradient */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
        {/* Animated Northvault Vault Shield Monogram */}
        <div className="relative w-20 h-20 mb-6">
          <svg
            width="80"
            height="80"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="loaderGrad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="55%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>

            {/* Shield Outline Drawing */}
            <motion.path
              d="M20 3L6 8.5V19.2C6 28.1 12 36.2 20 38.5C28 36.2 34 28.1 34 19.2V8.5L20 3Z"
              stroke="url(#loaderGrad)"
              strokeWidth="2"
              fill="url(#loaderGrad)"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 1 }}
              transition={{
                pathLength: { duration: 0.9, ease: 'easeInOut' },
                fillOpacity: { delay: 0.7, duration: 0.5 },
              }}
            />

            {/* Vault Hexagon Core */}
            <motion.path
              d="M20 12L27 16V24L20 28L13 24V16L20 12Z"
              fill="white"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.95 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            />

            {/* Keyhole Arrow */}
            <motion.path
              d="M20 16.5L23 21H21V24H19V21H17L20 16.5Z"
              fill="#4F46E5"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center gap-1.5 mb-1"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900">Northvault</span>
          <span className="text-xs font-semibold text-indigo-600 font-mono px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100">IRA</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-xs text-slate-500 font-medium tracking-wide mb-6"
        >
          Securing your session…
        </motion.p>

        {/* Thin Gradient Progress Bar */}
        <div className="w-48 h-1 bg-slate-200/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <span className="text-[10px] font-mono text-slate-400 mt-2">{progress}%</span>
      </div>
    </motion.div>
  );
};
