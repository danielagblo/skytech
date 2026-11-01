"use client";

import { useEffect } from "react";

/**
 * Automatically catches Next.js / Webpack ChunkLoadError (404 on stale JS chunks after a new deployment)
 * and seamlessly reloads the window to pull the fresh HTML and updated chunk manifests.
 */
export function ChunkErrorListener() {
  useEffect(() => {
    const isChunkFailure = (err: any, msg?: string) => {
      const name = err?.name || "";
      const message = String(err?.message || msg || "");
      return (
        name === "ChunkLoadError" ||
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("Loading failed for the <script>") ||
        message.includes("Failed to fetch dynamically imported module") ||
        message.includes("missing: ")
      );
    };

    const triggerAutoReload = () => {
      try {
        const lastReload = sessionStorage.getItem("chunk_reload_timestamp");
        const now = Date.now();
        // Prevent infinite reload loops if network is disconnected: max once per 15s
        if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
          sessionStorage.setItem("chunk_reload_timestamp", String(now));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkFailure(event.reason)) {
        event.preventDefault();
        triggerAutoReload();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isChunkFailure(event.error, event.message)) {
        event.preventDefault();
        triggerAutoReload();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError, true);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  return null;
}
