import { NextRequest } from "next/server";
import { getAuthUser, canAccessBooks, apiSuccess, apiError } from "@/lib/crm/auth";
import { initCrmSchema } from "@/lib/crm/db";
import { BookError, postRecurringEntry } from "@/lib/crm/books";
import { camelize } from "@/lib/case-conversion";

export async function POST(
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
    const body = (camelize(rawBody) || {}) as { entryDate?: string };
    const entry = await postRecurringEntry(
      user,
      entryId,
      String(body.entryDate || ""),
    );
    return apiSuccess(entry, "Posted to this month.", 201);
  } catch (error) {
    const status = error instanceof BookError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "The schedule could not be posted.";
    return apiError(message, status);
  }
}
