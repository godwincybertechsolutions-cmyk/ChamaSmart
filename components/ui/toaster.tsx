'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '1rem',
          background: '#333',
          color: '#fff',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#14b8a6',
            secondary: '#fff',
          },
          style: {
            background: '#14b8a6',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#ef4444',
          },
        },
      }}
    />
  );
}