import React, { useState, useCallback } from 'react';
import { CheckCircle2, ClipboardCheck, Download, X } from 'lucide-react';

export type ToastType = 'success' | 'copy' | 'download' | 'error';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success:  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
  copy:     <ClipboardCheck className="w-4 h-4 text-[#D95D29] shrink-0" />,
  download: <Download className="w-4 h-4 text-blue-600 shrink-0" />,
  error:    <X className="w-4 h-4 text-rose-600 shrink-0" />,
};

const COLOR_MAP: Record<ToastType, string> = {
  success:  'border-emerald-200 bg-white text-slate-900 shadow-md',
  copy:     'border-orange-200 bg-white text-slate-900 shadow-md',
  download: 'border-blue-200 bg-white text-slate-900 shadow-md',
  error:    'border-rose-200 bg-white text-slate-900 shadow-md',
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full max-w-[90vw]
            border shadow-md text-xs sm:text-sm font-medium backdrop-blur-md transition-all
            ${COLOR_MAP[t.type]}
            ${t.exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
          role="status"
        >
          {ICON_MAP[t.type]}
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-1 p-0.5 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

/* ── Hook ───────────────────────────────────────────────── */
let _toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(ts => ts.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 250);
  }, []);

  const show = useCallback((message: string, type: ToastType = 'success', duration = 2800) => {
    const id = String(++_toastId);
    setToasts(ts => [...ts, { id, type, message }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return { toasts, show, dismiss };
};
