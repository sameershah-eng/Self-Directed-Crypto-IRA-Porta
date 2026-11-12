import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type = 'success', duration = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, description, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        className="fixed z-50 pointer-events-none flex flex-col gap-2 p-4 
                   bottom-4 right-4 max-w-sm w-full sm:bottom-6 sm:right-6"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon =
              toast.type === 'error'
                ? XCircle
                : toast.type === 'warning'
                ? AlertCircle
                : toast.type === 'info'
                ? Info
                : CheckCircle2;

            const iconColor =
              toast.type === 'error'
                ? 'text-rose-500'
                : toast.type === 'warning'
                ? 'text-amber-500'
                : toast.type === 'info'
                ? 'text-sky-500'
                : 'text-emerald-500';

            const borderColor =
              toast.type === 'error'
                ? 'border-rose-200'
                : toast.type === 'warning'
                ? 'border-amber-200'
                : toast.type === 'info'
                ? 'border-sky-200'
                : 'border-emerald-200';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border ${borderColor} text-slate-900`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">{toast.title}</h4>
                  {toast.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
