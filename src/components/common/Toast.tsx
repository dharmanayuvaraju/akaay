import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-4 right-4 sm:left-auto sm:right-8 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-terracotta/40';
        let bgClass = 'bg-ink text-ivory';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-400';
          bgClass = 'bg-[#3D1414] text-white';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-marigold/50';
          bgClass = 'bg-ink text-ivory';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${borderClass} ${bgClass} text-xs sm:text-sm font-medium transition-all duration-200 transform translate-y-0`}
          >
            <Icon className="w-4 h-4 text-marigold shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
