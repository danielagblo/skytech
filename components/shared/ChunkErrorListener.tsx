"use client";

import { useEffect } from "react";

/**
 * Catches ChunkLoadError (404 on stale JS chunks after a deployment)
 * and safely reloads the window once to fetch the latest build manifest.
 */
export function ChunkErrorListener() {
  useEffect(() => {
    const isChunkFailure = (err: any, msg?: string) => {
      const name = err?.name || "";
      const message = String(err?.message || msg || "");
      return (
        name === "ChunkLoadError" ||
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk")
      );
    };

    const triggerAutoReload = () => {
      try {
        const lastReload = sessionStorage.getItem("chunk_reload_timestamp");
        const now = Date.now();
        // Only allow reload once every 20 seconds to prevent loops
        if (!lastReload || now - parseInt(lastReload, 10) > 20000) {
          sessionStorage.setItem("chunk_reload_timestamp", String(now));
          window.location.reload();
        }
      } catch {
        // Ignore storage errors in private browsing
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkFailure(event.reason)) {
        triggerAutoReload();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isChunkFailure(event.error, event.message)) {
        triggerAutoReload();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
