'use client';

import { Toaster as HotToaster, ToastBar } from 'react-hot-toast';
import { CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '1rem',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          padding: '0.75rem 1rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s ease',
          }}
        >
          {({ icon, message }) => (
            <div
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 min-w-[260px]',
                {
                  'bg-emerald-500 text-white': t.type === 'success',
                  'bg-red-500 text-white': t.type === 'error',
                  'bg-blue-500 text-white': t.type === 'blank',
                  'bg-neutral-800 text-white dark:bg-neutral-900': t.type === 'loading',
                }
              )}
            >
              <div className="flex-shrink-0">
                {t.type === 'success' && <CheckCircle className="h-5 w-5" />}
                {t.type === 'error' && <XCircle className="h-5 w-5" />}
                {t.type === 'blank' && <Info className="h-5 w-5" />}
                {t.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
                {icon}
              </div>
              <div className="flex-1 leading-tight">{message}</div>
            </div>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
}
