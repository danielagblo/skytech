'use client';

import { useEffect } from 'react';

/**
 * AutoDeploymentGuard:
 * Catches ChunkLoadError (e.g. 404 when stale JS chunks are replaced on Hostinger / new deployments)
 * and triggers a session-safe reload to fetch fresh assets.
 */
export default function AutoDeploymentGuard() {
  useEffect(() => {
    const handleChunkError = (error: any) => {
      const message =
        error?.message ||
        error?.error?.message ||
        error?.reason?.message ||
        (typeof error === 'string' ? error : '');
      const name =
        error?.name ||
        error?.error?.name ||
        error?.reason?.name ||
        '';

      const isChunkError =
        Boolean(message && /loading chunk/i.test(message)) ||
        name === 'ChunkLoadError' ||
        Boolean(message && /chunkloaderror/i.test(message));

      if (isChunkError) {
        try {
          // Check if we already tried reloading recently to avoid reload loops
          const lastRetry = sessionStorage.getItem('chunk-retry');
          if (!lastRetry) {
            sessionStorage.setItem('chunk-retry', String(Date.now()));
            console.warn('New auto-deployment detected. Refreshing assets...');
            window.location.reload();
          }
        } catch {
          // Do not reload blindly if storage fails
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleChunkError(event.reason || event);
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // After 15 seconds of stable session, clear flag so future deployments can also reload cleanly
    const timer = setTimeout(() => {
      try {
        sessionStorage.removeItem('chunk-retry');
      } catch {}
    }, 60000);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
