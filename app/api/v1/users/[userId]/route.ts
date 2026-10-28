import { NextRequest } from "next/server";
import { getAuthUser, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);
    if (!rows.length) return apiError("User not found", 404);

    return apiSuccess(formatUser(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    const body = await request.json();
    await initCrmSchema();

    await crmExecute(
      `UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        username = COALESCE(?, username),
        role = COALESCE(?, role),
        is_active = COALESCE(?, is_active),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.firstName ?? null,
        body.lastName ?? null,
        body.phone ?? null,
        body.username ?? null,
        body.role ?? null,
        body.active !== undefined ? (body.active ? 1 : 0) : null,
        userId,
      ]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ?", [userId]);
    return apiSuccess(formatUser(updated[0]), "User updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    await initCrmSchema();
    await crmExecute("UPDATE users SET deleted_at = NOW(), is_active = 0 WHERE id = ?", [userId]);
    return apiSuccess(null, "User deleted");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
