import { NextRequest } from "next/server";
import { getAuthUser, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { camelize } from "@/lib/case-conversion";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const actor = await getAuthUser(request);
    if (!actor) return apiError("Unauthorized", 401);
    if (actor.role !== "ADMIN") {
      return apiError("Only an administrator can change Books access.", 403);
    }

    await initCrmSchema();
    const { userId } = await params;
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as { enabled?: boolean };
    if (typeof body.enabled !== "boolean") {
      return apiError("Choose whether this person can open Books.", 400);
    }

    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [userId],
    );
    if (!rows.length) return apiError("That user was not found.", 404);
    if (rows[0].role === "ADMIN") {
      return apiError("Administrators always have access to Books.", 400);
    }

    await crmExecute(
      "UPDATE users SET books_access = ?, updated_at = NOW() WHERE id = ?",
      [body.enabled ? 1 : 0, userId],
    );
    const updated = await crmQuery<MysqlRow>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [userId],
    );
    return apiSuccess(
      formatUser(updated[0]),
      body.enabled ? "Books access assigned." : "Books access removed.",
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Books access could not be updated.";
    return apiError(message, 500);
  }
}
