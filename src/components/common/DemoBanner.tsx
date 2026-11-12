import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, ShieldAlert, Sparkles, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';

interface DemoBannerProps {
  isReadOnly?: boolean;
  onExitReadOnly?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isReadOnly = false,
  onExitReadOnly,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if current URL or session storage has read-only mode
  const isViewAsCustomer = isReadOnly || location.search.includes('view_as=customer');

  return (
    <>
      {/* Top Banner when viewing as customer from Admin */}
      {isViewAsCustomer && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2 mx-auto">
            <ShieldAlert className="w-4 h-4 text-amber-950 shrink-0" />
            <span>Read-only session — viewing as Michael Turner. Actions disabled.</span>
          </div>
          <button
            onClick={() => {
              if (onExitReadOnly) onExitReadOnly();
              navigate('/admin');
            }}
            className="text-[11px] bg-amber-950 text-amber-100 hover:bg-amber-900 px-2.5 py-1 rounded-md transition-colors font-medium ml-4 shrink-0"
          >
            Exit to Back-Office
          </button>
        </div>
      )}

      {/* Persistent Floating Demo Pill in Bottom Left */}
      <div className="fixed bottom-4 left-4 z-40 select-none">
        <div className="relative">
          {isOpen && (
            <div className="absolute bottom-11 left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 p-3 text-xs space-y-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Prototype Demo Navigation
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">v1.0</span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                    location.pathname === '/' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                  }`}
                >
                  <span>Public Landing Page</span>
                  <span className="text-[10px] text-slate-400 font-mono">/</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/signin');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                    location.pathname === '/signin' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                  }`}
                >
                  <span>Sign-In Flow (OTP / Passkey)</span>
                  <span className="text-[10px] text-slate-400 font-mono">/signin</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/app');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                    location.pathname.startsWith('/app') ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                  }`}
                >
                  <span>Customer Portal (Michael Turner)</span>
                  <span className="text-[10px] text-slate-400 font-mono">/app</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/apply');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                    location.pathname === '/apply' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                  }`}
                >
                  <span>IRA Account Application (5 Steps)</span>
                  <span className="text-[10px] text-slate-400 font-mono">/apply</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                    location.pathname.startsWith('/admin') ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''
                  }`}
                >
                  <span>Back-Office Operations Console</span>
                  <span className="text-[10px] text-slate-400 font-mono">/admin</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
                Self-directed digital asset IRA demo. Simulated live order book & custody verification.
              </div>
            </div>
          )}

          {/* Trigger Pill */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full shadow-md border border-slate-200 text-xs font-medium backdrop-blur-md transition-all hover:scale-[1.02]"
            aria-label="Toggle demo mode quick links"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Demo — mock data</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>
    </>
  );
};
