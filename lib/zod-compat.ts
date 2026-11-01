import { z } from "zod";

// Polyfill Zod v4 compatibility with @hookform/resolvers/zod
// In Zod v4, error.errors was replaced with error.issues.
// @hookform/resolvers expects error.errors to be an Array.
try {
  const dummy = z.string().safeParse(123);
  if (!dummy.success && dummy.error) {
    const proto = Object.getPrototypeOf(dummy.error);
    if (proto && !("errors" in proto)) {
      Object.defineProperty(proto, "errors", {
        get() {
          return this.issues || [];
        },
        set(val) {
          this.issues = val;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch {
  // Ignore in environments where safeParse is not needed
}
