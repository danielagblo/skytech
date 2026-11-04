import { NextRequest } from "next/server";
import { getAuthUser, canAccessBooks, apiSuccess, apiError } from "@/lib/crm/auth";
import { initCrmSchema } from "@/lib/crm/db";
import { BookError, deleteBookEntry, updateBookEntry } from "@/lib/crm/books";
import { camelize } from "@/lib/case-conversion";
import type { SaveBookEntryRequest } from "@/types/book.types";

const fail = (error: unknown, fallback: string) => {
  const status = error instanceof BookError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;
  return apiError(message || fallback, status);
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (!canAccessBooks(user)) return apiError("You do not have access to Books.", 403);
    await initCrmSchema();
    const { entryId } = await params;
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as SaveBookEntryRequest;
    const entry = await updateBookEntry(entryId, body);
    return apiSuccess(entry, "Entry updated.");
  } catch (error) {
    return fail(error, "The entry could not be updated.");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (!canAccessBooks(user)) return apiError("You do not have access to Books.", 403);
    await initCrmSchema();
    const { entryId } = await params;
    await deleteBookEntry(entryId);
    return apiSuccess({ id: entryId }, "Entry removed.");
  } catch (error) {
    return fail(error, "The entry could not be removed.");
  }
}
