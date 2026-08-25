"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-white px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
      <p className="max-w-md text-slate-600">
        The page hit a temporary error. You can try again, or go back to the homepage.
      </p>
      {process.env.NODE_ENV === "development" && error?.message ? (
        <p className="max-w-lg break-words rounded-lg bg-red-50 px-3 py-2 text-left text-xs text-red-700">
          {error.message}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
