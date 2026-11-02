import { NextRequest } from "next/server";
import { getAuthUser, formatUser, hashPassword, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { camelize } from "@/lib/case-conversion";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    const cleanUserId = String(userId || "").trim();
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ? LIMIT 1", [cleanUserId]);
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
    const cleanUserId = String(userId || "").trim();
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    await initCrmSchema();

    const existing = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ? LIMIT 1", [cleanUserId]);
    if (!existing.length) return apiError("User not found", 404);

    const firstName = body.firstName !== undefined 
      ? body.firstName 
      : (rawBody.first_name !== undefined ? rawBody.first_name : existing[0].first_name);

    const lastName = body.lastName !== undefined 
      ? body.lastName 
      : (rawBody.last_name !== undefined ? rawBody.last_name : existing[0].last_name);

    const email = body.email !== undefined 
      ? body.email.trim().toLowerCase() 
      : (rawBody.email !== undefined ? rawBody.email.trim().toLowerCase() : existing[0].email);

    const phone = body.phone !== undefined 
      ? body.phone 
      : (rawBody.phone !== undefined ? rawBody.phone : existing[0].phone);

    const username = body.username !== undefined 
      ? body.username 
      : (rawBody.username !== undefined ? rawBody.username : existing[0].username);

    const role = body.role !== undefined 
      ? body.role 
      : (rawBody.role !== undefined ? rawBody.role : existing[0].role);

    const planTier = body.planTier !== undefined 
      ? body.planTier 
      : (rawBody.plan_tier !== undefined ? rawBody.plan_tier : existing[0].plan_tier);

    const isActive = body.active !== undefined
      ? (body.active ? 1 : 0)
      : (rawBody.is_active !== undefined
          ? (rawBody.is_active ? 1 : 0)
          : (existing[0].is_active ? 1 : 0));

    const updates: string[] = [
      "first_name = ?",
      "last_name = ?",
      "email = ?",
      "phone = ?",
      "username = ?",
      "role = ?",
      "plan_tier = ?",
      "is_active = ?",
    ];

    const paramsList: any[] = [
      firstName,
      lastName,
      email,
      phone,
      username,
      role,
      planTier || "FREE",
      isActive,
    ];

    const newPassword = body.password || rawBody.password;
    if (newPassword && String(newPassword).trim().length >= 8) {
      const hashed = await hashPassword(String(newPassword).trim());
      updates.push("password_hash = ?");
      paramsList.push(hashed);
    }

    updates.push("updated_at = NOW()");
    paramsList.push(cleanUserId);

    await crmExecute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      paramsList
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ?", [cleanUserId]);
    return apiSuccess(formatUser(updated[0]), "User updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export const PATCH = PUT;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    const cleanUserId = String(userId || "").trim();
    await initCrmSchema();
    await crmExecute("UPDATE users SET deleted_at = NOW(), is_active = 0 WHERE id = ?", [cleanUserId]);
    return apiSuccess(null, "User deleted");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
