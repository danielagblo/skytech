"use client";

import { useSearchParams } from "next/navigation";

export default function LoginErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  return (
    <div className="text-sm text-red-600 mb-3">Invalid username or password.</div>
  );
}
