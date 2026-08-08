'use client';

import { useEffect } from 'react';

export function SuppressExtensionErrors() {
  useEffect(() => {
    const isExtensionError = (str: string) => {
      return (
        str.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
        str.includes('inpage.js') ||
        str.includes('MetaMask') ||
        str.includes('ethereum') ||
        str.includes('chrome-extension://') ||
        str.includes('moz-extension://') ||
        str.includes('Failed to connect')
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason?.stack || event.reason?.message || event.reason || '');
      if (isExtensionError(reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const source = String(event.filename || '');
      const msg = String(event.message || '');
      const errorStack = String(event.error?.stack || '');
      if (isExtensionError(source) || isExtensionError(msg) || isExtensionError(errorStack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    // Suppress console.error overlay triggers originating from browser extensions
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const fullText = args.map((a) => String(a?.stack || a?.message || a || '')).join(' ');
      if (isExtensionError(fullText)) {
        return; // Suppress from Next.js error overlay
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('error', handleError, true);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
}
