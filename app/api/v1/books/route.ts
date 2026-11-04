import { NextRequest } from "next/server";
import { getAuthUser, canAccessBooks, apiSuccess, apiError } from "@/lib/crm/auth";
import { initCrmSchema } from "@/lib/crm/db";
import { BookError, createBookEntry, loadBooks, resolveBookRange } from "@/lib/crm/books";
import { camelize } from "@/lib/case-conversion";
import type { SaveBookEntryRequest } from "@/types/book.types";

const fail = (error: unknown, fallback: string) => {
  const status = error instanceof BookError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;
  return apiError(message || fallback, status);
};

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (!canAccessBooks(user)) return apiError("You do not have access to Books.", 403);
    await initCrmSchema();
    const url = new URL(request.url);
    const range = resolveBookRange(
      url.searchParams.get("from"),
      url.searchParams.get("to"),
    );
    const data = await loadBooks(range, {
      type: url.searchParams.get("type") || "",
      source: url.searchParams.get("source") || "",
      search: url.searchParams.get("search") || "",
    });
    return apiSuccess(data);
  } catch (error) {
    return fail(error, "The books could not be loaded.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (!canAccessBooks(user)) return apiError("You do not have access to Books.", 403);
    await initCrmSchema();
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as SaveBookEntryRequest;
    const entry = await createBookEntry(user, body);
    return apiSuccess(entry, "Entry saved.", 201);
  } catch (error) {
    return fail(error, "The entry could not be saved.");
  }
}
