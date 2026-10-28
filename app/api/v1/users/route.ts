import { NextRequest } from "next/server";
import { getAuthUser, hashPassword, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );

    const content = rows.map(formatUser);
    return apiSuccess({
      content,
      page: 0,
      size: content.length,
      totalElements: content.length,
      totalPages: 1,
      last: true,
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return apiError("Only administrators or managers can create team members", 403);
    }

    await initCrmSchema();
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "Skytech@123";

    if (!email) return apiError("Email is required", 400);

    const existing = await crmQuery<MysqlRow>(
      "SELECT id FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL LIMIT 1",
      [email]
    );
    if (existing.length) return apiError("User with this email already exists", 409);

    const userId = newId();
    const hashed = await hashPassword(password);

    await crmExecute(
      `INSERT INTO users (
        id, company_id, first_name, last_name, email, password_hash,
        phone, username, role, plan_tier, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        user.companyId || null,
        body.firstName || "",
        body.lastName || "",
        email,
        hashed,
        body.phone || null,
        body.username || null,
        body.role || "AGENT",
        body.planTier || "FREE",
        body.active !== false ? 1 : 0,
      ]
    );

    const created = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ?", [userId]);
    return apiSuccess(formatUser(created[0]), "User created successfully", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
