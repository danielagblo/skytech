import { NextRequest } from "next/server";
import { getAuthUser, formatUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (user.role !== "ADMIN") return apiError("Forbidden", 403);

    const { userId } = await params;
    const body = await request.json();
    const role = body.role;
    if (!role) return apiError("Role is required", 400);

    await initCrmSchema();
    await crmExecute("UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?", [role, userId]);
    const updated = await crmQuery<MysqlRow>("SELECT * FROM users WHERE id = ?", [userId]);
    return apiSuccess(formatUser(updated[0]), "Role updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
